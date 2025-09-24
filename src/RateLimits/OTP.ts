import { rateLimit  } from 'express-rate-limit';

export const OTPRateLimit = rateLimit({
    handler: (req, res) => {
    res.status(401).json({
        message: 'Please try again after a min'
    })
    },
    limit: 1,
    validate: {
        xForwardedForHeader: false
    },
    windowMs: 1 * 60 * 1000
})

export const verifyEmailOTP = rateLimit({
     handler: (req, res) => {
    res.status(401).json({
        message: 'Please try again after a min'
    })
    },
    limit: 3,
    validate: {
        xForwardedForHeader: false
    },
    windowMs: 1 * 60 * 1000
})