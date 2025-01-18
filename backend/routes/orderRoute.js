import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderRazopay, allOrders, userOrders, updateStatus, reviewProduct} from "../controllers/orderController.js"
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/Auth.js'

const orderRouter = express.Router()

//admin
orderRouter.post('/list',adminAuth,allOrders);
orderRouter.post('/status',authUser,updateStatus)

//payment
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razopay',authUser,placeOrderRazopay)

// user
orderRouter.post('/userorders',authUser,userOrders)

orderRouter.post('/review-product',authUser,reviewProduct)

export default orderRouter
