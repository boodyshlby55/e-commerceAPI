import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, resizeImage, updateUser, changeUserPassword, uploadUserImage, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUser } from "../controllers/users.js";
import { createUserValidator, deleteUserValidator, getUserValidator, changeUserPasswordValidator, updateUserValidator } from "../utils/validators/usersValidator.js";
import { allowedTo, protectRoutes } from "../controllers/auth.js";

const router = new Router();

router.use(protectRoutes)

router.get('/getMe', getLoggedUserData, getUserValidator, getUser)
router.put('/changeMyPassword', getLoggedUserData, changeUserPasswordValidator, updateLoggedUserPassword)
router.put('/updateMe', getLoggedUserData, uploadUserImage, resizeImage, updateUserValidator, updateLoggedUserData)
router.delete('/deleteMe', deleteLoggedUser)

router.use(allowedTo('admin'))

router.route('/')
    .get(getUsers)
    .post(uploadUserImage, resizeImage, createUserValidator, createUser)

router.route('/:_id')
    .get(getUserValidator, getUser)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser)

router.route('/updatePassword/:_id')
    .put(changeUserPasswordValidator, changeUserPassword)

export default router