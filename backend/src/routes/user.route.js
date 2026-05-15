import { Router } from "express";
import {
    signup, login, logout,
    resetPassword, changePassword,
    status, googleCallback
} from "../controllers/user.controller.js";

import passport from "passport";
import auth from "../middleware/auth.middleware.js";
import { Limiter } from "../middleware/rate.middleware.js";
import { signupValidation } from "../middleware/validation.js";
import { loginValidation } from "../middleware/validation.js";
import { validate } from "../middleware/validate.middleware.js";

const userRouter = Router();

userRouter.post('/signup', Limiter, signupValidation, validate, signup);
userRouter.post('/login', Limiter, loginValidation, validate, login);
userRouter.post('/logout', logout);


userRouter.post('/reset', Limiter, resetPassword);
userRouter.post('/newPassword/:token', changePassword);

userRouter.get('/status', auth, status);

userRouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRouter.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login`
    }),
    googleCallback
);

export default userRouter;