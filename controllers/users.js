import sharp from "sharp";
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import users from '../models/usersSchema.js'
import { uploadSingleimage } from "../middlewares/uploadimagesMiddleware.js";
import { createMethod, deleteMethod, getAllMethod, getOneMethod } from './handlersFactory.js';
import { APIerrors } from "../utils/Errors.js";
import createToken from "../utils/createToken.js";

export const uploadUserImage = uploadSingleimage('profileImage')

export const resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `user-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(450, 400)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${fileName}`)
        req.body.profileImage = fileName;
    }
    next();
})

// Admin Area

// @desc    Get users
// @route   GET /api/users
// @access  Private
// @author  Abdelrahman Sherif
export const getUsers = getAllMethod(users, 'users');

// @desc    Get specific user by id
// @route   GET /api/users/:_id
// @access  Private
// @author  Abdelrahman Sherif
export const getUser = getOneMethod(users);

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const createUser = createMethod(users)

// @desc    Update specific user
// @route   PUT /api/users/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const updateUser = expressAsyncHandler(async (req, res, next) => {
    const { _id } = req.params
    const updatedDocument = await users.findByIdAndUpdate(_id, {
        $set: {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            profileImage: req.body.profileImage,
            phone: req.body.phone,
            role: req.body.role,
            active: req.body.active
        }
    }, { new: true })
    if (!updatedDocument) { return next(new APIerrors('Item Not Found', 404)) }
    else { res.json({ message: "Item Updated Successfully", updatedDocument }) }
});

// @desc    Update specific user password
// @route   PUT /api/users/:_id/updatePassword
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const changeUserPassword = expressAsyncHandler(async (req, res, next) => {
    const { _id } = req.params
    const updatedDocument = await users.findByIdAndUpdate(_id, {
        $set:
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        }
    }, { new: true })
    if (!updatedDocument) { return next(new APIerrors('Item Not Found', 404)) }
    else { res.json({ message: "Item Updated Successfully", updatedDocument }) }
});

// @desc    Delete specific user
// @route   DELETE /api/users/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const deleteUser = deleteMethod(users)

// Logged User Area

export const getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
    req.params._id = req.user._id;
    next();
});

export const updateLoggedUserPassword = expressAsyncHandler(async (req, res, next) => {
    const user = await users.findByIdAndUpdate(req.user._id, {
        $set:
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        }
    }, { new: true })
    if (!user) { return next(new APIerrors('Item Not Found', 404)) }
    else {
        const token = createToken(user._id)
        res.status(200).json({ message: "User Password Updated Successfully", user, token })
    }
    next();
});

export const updateLoggedUserData = expressAsyncHandler(async (req, res, next) => {
    const user = await users.findByIdAndUpdate(req.user._id, {
        $set: {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            profileImage: req.body.profileImage,
            phone: req.body.phone
        }
    }, { new: true })

    res.status(200).json({ user })
})

export const deleteLoggedUser = expressAsyncHandler(async (req, res, next) => {
    await users.findByIdAndDelete(req.user._id);
    res.status(204).json({ status: "success" })
})