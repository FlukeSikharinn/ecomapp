import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    id: String,
    qty: Number,
    price: Number,
    totalPrice: Number,
    option: Number,
    userId: String,
});

const orderSchema = new mongoose.Schema({
    orderCode: { type: String, required:true},
    userId: { type: String, required:true},
    items:  [itemsSchema],
    amount: { type: Number, required:true},
    address: { type: Object, required:true},
    status: { type: String, required:true, default:"Order Placed"},
    paymentMethod: { type: String, required:true},
    payment: { type: Boolean, required:true , default:false},
    date: { type: Number, required:true},
})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;