import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: String,
    phone: String,
    detail: String,
    province: String,
    city: String,
    district: String,
    zipcode: String,
    status:Boolean
});

const userSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    cartData: {type:Object, default:{}},
    isShop: {type:Number, default:0},
    profileImage: {type:String, default: "" },
    shopName: {type:String, default: "" },
    shopImage: {type:String, default: "" },
    detail: {type:String, default: "" },
    address: [addressSchema],
    date: { type: Number, required:true},
    shopRate: { type: Number, default:0},
},{minimize: false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel