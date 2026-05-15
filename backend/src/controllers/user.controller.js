import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import dbconnection from '../db/dbconnection.js'

//______________signup______________________//

const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body

    const findEmail = await User.findOne({ email })
    if (findEmail) {
        const err = new Error('Email already exists')
        err.status = 409
        return next(err)
    }

    const hashPassword = await bcrypt.hash(password, 10)

    await User.create({
        name,
        email,
        password: hashPassword,
        role: 'user'
    })

    return res.status(201).send({
        message: "Signup successful"
    })
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

    const isPasswordMatch = await bcrypt.compare(password, loginData.password)
    if (!isPasswordMatch) {
        const err = new Error('Password is incorrect')
        err.status = 401
        return next(err)
    }

    const token = jwt.sign(
        {
            id: loginData._id,
            role: loginData.role,
            name: loginData.name
        },
        process.env.Secret_Auth_key,
        { expiresIn: '1d' }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.status(200).send({ message: "Login successful" })
})


//______________logout______________________//

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    res.status(200).send({ message: "User logged out successfully" })
})


//______________reset password (TOKEN ONLY)______________________//

const resetPassword = asyncHandler(async (req, res) => {

    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(200).json({
            message: "If account exists, reset link available"
        })
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.Secret_Reset_key,
        { expiresIn: '10m' }
    )

    return res.status(200).json({
        message: "Reset token generated",
        resetToken: token
    })
})


//______________change password______________________//

const changePassword = asyncHandler(async (req, res) => {

    const { newPassword } = req.body
    const { token } = req.params

    if (!newPassword || newPassword.length < 5) {
        const err = new Error("Password must be at least 5 characters")
        err.status = 400
        throw err
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.Secret_Reset_key)
    } catch {
        const err = new Error('Invalid or expired token')
        err.status = 400
        throw err
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)

    const user = await User.findByIdAndUpdate(
        decoded.userId,
        { password: hashPassword },
        { new: true }
    )

    if (!user) {
        const err = new Error('User not found')
        err.status = 404
        throw err
    }

    return res.status(200).json({
        message: "Password updated successfully"
    })
})


//______________status______________________//

const status = asyncHandler(async (req, res) => {
    res.status(200).json({
        user: req.user
    })
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


export {
    signup,
    login,
    logout,
    resetPassword,
    changePassword,
    status,
    googleCallback
}