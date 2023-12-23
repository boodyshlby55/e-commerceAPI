import sharp from "sharp";
import expressAsyncHandler from 'express-async-handler';
import Categories from '../models/categorySchema.js'
import { uploadSingleimage } from "../middlewares/uploadimagesMiddleware.js";
import { createMethod, deleteMethod, getAllMethod, getOneMethod, updateMethod } from './handlersFactory.js';

export const uploadCategoryImage = uploadSingleimage('image')

export const resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `category-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(450, 400)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/categories/${fileName}`)
        req.body.image = fileName;
    }
    next();
})

// @desc    Get categories
// @route   GET /api/categories
// @access  Public
// @author  Abdelrahman Sherif
export const getCategories = getAllMethod(Categories, 'Categories');

// @desc    Get specific category by id
// @route   GET /api/categories/:_id
// @access  Public
// @author  Abdelrahman Sherif
export const getCategory = getOneMethod(Categories);

// @desc    Create Category
// @route   POST /api/categories
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const createCategory = createMethod(Categories)

// @desc    Update specific Category
// @route   PUT /api/categories/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const updateCategory = updateMethod(Categories);

// @desc    Delete specific Category
// @route   DELETE /api/categories/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const deleteCategory = deleteMethod(Categories)