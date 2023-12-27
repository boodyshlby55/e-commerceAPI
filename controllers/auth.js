import crypto from 'crypto';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'
import Jwt from 'jsonwebtoken';
import users from '../models/usersSchema.js'
import { APIerrors } from "../utils/Errors.js";
import sendEmail from '../utils/sendEmail.js';
import createToken from '../utils/createToken.js'

// @desc    signUp
// @route   POST /api/signUp
// @access  Public
// @author  Abdelrahman Sherif
export const signUp = expressAsyncHandler(async (req, res, next) => {
    const user = await users.create(req.body);
    const token = createToken(user._id);
    res.status(201).json({ user, token })
})

// @desc    login
// @route   POST /api/login
// @access  Public
// @author  Abdelrahman Sherif
export const login = expressAsyncHandler(async (req, res, next) => {
    const user = await users.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new APIerrors('Invalid email or password', 401))
    }
    const token = createToken(user._id);
    res.status(200).json({ user, token })
})

// @desc check if user login
export const protectRoutes = expressAsyncHandler(async (req, res, next) => {
    // check if token exist
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) { return next(new APIerrors('You are not logged in! Please log in to get access.', 401)); }

    // verify token
    const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY)

    // check if user exist
    const currentUser = await users.findById(decoded._id)
    if (!currentUser) { return next(new APIerrors('The user account does not exists!', 401)) }

    // check if user change password
    if (currentUser.passwordChangedAt) {
        const passwordChangeTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10)
        if (passwordChangeTimeStamp > decoded.iat) { return next(new APIerrors('Your password has been changed, please log in again with your new password.', 401)) }
    }
    // store the user data in req object for other routes
    req.user = currentUser;

    next();
})

// @desc permissions to access routes
export const allowedTo = (...roles) =>
    expressAsyncHandler(async (req, res, next) => {
        if (!(roles.includes(req.user.role))) { return next(new APIerrors(`Provilege denied! You cannot perform this action`, 403)) }
        next();
    })

// @desc    forget password
// @route   POST api/auth/forgetPassword
// @access  Public
// @author  Abdelrahman Sherif
export const forgetPassword = expressAsyncHandler(async (req, res, next) => {
    // 1) Get the user by email
    const user = await users.findOne({ email: req.body.email });
    if (!user) { return next(new APIerrors(`This is no user registered with email ${req.body.email}!`, 404)) };

    // 2) Generate a random reset code and set it on the user's record
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // Save hashed password reset code to DB
    user.passwordResetCode = hashedResetCode;

    // set expire time to password reset code
    user.passwordResetCodeExpires = Date.now() + (10 * 60 * 1000);
    user.passwordResetCodeVerify = false;

    await user.save({ validateBeforeSave: false, });

    // 3) Send the reset code using email
    const message = `Hi ${user.name}\nYour Password Reset Code is ${resetCode}`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Code',
            message
        })
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetCodeExpires = undefined;
        user.passwordResetCodeVerify = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new APIerrors(`We can't send message to this email`, 500))
    }
    res.status(200).json({ success: true, msg: "Check your email" });
})

let hashedResetCode;

export const verifyResetPasswordCode = expressAsyncHandler(async (req, res, next) => {
    hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');
    const user = await users.findOne({ passwordResetCode: hashedResetCode, passwordResetCodeExpires: { $gt: Date.now() } })
    if (!user) { return next(new APIerrors("Invalid or expired reset code")); }

    user.passwordResetCodeVerify = true;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: user });
})

export const resetPassword = expressAsyncHandler(async (req, res, next) => {
    const user = await users.findOne({ passwordResetCode: hashedResetCode })
    // const user = await users.findOne({ email: req.body.email })
    if (!user) { return next(new APIerrors("There is no user registered ", 404)); }
    else if (!user.passwordResetCodeVerify) { return next(new APIerrors("Please Verify Your Email first", 400)); }
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetCodeVerify = undefined;
    user.passwordChangedAt = Date.now();
    await user.save({ validateBeforeSave: false })

    const token = createToken(user._id);
    res.status(200).json({ token })
})