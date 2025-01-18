import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import CategoryModel from "../models/CategoryModel.js"
import orderModel from "../models/orderModel.js"
import Fuse from 'fuse.js';
import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

function isBase64(image) {
    return image.startsWith('data:image/');
}
  
const addProduct = async (req,res) => {
    try {
        
        const { name,description, price, category, subCategory, sizes, bestseller} = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1,image2,image3,image4].filter((item)=>item !== undefined)

        let imageUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'})
                return result.secure_url
            })
        )
        
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();

        res.json({success:true , message: "product added"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const listProducts = async (req,res) => {
    try {
        const products = await productModel.find({
            $or: [
                { deletedAt: { $exists: false } },
                { deletedAt: null },
                { deletedAt: { $eq: '' } }
            ]
        });
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true , message:"product removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const singleProduct = async (req,res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)

        let productIds = [product._id];
        if (product.options) {
            for (const option of product.options) {
                productIds.push(option._id);
                if (option.option2) {
                    productIds.push(...option.option2.map(opt2 => opt2._id));
                }
            }
        }

        const [reviews, orders] = await Promise.all([
            reviewModel.find({ productId: { $in: productIds } }),
            orderModel.find({ 'items.id': { $in: productIds } }),
        ]);

        const userIds = [...new Set(reviews.map(review => review.userId))];
        const [userReviews, shop] = await Promise.all([
            userModel.find({ _id: { $in: userIds } }),
            userModel.findById(product.userId),
        ]);
        
        res.json({success:true,product:product,reviews:reviews,userReviews:userReviews,shop:shop,orders:orders,productIds:productIds})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const addNewProduct = async (req,res) => {
    try {
        const { name, description, category, images, options, price, productId, userId } = req.body;

        if (productId) {
            await productModel.findByIdAndUpdate(productId, { deletedAt: Date.now() });
        }

        const uploadedImages = await Promise.all(
            images.map(async (base64Image) => {
                if (isBase64(base64Image)) {
                    return base64Image;
                } else {
                    const result = await cloudinary.uploader.upload(base64Image);
                    return result.secure_url;
                }
            })
        );

        const optionsWithImages = await Promise.all(
            options.map(async (option) => {
                if (option.image) {
                    if (isBase64(option.image)) {
                    option.image = option.image;
                    } else {
                    const result = await cloudinary.uploader.upload(option.image);
                    option.image = result.secure_url;
                    }
                }
                return option;
            })
        );
  
        const newProduct = await productModel.create({
            name,
            description,
            category,
            price,
            images: uploadedImages,
            options: optionsWithImages,
            date: Date.now(),
            userId,
        });

        const find_category = await CategoryModel.findOne({ name: category });
        if (!find_category) {
            const newCategory = new CategoryModel({
            name: category,
            status: 1,
            });
            await newCategory.save();
        }
  
        res.json({ success: true, message: "Product added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const shopProducts = async (req,res) => {
    try {
        const { userId } = req.body;

        const products = await productModel.find({
            userId,
            $or: [
                { deletedAt: { $exists: false } },
                { deletedAt: null },
                { deletedAt: { $eq: '' } }
            ]
        });
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const productData = async (req,res) => {
    try {
        const { productId } = req.body;
        const products = await productModel.find({productId});
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const homeProducts = async (req,res) => {
    try {

        const latestProducts = await productModel.find({
            $or: [
                { deletedAt: { $exists: false } },
                { deletedAt: null },
                { deletedAt: { $eq: '' } }
            ]
        }).sort({ createdAt: -1 }).limit(10);

        const bestsellerData = await orderModel.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const bestsellerIds = bestsellerData.map(item => item._id);

        const bestsellerProducts = await productModel.find({
            $and: [
                {
                    $or: [
                    { _id: { $in: bestsellerIds } },
                    { "options._id": { $in: bestsellerIds } },
                    { "options.option2._id": { $in: bestsellerIds } }
                    ]
                },
                {
                    $or: [
                    { deletedAt: { $exists: false } },
                    { deletedAt: null },
                    { deletedAt: { $eq: '' } }
                    ]
                }
            ]
        });

        const productMap = new Map();
        [...latestProducts, ...bestsellerProducts].forEach(product => {
            productMap.set(product._id.toString(), product);
        });
        const allProducts = Array.from(productMap.values());

        const categoryNames = [...new Set(allProducts.map(product => product.category))];
        const categories = await CategoryModel.find({ name: { $in: categoryNames } });

        res.json({success:true, datas:{
            latestProducts:latestProducts,
            bestsellerProducts:bestsellerProducts,
            categories:categories,
            allProducts:allProducts
        }})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getProductsList = async (req,res) => {
    try {
        const products = await productModel.find({
            $or: [
                { deletedAt: { $exists: false } },
                { deletedAt: null },
                { deletedAt: { $eq: '' } }
            ]
        });
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const searchProducts = async (req, res) => {
    try {
        const { query, shop } = req.body;

        const deletedFilter = {
            $or: [
                { deletedAt: { $exists: false } },
                { deletedAt: null },
                { deletedAt: { $eq: '' } }
            ]
        };

        const shopFilter = shop && shop !== 0 ? { userId: shop } : {};

        const combinedFilter = { 
            $and: [deletedFilter, shopFilter] 
        };

        const allProducts = await productModel.find(combinedFilter);

        let latestProducts = [];
        let bestsellerProducts = [];

        if (query) {
            const options = {
                keys: ['name', 'category', 'tags.name'],
                includeScore: true,
                threshold: 0.3
            };

            const fuse = new Fuse(allProducts, options);
            const fuseResults = fuse.search(query);

            latestProducts = fuseResults.map(result => result.item);
        } else {
            latestProducts = await productModel.find(combinedFilter)
                .sort({ createdAt: -1 })
                .limit(10);
        }

        const bestsellerData = await orderModel.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        const bestsellerIds = bestsellerData.map(item => item._id);

        bestsellerProducts = await productModel.find({
            $and: [
                {
                    $or: [
                        { _id: { $in: bestsellerIds } },
                        { "options._id": { $in: bestsellerIds } },
                        { "options.option2._id": { $in: bestsellerIds } }
                    ]
                },
                deletedFilter,
                shopFilter
            ]
        });

        const productMap = new Map();
        [...latestProducts, ...bestsellerProducts].forEach(product => {
            productMap.set(product._id.toString(), product);
        });
        const finalProducts = Array.from(productMap.values());

        const categoryNames = [...new Set(finalProducts.map(product => product.category))];
        const categories = await CategoryModel.find({ name: { $in: categoryNames } });

        res.json({
            success: true,
            datas: {
                latestProducts,
                bestsellerProducts,
                categories,
                allProducts: finalProducts
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};




export {listProducts,addProduct,removeProduct,singleProduct,addNewProduct,shopProducts,productData,homeProducts,getProductsList,searchProducts}