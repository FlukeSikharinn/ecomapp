import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"
import reviewModel from "../models/reviewModel.js";

const placeOrder = async (req,res) => {

    try {

        const { userId, items, address} = req.body

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        const dateStart = new Date(now.setHours(0, 0, 0, 0));
        const dateEnd = new Date(now.setHours(23, 59, 59, 999));

        const orderCount = await orderModel.countDocuments({
            date: { $gte: dateStart, $lte: dateEnd }
        });

        const orderNumber = String(orderCount + 1).padStart(6, '0');
        const orderCode = `OD${year}${month}${day}${orderNumber}`;

        const orderData = {
            orderCode,
            userId,
            items:items.items,
            amount:items.totalAmount,
            address,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save()

        const userData = await userModel.findById(userId)
        let newCartData = await userData.cartData

        items.items.forEach(item => {
            if (newCartData[item.id]) {
                delete newCartData[item.id];
            }
        });

        await userModel.findByIdAndUpdate(userId,{cartData:newCartData})

        res.json({success:true , message:"Order Placed"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }

}

const placeOrderStripe = async (req,res) => {
    
}

const placeOrderRazopay = async (req,res) => {
    
}

const allOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        console.log(orders); // Log the orders to check the results
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const userOrders = async (req,res) => {
    try {

        const { userId,shop } = req.body

        let orders;
        if (shop === 'shop') {
            orders = await orderModel.find({
                items: { $elemMatch: { userId: userId } }
            });
        } else {
            orders = await orderModel.find({ userId: userId });
        }
       
        let productsId = [];

        const mainIds = []; // option === 0
        const optionIds = []; // option === 1
        const option2Ids = []; // option === 2
        let usersId = [];

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.option === 0) {
                    mainIds.push(item.id);
                } else if (item.option === 1) {
                    optionIds.push(item.id);
                } else if (item.option === 2) {
                    option2Ids.push(item.id);
                }
            });
            if(!usersId.includes(order.userId)){
                usersId.push(order.userId)
            }
        });

        const products = await productModel.find({
            $or: [
                { _id: { $in: mainIds } },
                { 'options._id': { $in: optionIds } },
                { 'options.option2._id': { $in: option2Ids } },
            ],
        });

        let shopsId = [];

        products.forEach(product => {
            if(!shopsId.includes(product.userId)){
                shopsId.push(product.userId)
            }
        });

        const shops = await userModel.find({ _id: { $in: shopsId } });
        const users = await userModel.find({ _id: { $in: usersId } });

        const reviews = await reviewModel.find({ userId: userId });

        res.json({success:true , datas:{orders:orders,shops:shops,products:products,users:users,reviews:reviews}})

    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}

const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });

        if (status === 'Order Confirmed') {
            const order = await orderModel.findById(orderId);

            for (const item of order.items) {
                let product;
                if (item.option === 0) {
                    product = await productModel.findById(item.id);
                    product.sellNumber += item.qty;
                    product.amount -= item.qty;
                } else if (item.option === 1) {
                    product = await productModel.findOne({ 'options._id': item.id });
                    const option = product.options.find(opt => opt._id.toString() === item.id);
                    if (option) {
                        product.sellNumber += item.qty;
                        option.amount -= item.qty;
                    }
                } else if (item.option === 2) {
                    product = await productModel.findOne({ 'options.option2._id': item.id });
                    for (const opt of product.options) {
                        const option2 = opt.option2.find(opt2 => opt2._id.toString() === item.id);
                        if (option2) {
                            product.sellNumber += item.qty;
                            option2.amount -= item.qty;
                            break;
                        }
                    }
                }
                if (product) {
                    await product.save();
                }
            }
        }

        if(status === 'Order Canceled'){
            const order = await orderModel.findById(orderId);
            if(order.status != 'Order Placed'){
                for (const item of order.items) {
                    let product;
                    if (item.option === 0) {
                        product = await productModel.findById(item.id);
                        product.sellNumber -= item.qty;
                        product.amount += item.qty;
                    } else if (item.option === 1) {
                        product = await productModel.findOne({ 'options._id': item.id });
                        const option = product.options.find(opt => opt._id.toString() === item.id);
                        if (option) {
                            product.sellNumber -= item.qty;
                            option.amount += item.qty;
                        }
                    } else if (item.option === 2) {
                        product = await productModel.findOne({ 'options.option2._id': item.id });
                        for (const opt of product.options) {
                            const option2 = opt.option2.find(opt2 => opt2._id.toString() === item.id);
                            if (option2) {
                                product.sellNumber -= item.qty;
                                option2.amount += item.qty;
                                break;
                            }
                        }
                    }
                    if (product) {
                        await product.save();
                    }
                }
            }
        }

        res.json({ success: true, message: "Status updated" });

    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}

const reviewProduct = async (req,res) => {
    try {
        const { rating,review,productId,orderId, userId, shopId} = req.body
        const reviewData = {
            userId:userId,
            rate:rating,
            review:review,
            productId:productId,
            orderId:orderId,
            shopId:shopId,
            date:Date.now()
        }

        const product = await productModel.findOne({
            $or: [
                { _id: productId },
                { 'options._id': productId },
                { 'options.option2._id': productId },
            ],
        });

        let productIds = [productId]

        product.options.map(async (option)=>{
            productIds.push(option._id);
            option.option2.map(async (option2)=>{
                productIds.push(option2._id);
            })
        })
        
        const reviewsProduct = await reviewModel.find({ productId: { $in: productIds } });
        const productTotalRating = reviewsProduct.reduce((sum, review) => sum + review.rate, 0);
        const newProductRating = (productTotalRating + rating) / (reviewsProduct.length + 1);

        product.rate = newProductRating;
        await product.save();

        const reviewsShop = await reviewModel.find({ shopId: shopId });
        const shopTotalRating = reviewsShop.reduce((sum, review) => sum + review.rate, 0);
        const newShopRating = (shopTotalRating + rating) / (reviewsShop.length + 1);

        const shop = await userModel.findById(product.userId);
        shop.shopRate = newShopRating;
        await shop.save();

        const newReview = new reviewModel(reviewData);
        await newReview.save()

        res.json({success:true , message: "Review Product Successfuly"})

    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
    }
}

export {placeOrder, placeOrderStripe, placeOrderRazopay, allOrders, userOrders, updateStatus, reviewProduct}