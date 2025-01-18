import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import categoryRoute from './routes/categoryRoute.js';

// App Conofig
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json({ limit: '50mb' }));
app.use(cors())

// api
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/category',categoryRoute)

app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.listen(port, ()=> console.log("server started on PORT : "+ port))
