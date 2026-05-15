import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import nodemailer from 'nodemailer';
import sendVerificationEmail from '../services/sendVerification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResetPasswordEmail } from '../services/resetVerification.js';
import dbconnection from '../db/dbconnection.js';
//______________signup______________________//

const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password, } = req.body



    const findEmail = await User.findOne({ email })
    if (findEmail) {
        const err = new Error('Email already exists')
        err.status = 409
        return next(err)
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const signupData = await User.create({
        name, email,
        password: hashPassword,
        role: 'user',
        isVerified: false,
    })



    if (signupData.role === 'user') {
        const verification = jwt.sign(
            { id: signupData._id },
            process.env.Secret_Verify_key,
            { expiresIn: '24h' }
        )
        sendVerificationEmail(signupData.email, verification);
        return res.status(201).send({ message: "User created, please verify your email" });
    }

    return res.status(201).send({ message: "Admin user is created" });
})


//______________login______________________//

const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    const loginData = await User.findOne({ email })
    if (!loginData) {
        const err = new Error('User not found')
        err.status = 404
        return next(err)
    }
    if (!loginData.isVerified) {
        return next(new Error("Please verify your email first"))
    }

    const isPasswordMatch = await bcrypt.compare(password, loginData.password)
    if (!isPasswordMatch) {
        const err = new Error('Password is incorrect')
        err.status = 401
        return next(err)
    }

    const token = jwt.sign(
        { id: loginData._id, role: loginData.role, name: loginData.name },
        process.env.Secret_Auth_key,
        { expiresIn: '1d' }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).send({ message: "Login successful" })
})


//______________logout______________________//

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.status(200).send({ message: "User logged out successfully" })
})


//______________verification______________________//

const verify = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const { token } = req.params;

    if (!token) {
        const err = new Error('Token not provided')
        err.status = 400
        return next(err)
    }


    let decoded;
    try {
        decoded = jwt.verify(token, process.env.Secret_Verify_key);
    } catch (err) {
        const error = new Error('Invalid or expired token')
        error.status = 400
        return next(error)
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        const err = new Error('User not found')
        err.status = 404
        return next(err)
    }

    if (user.isVerified) {
        const err = new Error('User already verified')
        err.status = 400
        return next(err)
    }

    user.isVerified = true;
    await user.save();
    res.status(200).send({ message: "User verified successfully" });
})


//______________reset Password______________________//

const resetPassword = asyncHandler(async (req, res, next) => {
    await dbconnection()
    const { email } = req.body

    const findEmail = await User.findOne({ email })
    if (!findEmail) {
        return res.status(200).json({
            message: "If account exists, email sent"
        });
    }
    const token = jwt.sign(
        { userId: findEmail._id },
        process.env.Secret_Reset_key,
        { expiresIn: '10min' }
    )
    sendResetPasswordEmail(email, token);
    return res.status(200).json({
        message: "Reset password email sent"
    })
})


//______________change password______________________//

const changePassword = asyncHandler(async (req, res, next) => {

    const { newPassword } = req.body
    const { token } = req.params

    if (!token) {
        const err = new Error('Token not provided')
        err.status = 400
        return next(err)
    }
    if (!newPassword || newPassword.length < 6) {
        const err = new Error("Password must be at least 6 characters");
        err.status = 400;
        return next(err);
    }
    let decodeToken;
    try {
        decodeToken = jwt.verify(token, process.env.Secret_Reset_key)
    } catch (err) {
        const error = new Error('Invalid or expired token')
        error.status = 400
        return next(error)
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)
    const updatedPassword = await User.findByIdAndUpdate(
        decodeToken.userId,
        { password: hashPassword },
        { new: true }
    )

    if (!updatedPassword) {
        const err = new Error('User not found')
        err.status = 404
        return next(err)
    }

    res.status(200).json({ message: "Password updated successfully" });
})


//______________status______________________//

const status = asyncHandler(async (req, res) => {
    res.status(200).json({
        user: req.user
    });
})


//______________google callback______________________//

const googleCallback = asyncHandler(async (req, res) => {
    const user = req.user
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.Secret_Auth_key,
        { expiresIn: "7d" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    res.redirect(process.env.FRONTEND_URL)
})


export { signup, login, logout, verify, resetPassword, changePassword, status, googleCallback }