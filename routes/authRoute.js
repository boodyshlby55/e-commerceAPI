import { Router } from "express";
import { forgetPassword, login, resetPassword, signUp, verifyResetPasswordCode } from "../controllers/auth.js";
import { loginValidator, signUpValidator } from "../utils/validators/authValidator.js";

const router = new Router();

router.route('/signup').post(signUpValidator, signUp)
router.route('/login').post(loginValidator, login)
router.route('/forgetPassword').post(forgetPassword)
router.route('/verifyResetPasswordCode').post(verifyResetPasswordCode)
router.route('/resetPassword').put(resetPassword)

export default router