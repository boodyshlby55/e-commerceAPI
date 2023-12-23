import slugify from "slugify";
import { check } from "express-validator";
import { validatorMiddleware as validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import categories from "../../models/categorySchema.js";

export const createSubCategoryValidator = [
    check('name')
        .notEmpty().withMessage("subCategory name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('category')
        .notEmpty().withMessage("Category must be required")
        .isMongoId().withMessage("Invalid Category Id")
        .custom((categoryId) =>
            categories.findById(categoryId).then((category) => {
                if (!category) { return Promise.reject(new Error('No Category for this Id')) }
            })
        ),
    validatorMiddleware,
];

export const getSubCategoryValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateSubCategoryValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    check('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

export const deleteSubCategoryValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];