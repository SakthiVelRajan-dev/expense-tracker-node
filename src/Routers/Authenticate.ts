import { Messages } from '@Constants/message.js';
import { sendVerificationEmailOTP } from '@Mail/OTP.js';
import { jwtVerify } from '@Middleware/jwtVerify.js';
import User from '@Schema/User.js';
import Verification, { VerificationType } from '@Schema/Verification.js';
import { generateRandomOTP } from '@utils/generateOTP.js';
import express from 'express';
import { OTPRateLimit, verifyEmailOTP } from 'src/RateLimits/OTP.js';

import emailPasswordRouter from './EmailPasswordAuthenticate.js';
import googleAuthRouter from './GoogleAuthenticate.js';

const authenticateRouter = express.Router();

authenticateRouter.use('/google', googleAuthRouter);

authenticateRouter.use('/email', emailPasswordRouter);

authenticateRouter.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { next(err); return; }
    res.status(200).json({
        message: 'User logged out successfully'
    })
  });
});

authenticateRouter.post('/verify-email-otp', jwtVerify, OTPRateLimit , async (req, res) => {
    const tokenDetail = req.session.tokenDetail;
    const code = generateRandomOTP();
    const now = new Date();
    const expires_at = new Date();
    expires_at.setMinutes(now.getMinutes() + 10)

    if (tokenDetail?.is_email_verified) {
      return res.status(400).json({
        message: Messages.EMAIL_ALREADY_VERIFIED
      });
    }
    const user =await Verification.findOne({
      type: 'email-verify' as VerificationType,
      user: tokenDetail?.id
    }).lean().exec();
  
    if (user) {
      await  Verification.findOneAndUpdate({
        user: tokenDetail?.id
      }, {
        $set: {
          code,
          expires_at,
        }
      }, {
        returnDocument: 'after',
        upsert: true
      })
    } else {
      await Verification.insertOne({
        code,
        expires_at,
        type: 'email-verify',
        user: tokenDetail?.id
      });
    }
    sendVerificationEmailOTP(code, tokenDetail?.email ?? '');
    res.status(201).json({
      message: Messages.EMAIL_VERIFICATION_OTP_SENT
    });

});

authenticateRouter.post('/verify-email', jwtVerify, verifyEmailOTP, async(req, res) => {
  const tokenDetail = req.session.tokenDetail;
  const OTP =((req.body as { otp?: string }).otp ?? '');
  if (tokenDetail?.is_email_verified) {
    return res.status(400).json({
      message: Messages.EMAIL_ALREADY_VERIFIED
    });
  }
  //regex for checking exact 6 digit OTP
  if (!/^\d{6}$/.test(OTP)) {
    return res.status(400).json({
      message: OTP ? Messages.INVALID_OTP : Messages.INVALID_REQUEST_PAYLOAD
    });
  }
  const user = await Verification.findOne({
    type: 'email-verify',
    user: tokenDetail?.id
  });
  if (!user) {
    return res.status(400).json({
      message: Messages.OTP_NOT_FOUND
    });
  }
  const isValidOTP = user.code === +OTP;
  if (!isValidOTP) {
    return res.status(400).json({
      message: Messages.INVALID_OTP
    })
  }
  await User.findByIdAndUpdate(tokenDetail?.id, {
    $set: {
      is_email_verified: true
    }
  }, {
    lean: true
  })
  await Verification.findOneAndDelete({
    type: 'email-verify',
    user: tokenDetail?.id
  }, {
    lean: true
  });
  res.status(201).json({
    message: Messages.EMAIL_VERIFIED
  })
})

export default authenticateRouter;