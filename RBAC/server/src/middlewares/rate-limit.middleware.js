const { rateLimit } = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15min"
    }
});


const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many registration attempts. Please try again later."
    }
});


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, 

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});


module.exports = {
    loginLimiter,
    registerLimiter,
    apiLimiter
}