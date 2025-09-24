import { rateLimit } from 'express-rate-limit'

export const getRateLimit = (limit: number, durationInMins: number, errorMsg: string) => {
    return rateLimit({
        legacyHeaders: false,
        limit,
        message: { message: errorMsg },
        standardHeaders: 'draft-7',
        statusCode: 429,
        validate: {
            xForwardedForHeader: false
        }, 
        windowMs: durationInMins * 60 * 1000,
    })
}