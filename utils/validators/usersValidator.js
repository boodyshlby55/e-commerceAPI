import slugify from "slugify";
import bcrypt from 'bcryptjs'
import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import users from "../../models/usersSchema.js";

export const createUserValidator = [
    check('name')
        .notEmpty().withMessage("user name is required")
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('invalid email address')
        .custom((val) =>
            users.findOne({ email: val })
                .then((user) => { if (user) { return Promise.reject(new Error('This Email already exists')) }; })
        ),
    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 6, max: 14 }).withMessage('Password should be between 6 and 14')
        .custom((pass, { req }) => {
            if (pass != req.body.confirmPassword) { throw new Error('Passwords do not match'); }
            return true;
        }),
    check('confirmPassword')
        .notEmpty().withMessage('confirm password is required')
        .isLength({ min: 6, max: 14 }).withMessage('confirm Password should be between 6 and 14'),
    check('phone')
        .optional().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    validatorMiddleware,
];

export const getUserValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];

export const updateUserValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    check('name')
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage("name length must be between 2 and 50")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .optional()
        .isEmail().withMessage('invalid email address')
        .custom((val) =>
            users.findOne({ email: val })
                .then((user) => { if (user) { return Promise.reject(new Error('This Email already exists')) }; })
        ),
    check('phone')
        .optional().isMobilePhone('ar-EG').withMessage('Invalid phone number'),
    validatorMiddleware,
];

export const changeUserPasswordValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    check('currentPassword')
        .notEmpty().withMessage('current password is required')
        .isLength({ min: 6, max: 14 }).withMessage('Current Password should be between 6 and 14'),
    check('confirmPassword')
        .notEmpty().withMessage('confirm password is required')
        .isLength({ min: 6, max: 14 }).withMessage('confirm Password should be between 6 and 14'),
    check('password')
        .notEmpty().withMessage('password is required')
        .isLength({ min: 6, max: 14 }).withMessage('Password should be between 6 and 14')
        .custom(async (pass, { req }) => {
            const user = await users.findById(req.params._id);
            if (!user) { throw new Error("User Not Found"); }
            const isCurrentPassword = bcrypt.compareSync(req.body.currentPassword, user.password);
            if (!isCurrentPassword) { throw new Error('Wrong Current Password'); }
            if (pass != req.body.confirmPassword) { throw new Error('Passwords do not match'); }
            return true;
        }),
    validatorMiddleware,
];

export const deleteUserValidator = [
    check('_id').isMongoId().withMessage("Invalid Id"),
    validatorMiddleware,
];