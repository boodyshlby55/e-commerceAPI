import slugify from "slugify";
import { check } from "express-validator";
import { validatorMiddleware as validatorMiddleware } from "../../middlewares/validatorMiddleware.js";

export const createCategoryValidator = [
    check('name')
        .notEmpty().withMessage("Category name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

export const getCategoryValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateCategoryValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    check('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

export const deleteCategoryValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];