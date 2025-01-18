import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required:true},
    status: { type: Number, required:true, default:1},
})

const CategoryModel = mongoose.models.category || mongoose.model('category',categorySchema)
export default CategoryModel;