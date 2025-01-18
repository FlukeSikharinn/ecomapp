import express from 'express';
import { loginUser, registerUser, adminLogin, profileImageUpdate, getProfile, profileUpdate, addAddress, getUserAddress, setAddress, editAddress, getShopProfile, getShops } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from "../middleware/Auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile', authUser, getProfile)
userRouter.post('/profile-image-update', authUser, profileImageUpdate);
userRouter.post('/profile-update', authUser, profileUpdate);
userRouter.post('/add-address', authUser, addAddress)
userRouter.post('/get-address', authUser, getUserAddress)
userRouter.post('/set-defalut-address', authUser, setAddress)
userRouter.post('/edit-address', authUser, editAddress)
userRouter.post('/shop-profile', getShopProfile)
userRouter.post('/get-shops', getShops)

export default userRouter;