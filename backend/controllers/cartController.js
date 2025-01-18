import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js"

const addToCart = async (req,res) => {
    try {

        const { userId, productId, checkOption } = req.body
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData
        const product = await productModel.find({
            $or: [
                { _id: { $in: productId } },
                { 'options._id': { $in: productId } },
                { 'options.option2._id': { $in: productId } },
            ],
        });

        if(cartData[productId]) {
            cartData[productId].qty += 1;
        } else {
            cartData[productId] = {
                qty: 1,
                option: checkOption,
                userId: userId,
                shopId: product[0].userId
            };
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success:true, message: "Added to cart"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const updateCart = async (req,res) => {
    try {

        const { userId, productId, quantity} = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData

        if(quantity == 0){
            delete cartData[productId];
        }else{
            cartData[productId].qty = quantity; 
        }
        
        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success:true, message: "Cart update quantity"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const getUserCart = async (req,res) => {
    try {
        
        const { userId } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData

        res.json({success:true , cartData})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const getCartProductDetail = async (req,res) => {
    try {

        const { userId } = req.body

        const userData = await userModel.findById(userId)
        let cart = await userData.cartData

        const mainIds = []; // option === 0
        const optionIds = []; // option === 1
        const option2Ids = []; // option === 2
        const shopsId = []; // option === 2

        for (const [cartId, cartItem] of Object.entries(cart)) {
            if (cartItem.option === 0) {
                mainIds.push(cartId);
            } else if (cartItem.option === 1) {
                optionIds.push(cartId);
            } else if (cartItem.option === 2) {
                option2Ids.push(cartId);
            }
            if(!shopsId.includes(cartItem.shopId)){
                shopsId.push(cartItem.shopId);
            }
        }

        const products = await productModel.find({
            $or: [
                { _id: { $in: mainIds } },
                { 'options._id': { $in: optionIds } },
                { 'options.option2._id': { $in: option2Ids } },
            ],
        });

        const shops = await userModel.find({ _id: { $in: shopsId } });

        return res.json({success:true , datas:{products:products,shops:shops}})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

const checkStock = async (req,res) => {
    try {
        
        const { totalCart } = req.body

        for (const item of totalCart.items) {
            let product;

            if (item.option === 0) {
                product = await productModel.findById(item.id);
                if (product.amount < item.qty) {
                    return res.json({ success: false, message: `${product.name} has only ${product.amount} piece(s) in stock.` });
                }
            } else if (item.option === 1) {
                product = await productModel.findOne({ 'options._id': item.id });
                const option = product.options.find(opt => opt._id.toString() === item.id);
                if (option && option.amount < item.qty) {
                    return res.json({ success: false, message: `${product.name}  "${option.option}" has only ${option.amount} piece(s) in stock.` });
                }
            } else if (item.option === 2) {
                product = await productModel.findOne({ 'options.option2._id': item.id });
                for (const opt of product.options) {
                    const option2 = opt.option2.find(opt2 => opt2._id.toString() === item.id);
                    if (option2 && option2.amount < item.qty) {
                        return res.json({ success: false, message: `${product.name}  "${option2.option}" has only ${option2.amount} piece(s) in stock.` });
                    }
                }
            }
        }

        res.json({success:true})

    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export { addToCart, updateCart, getUserCart, getCartProductDetail, checkStock }
