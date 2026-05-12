import { rateLimit } from 'express-rate-limit'




const Limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Too many requests, try again later",
});


//this is for public api

const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests, try again later",
});


export { Limiter, publicLimiter }