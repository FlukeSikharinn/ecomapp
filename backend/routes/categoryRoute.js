import express from "express"
import { addCategory, getCategory } from "../controllers/categoryController.js"
import authUser from "../middleware/Auth.js";

const categoryRoute = express.Router();

categoryRoute.post('/add',authUser,addCategory)
categoryRoute.post('/get',getCategory)

export default categoryRoute

