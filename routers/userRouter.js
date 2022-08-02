import express from "express";
import { signup, login, protect, logout } from "../controllers/authController.js";
import { getAllUsers, UpdatePassword, getUser, updateUser, deleteUser, filterBody, forgotPassword, resetPassword, uploadProficPic, resizePic } from "../controllers/userController.js";
import {joiCreateValidator, joiUpdateValidator} from "../utils/joiValidator.js";

const userRouter= express.Router()

userRouter.post('/signup', joiCreateValidator, signup)
userRouter.post('/login',login)
userRouter.get('/logout', protect, logout)

userRouter.patch('/updatePassword', protect, UpdatePassword)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.post('/:userID/resetPassword/:token', resetPassword)

userRouter.get('/', protect, getAllUsers)
userRouter.route('/:id')
.get(protect, getUser)
.patch(protect, joiUpdateValidator, uploadProficPic, resizePic, filterBody, updateUser)
.delete(protect, deleteUser)

export default userRouter