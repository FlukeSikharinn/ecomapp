import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required:true},
    rate: { type: Number, required:true},
    review: { type: String, required:true, default:""},
    productId: { type: String, required:true},
    orderId: { type: String, required:true},
    date: { type: Number, required:true},
    shopId: { type: String, required:true},
})

const reviewModel = mongoose.models.review || mongoose.model('review',reviewSchema)
export default reviewModel;