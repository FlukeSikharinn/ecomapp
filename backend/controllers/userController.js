import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary"
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js"

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

function isBase64(image) {
    return image.startsWith('data:image/');
}

const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false, message:"User doest exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = createToken(user._id)
            res.json({success:true,token})
        }
        else{
            res.json({success:false, message:"invalid"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error})
    }
}

const registerUser = async (req,res) => {
    try {
        const {name, email, password} = req.body;
        const exists = await userModel.findOne({email})
        if (exists){
            return res.json({success:false, message:"User already exists"})
        }

        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Pls enter a valid email"})
        }
        if(password.length < 8){
            return res.json({success:false, message:"Pls enter a srtong password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword,
            date: Date.now(),
        })

        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({success:true, token})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error})
    }
}

const adminLogin = async (req,res) => {
    try {
        
        const { email, password } = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"invalid"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error})
    }
}

const getProfile = async (req,res) => {
    try {

        const userId = req.body.userId;
        const userData = await userModel.findById(userId);
        const reviews = await reviewModel.find({ userId: userData._id })
        const orders = await orderModel.find({ userId: userData._id })
        
        res.json({ success: true, userData:userData,reviews:reviews.length,orders:orders.length,reviewsData:reviews });
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getShopProfile = async (req,res) => {
    try {
        const {shopId} = req.body;
        const userData = await userModel.findById(shopId);
        const reviews = await reviewModel.find({ userId: userData._id })
        const orders = await orderModel.find({ userId: userData._id })
        
        res.json({ success: true, userData:userData,reviews:reviews.length,orders:orders.length,reviewsData:reviews });
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const profileImageUpdate = async (req,res) => {
    try {
        const { image,type } = req.body;
        const userId = req.body.userId;

        const userData = await userModel.findById(userId);

        const result = await cloudinary.uploader.upload(image, { folder: 'shop-profile' });

        if(type == 'profile'){
            userData.profileImage = result.secure_url;
        }else{
            userData.shopImage = result.secure_url;
        }

        await userData.save();
    
        res.json({ success: true, message: 'Profile image updated successfully', imageUrl: result.secure_url });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const profileUpdate = async (req,res) => {
    try {
        const { name, info, userId, type } = req.body;

        const userData = await userModel.findById(userId);

        if(type === 'shop'){
            userData.shopName = name;
            userData.detail = info;
        }else{
            userData.name = name;
        }

        await userData.save();
    
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const addAddress = async (req,res) => {
    try {
        const { address, userId } = req.body;

        const userData = await userModel.findById(userId);

        userData.address.forEach(addr => addr.status = false);

        userData.address.push({ ...address, status: true });

        await userData.save();
    
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getUserAddress = async (req,res) => {
    try {

        const { userId } = req.body;

        const userData = await userModel.findById(userId);

        const userAddress = userData.address;
    
        res.json({ success: true, userAddress });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const setAddress = async (req,res) => {
    try {

        const { addressId, userId } = req.body;

        const userData = await userModel.findById(userId);

        userData.address.forEach(addr => {
            addr.status = addr._id.toString() === addressId ? true : false;
        });

        await userData.save();

        const userAddress = userData.address;
    
        res.json({ success: true, userAddress });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const editAddress = async (req,res) => {
    try {
        const { address, addressId, userId } = req.body;

        const userData = await userModel.findById(userId);

        const addressIndex = userData.address.findIndex(addr => addr._id.toString() === addressId);
        userData.address[addressIndex] = address;

        await userData.save();

        const userAddress = userData.address;

        res.json({ success: true, userAddress });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getShops = async (req,res) => {
    try {
        const shops = await userModel.find({ isShop: 1 })
            .sort({ shopRate: -1 })
            .limit(10); 
       
        res.json({ success: true, shops });
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export { loginUser, registerUser, adminLogin, profileImageUpdate, getProfile, profileUpdate, addAddress, getUserAddress, setAddress, editAddress, getShopProfile, getShops }