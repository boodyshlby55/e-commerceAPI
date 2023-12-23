import slugify from "slugify";
import { check } from "express-validator";
import { validatorMiddleware as validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import categories from "../../models/categorySchema.js";
import subCategories from "../../models/subCategoriesSchema.js";

export const createProductValidator = [
    check('title')
        .notEmpty().withMessage("Product title is required")
        .isLength({ min: 2, max: 100 }).withMessage("title length must be between 2 and 100")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('description')
        .notEmpty().withMessage("Product description is required")
        .isLength({ min: 2, max: 200 }).withMessage("description length must be between 2 and 200"),
    check('quantity')
        .notEmpty().withMessage("Product quantity is required")
        .isNumeric().withMessage("Quantity must be a number")
        .toInt(),
    check('price')
        .notEmpty().withMessage("Product price is required")
        .isNumeric().withMessage("price must be a number"),
    check('colors')
        .optional()
        .isArray().withMessage("colors must be an array"),
    check('category')
        .notEmpty().withMessage("Category is required")
        .isMongoId().withMessage("Invalid Id")
        .custom((categoryId) => categories.findById(categoryId).then((category) => { if (!category) { return Promise.reject(new Error('No category for this Id')) } })),
    check('subcategory')
        .notEmpty().withMessage("subcategory is required")
        .isMongoId().withMessage("Invalid Id")
        .custom((subCategoryId) => subCategories.findById(subCategoryId).then((subCategory) => { if (!subCategory) { return Promise.reject(new Error('No subcategory for this Id')) } }))
        .custom((val, { req }) => subCategories.find({ category: req.body.category })
            .then((subCategories) => {
                const subCategoriesIds = []
                subCategories.forEach(subCategory => { subCategoriesIds.push(subCategory._id.toString()) });
                if (!subCategoriesIds.includes(req.body.subcategory)) { return Promise.reject(new Error('subCategory not belong to this category')) };
            })),
    validatorMiddleware,
];

export const getProductValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateProductValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    check('title').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

export const deleteProductValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];