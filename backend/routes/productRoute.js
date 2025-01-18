import express from 'express'
import {listProducts,addProduct,removeProduct,singleProduct,addNewProduct,shopProducts,productData,homeProducts,getProductsList,searchProducts} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from "../middleware/Auth.js";

const productRouter = express.Router();

// productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
// productRouter.post('/add-new-product', authUser, upload.fields([{ name: 'images', maxCount: 10 }]), addNewProduct);
productRouter.post('/add-new-product', authUser, addNewProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.post('/shop-product',authUser,shopProducts);
productRouter.post('/home-product',homeProducts);
productRouter.get('/list',listProducts);
productRouter.get('/products-list',getProductsList);
productRouter.post('/search-product',searchProducts);

export default productRouter;
