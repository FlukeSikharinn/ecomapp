import express from "express"
import { addToCart, getUserCart, updateCart, getCartProductDetail, checkStock } from "../controllers/cartController.js"
import authUser from "../middleware/Auth.js";

const cartRouter = express.Router();

cartRouter.post('/get',authUser,getUserCart)
cartRouter.post('/add',authUser,addToCart)
cartRouter.post('/update',authUser,updateCart)

cartRouter.post('/get-product-detail',authUser,getCartProductDetail)
cartRouter.post('/check-stock',authUser,checkStock)

export default cartRouter

