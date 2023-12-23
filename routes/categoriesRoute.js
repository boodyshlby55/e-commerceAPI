import { Router } from "express";
import { createCategory, deleteCategory, getCategories, getCategory, resizeImage, updateCategory, uploadCategoryImage } from "../controllers/categories.js";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validators/categoriesValidator.js";
import { allowedTo, protectRoutes } from "../controllers/auth.js";
import SubcategoriesRouter from './subCategoriesRoute.js'

const router = new Router();
router.use('/:categoryId/subCategories', SubcategoriesRouter)

router.route('/')
    .get(getCategories)
    .post(protectRoutes, allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory)

router.route('/:_id')
    .get(getCategoryValidator, getCategory)
    .put(protectRoutes, allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(protectRoutes, allowedTo('admin', 'manager'), deleteCategoryValidator, deleteCategory)

export default router