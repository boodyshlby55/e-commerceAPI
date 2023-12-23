import sharp from "sharp";
import expressAsyncHandler from "express-async-handler";
import subCategories from "../models/subCategoriesSchema.js";
import { uploadSingleimage } from "../middlewares/uploadimagesMiddleware.js";
import { createMethod, deleteMethod, getAllMethod, getOneMethod, updateMethod } from './handlersFactory.js';

export const uploadSubcategoryImage = uploadSingleimage('image')

export const resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `subcategory-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(450, 400)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/subcategories/${fileName}`)
        req.body.image = fileName;
    }
    next();
})

// @desc    filter data middleware
// @route   GET /api/subCategories
// @access  Public
// @author  Abdelrahman Sherif
export const filterData = (req, res, next) => {
    let filterData = {};
    if (req.params.categoryId) { filterData = { category: req.params.categoryId } };
    req.filterData = filterData;
    next();
}

// @desc    Set category Id middleware
// @route   POST /api/subCategories
// @access  Private
// @author  Abdelrahman Sherif
export const setCategoryId = (req, res, next) => {
    if (!req.body.category) { req.body.category = req.params.categoryId }
    next();
}


// @desc    Get subCategories
// @route   GET /api/subCategories
// @access  Public
// @author  Abdelrahman Sherif
export const getSubCategories = getAllMethod(subCategories, 'subCategories');

// @desc    Get specific subCategory by id
// @route   GET /api/subCategories/:_id
// @access  Public
// @author  Abdelrahman Sherif
export const getSubCategory = getOneMethod(subCategories);

// @desc    Create SubCategory
// @route   POST /api/subCategories
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const createSubCategory = createMethod(subCategories);

// @desc    Update specific subCategory
// @route   PUT /api/subCategories/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const updateSubCategory = updateMethod(subCategories);

// @desc    Delete specific subCategory
// @route   DELETE /api/subCategories/:_id
// @access  Private/Admin
// @author  Abdelrahman Sherif
export const deleteSubCategory = deleteMethod(subCategories);