import mongoose from "mongoose";

const option2Schema = new mongoose.Schema({
    option: String,
    price: Number,
    amount: Number,
    active: Boolean,
});

const optionSchema = new mongoose.Schema({
    option: String,
    image: String,
    price: Number,
    amount: Number,
    active: Boolean,
    option2: [option2Schema],
});

const tagSchema = new mongoose.Schema({
    name: String,
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    description: { type: String, required: true, index: true },
    price: { type: Number },
    category: { type: String, required: true, index: true },
    images: [String],
    options: [optionSchema],
    date: { type: Number, required: true },
    userId: { type: String, required: true },
    tags: [tagSchema],
    deletedAt: { type: Number },
    sellNumber: { type: Number, default:0},
    amount: Number,
    rate: { type: Number, default:0},
});

productSchema.index({ name: 'text', description: 'text', category: 'text', 'tags.name': 'text' });

const productModel = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel