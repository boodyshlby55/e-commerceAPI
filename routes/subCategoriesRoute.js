import { Router } from "express";
import { createSubCategory, deleteSubCategory, filterData, getSubCategories, getSubCategory, resizeImage, setCategoryId, updateSubCategory, uploadSubcategoryImage } from "../controllers/subCategories.js";
import { createSubCategoryValidator, deleteSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator } from "../utils/validators/subCategoriesValidator.js";
import { allowedTo, protectRoutes } from "../controllers/auth.js";

const router = new Router({ mergeParams: true });

router.route('/')
    .get(filterData, getSubCategories)
    .post(protectRoutes, allowedTo('admin', 'manager'), uploadSubcategoryImage, resizeImage, setCategoryId, createSubCategoryValidator, createSubCategory)

router.route('/:_id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(protectRoutes, allowedTo('admin', 'manager'), uploadSubcategoryImage, resizeImage, updateSubCategoryValidator, updateSubCategory)
    .delete(protectRoutes, allowedTo('admin', 'manager'), deleteSubCategoryValidator, deleteSubCategory)


export default router