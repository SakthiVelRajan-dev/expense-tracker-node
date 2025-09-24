import { addLogger } from '@Config/logger.js';
import { Messages } from '@Constants/message.js';
import { AuthRequest } from '@interface/Auth.js';
import { sendChangePasswordEmail, sendForgotOTPEmail } from '@Mail/OTP.js';
import { isUser } from '@Middleware/isUser.js';
import { jwtVerify } from '@Middleware/jwtVerify.js';
import User from '@Schema/User.js';
import Verification, { VerificationType } from '@Schema/Verification.js';
import { generateRandomOTP } from '@utils/generateOTP.js';
import { generateToken } from '@utils/generateToken.js';
import { getRateLimit } from '@utils/getRateLimit.js';
import bcrypt from 'bcryptjs';
import express from 'express';

const emailPasswordRouter = express.Router();

emailPasswordRouter.post('/sign-up', async (req, res) => {
    const request_body = req.body as AuthRequest;
    const email = request_body.email;
    const password = request_body.password;
    const role = request_body.role;
    if (!email || !password) {
        return res.status(401).json({
            message: 'Invalid request'
        });
    }
    if (role === 'super_admin') {
        return res.status(401).json({
            message: 'Unable to create an user'
        })
    }
    const user = await User.findOne({
        email,
        type: 'email-password',
    }).exec();
    if (user) {
        return res.status(401).json({
            message: 'User already exists'
        });
    }
    await User.insertOne({
        email,
        password,
        role,
        type: 'email-password'
    });
    res.status(201).json({
        message: 'User Created Succesfully'
    })
});

emailPasswordRouter.post('/login', getRateLimit(3, 5, 'Please try login after 5 mins') , async (req, res) => {
    const request_body = req.body as AuthRequest;
    const email = request_body.email;
    const password:string = request_body.password;
    
    if (!email || !password) {
        return res.status(401).send('Invalid request');
    }
    addLogger('info', 'app', 'Email Password Login', [{
        email,
    }])
    const user = await User.findOne({
        email,
        type: 'email-password'
    }).exec();
    if (!user) {
        return res.status(401).json({
            message: 'User not found'
        });
    }
    let isValidPassword = false
    if (user.role === 'log_user' || user.role === 'super_admin') {
        isValidPassword = user.password === password;
    } else {
        isValidPassword = await bcrypt.compare(password, (user.password ?? ''));
    }
    if(!isValidPassword) {
        return res.status(401).json({
            message: 'Invalid password'
        });
    }
    const token = generateToken({
        email: user.email,
        id: user._id,
        is_email_verified: user.is_email_verified,
        role: user.role
    });
    addLogger('error', 'error', 'Email Password Login', [{
        email,
    }])
    res.status(200).json({
        data: {
            token
        },
        message: 'User Login Successful'
    })
});

emailPasswordRouter.post('/reset-password-otp', getRateLimit(3, 1, 'Please try again after a min'), async (req, res) => {
  const {email} = (req.body ?? {}) as { email?: string };
  if (!email) {
    return res.status(400).json({
        message: Messages.INVALID_REQUEST_PAYLOAD
    });
  }
  const code = generateRandomOTP();
  const now = new Date();
  const expires_at = new Date();
  expires_at.setMinutes(now.getMinutes() + 10);

  const userData = await User.findOne({
    email,
    role: 'user',
    type: 'email-password',
  }).lean().exec();

  if (!userData) {
    return res.status(400).json({
        message: Messages.USER_NOT_FOUND
    });
  }

  const user =await Verification.findOne({
    type: 'reset-password' as VerificationType,
    user: userData._id
  }).lean().exec();

  if (user) {
    await  Verification.findOneAndUpdate({
      type: 'reset-password' as VerificationType,
      user: userData._id
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
      type: 'reset-password',
      user: userData._id
    });
  }
  sendForgotOTPEmail(code, email);
  res.status(201).json({
    message: Messages.PASSWORD_RESET_OTP_SENT
  });
});

emailPasswordRouter.post('/reset-password', getRateLimit(3, 1, 'Please try again after a min'), async (req, res) => {
    const { email, OTP, password } = (req.body ?? {}) as {
        email?: string
        OTP: string;
        password?: string;
    };
    if (!OTP || !password || !email) {
        return res.status(400).json({
            message: Messages.INVALID_REQUEST_PAYLOAD
        });
    }

    const userData = await User.findOne({
        email,
        role: 'user',
        type: 'email-password',
    }).lean().exec();

    if (!userData) {
        return res.status(400).json({
            message: Messages.USER_NOT_FOUND
        });
    }

    const verificationData = await Verification.findOne({
        type: 'reset-password',
        user: userData._id
    }).lean().exec();

    const isValidOTP = verificationData?.code === +OTP;

    if (!isValidOTP) {
        return res.status(400).json({
            message: Messages.INVALID_OTP
        })
    }
    await User.findByIdAndUpdate(userData._id, {
        $set: {
          password
        }
      }, {
        lean: true
      }
    );
    await Verification.findOneAndDelete({
        type: 'reset-password' as VerificationType,
        user: userData._id
    }, {
        lean: true
    });

    res.status(201).json({
        message: Messages.PASSWORD_RESET
    })

})

emailPasswordRouter.post('/change-password-otp', jwtVerify, isUser, getRateLimit(3, 1, 'Please try again after a min'), async (req, res) => {
  const tokenDetail = req.session.tokenDetail;
  const code = generateRandomOTP();
  const now = new Date();
  const expires_at = new Date();
  expires_at.setMinutes(now.getMinutes() + 10);

  const user =await Verification.findOne({
    type: 'change-password' as VerificationType,
    user: tokenDetail?.id
  }).lean().exec();

  if (user) {
    await  Verification.findOneAndUpdate({
      type: 'change-password' as VerificationType,
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
      type: 'change-password' as VerificationType,
      user: tokenDetail?.id
    });
  }
  sendChangePasswordEmail(code, tokenDetail?.email ?? '');
  res.status(201).json({
    message: Messages.CHANGE_PASSWORD_OTP_SENT
  });
});

emailPasswordRouter.post('/change-password', jwtVerify, isUser, getRateLimit(3, 1, 'Please try again after a min'), async (req, res) => {
    const { OTP, password } = (req.body ?? {}) as {
        OTP: string;
        password?: string;
    };
    const tokenDetail = req.session.tokenDetail;
    if (!OTP || !password) {
        return res.status(400).json({
            message: Messages.INVALID_REQUEST_PAYLOAD
        });
    }
    const verificationData = await Verification.findOne({
        type: 'change-password' as VerificationType,
        user: tokenDetail?.id
    }).lean().exec();
    const isValidOTP = verificationData?.code === +OTP;
    if (!isValidOTP) {
        return res.status(400).json({
            message: Messages.INVALID_OTP
        })
    }
    await User.findByIdAndUpdate(tokenDetail?.id, {
        $set: {
          password
        }
      }, {
        lean: true
      }
    );
    await Verification.findOneAndDelete({
        type: 'change-password',
        user: tokenDetail?.id
    }, {
        lean: true
    });

    res.status(201).json({
        message: Messages.CHANGE_PASSWORD
    })

})

export default emailPasswordRouter;