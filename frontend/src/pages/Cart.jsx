import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShop,faCartShopping } from '@fortawesome/free-solid-svg-icons';
import Checkbox from '@mui/material/Checkbox';

const Cart = () => {

    const {products, currency, cartItems, updateQuantity, navigate, token, backendUrl} = useContext(ShopContext);

    const [cartData,setCartData] = useState(null);
    const [productDetail,setProductDetail] = useState([]);
    const [totalCartAmount,setTotalCartAmount] = useState(0);
    const [shopsData,setShopsData] = useState([]);

    const getProductDataFromCart = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get-product-detail', {}, { headers: { token } });
    
            if (response.data.success) {
                // console.log(cartItems)
                const cartDataArray = Object.entries(cartItems).map(([key, item]) => ({
                    id: key,
                    ...item,
                }));
    
                const groupedData = cartDataArray.reduce((acc, item) => {
                    if (!acc[item.shopId]) {
                        acc[item.shopId] = [];
                    }
                    acc[item.shopId].push(item);
                    return acc;
                }, {});

                setCartData(groupedData);
                setProductDetail(response.data.datas.products);
                setShopsData(response.data.datas.shops);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };
    

    const [totalCart, setTotalCart] = useState({
        items: [],
        totalAmount: 0,
    });

    const quantityChange = (itemId, newQty, price) => {
        updateQuantity(itemId, newQty);
        setTotalCart((prev) => {
            const updatedItems = prev.items.map((item) =>
                item.id === itemId ? { ...item, qty: newQty, totalPrice: newQty * price } : item
            );
            const totalAmount = updatedItems.reduce((acc, item) => acc + item.totalPrice, 0);
    
            return { items: updatedItems, totalAmount };
        });
    };

    const selectProductToCart = async (item, price, shopId) => {
        setTotalCart((prev) => {
            const existingItem = prev.items.find((i) => i.id === item.id);
            let updatedItems;
    
            if (existingItem) {
                updatedItems = prev.items.filter((i) => i.id !== item.id);
            } else {
                updatedItems = [
                    ...prev.items,
                    {
                        id: item.id,
                        qty: item.qty,
                        price,
                        totalPrice: item.qty * price,
                        option: item.option,
                        userId: shopId
                    },
                ];
            }
            const totalAmount = updatedItems.reduce((acc, currentItem) => acc + currentItem.totalPrice, 0);
    
            return { items: updatedItems, totalAmount };
        });
    };

    const checkStock = async (totalCart,productDetail) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/check-stock', { totalCart }, { headers: { token: token } });
            if (response.data.success) {
                navigate('/place-order', { state: { cartData: totalCart, cartProducts: productDetail } });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
    }, [totalCart])
    
    useEffect(() => {
        if(token){
            getProductDataFromCart();
        }
    }, [cartItems])

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                < Title text1={'YOUR'} text2={'CARTS'} />
            </div>
            {
                Object.entries(shopsData).map(([i,shop]) => (
                    <div>
                        {
                            cartData[shop._id] ?
                                <div key={i} className="flex-1 border border-gray-400 rounded-lg lg:p-8 py-7 bg-white mx-2 mb-5">
                                    <div className="flex mx-3 items-center gap-2 text-2xl font-medium text-gray-900">
                                        <div className="w-[60px] mr-2">
                                            <div className="relative pb-[100%] w-full">
                                                <img src={shop.profileImage} className="rounded-full absolute top-0 left-0 w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <p>{shop.name}</p>
                                        <FontAwesomeIcon icon={faShop} className='text-[30px] text-blue-500 ml-2 hidden lg:block' />
                                    </div>
                                    <hr className="mt-4" />
                                    <div>
                                    {
                                        cartData[shop._id]?.map((item, index) => {
                                            let productData;
                                            let price = 0;
                                            let optionLabel = "";

                                            if (item.option === 0) {
                                                productData = productDetail.find((product) => product._id === item.id);
                                                price = productData.price
                                            } else if (item.option === 1) {
                                                productData = productDetail.find((product) =>
                                                    product.options.some((option) => option._id === item.id)
                                                );
                                                if (productData) {
                                                    const option = productData.options.find((opt) => opt._id === item.id);
                                                    price = option.price;
                                                    optionLabel = (
                                                        <p className="px-2 sm:px-3 ms:py-1 border bg-slate-50">
                                                            {option.option}
                                                        </p>
                                                    );
                                                }
                                            } else if (item.option === 2) {
                                                productData = productDetail.find((product) =>
                                                    product.options.some((option) =>
                                                        option.option2.some((subOption) => subOption._id === item.id)
                                                    )
                                                );
                                                if (productData) {
                                                    const option = productData.options.find((opt) =>
                                                        opt.option2.some((subOption) => subOption._id === item.id)
                                                    );
                                                    const subOption = option.option2.find((subOpt) => subOpt._id === item.id);
                                                    price = subOption.price;
                                                    optionLabel = (
                                                        <>
                                                            <p className="px-2 sm:px-3 ms:py-1 border bg-slate-50">
                                                                {option.option}
                                                            </p>
                                                            <p className="px-2 sm:px-3 ms:py-1 border bg-slate-50">
                                                                {subOption.option}
                                                            </p>
                                                        </>
                                                    );
                                                }
                                            }

                                            return (
                                                <div key={item.id} className="py-4 border-t border-b text-gray-700 grid grid-cols-[0.5fr_4fr_0.5fr_0.5fr] sm:grid-cols-[0.5fr_4fr_2fr_0.5fr] items-center gap-4">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={totalCart.items.some((i) => i.id === item.id)}
                                                            onChange={() => selectProductToCart(item, price, productData.userId)}
                                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                                        />
                                                    </div>
                                                    <div className="flex items-start gap-4 overflow-hidden">
                                                        <div className="w-16 sm:w-20 flex-shrink-0">
                                                            <div className="relative pb-[100%] w-full">
                                                                <img src={productData?.images[0]} className="absolute top-0 left-0 w-full h-full object-cover" alt="Product" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs sm:text-lg font-medium truncate max-w-[150px] sm:max-w-[200px]">{productData?.name}</p>
                                                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 mt-2">
                                                                <p>{currency} {price}</p>
                                                                <div className="flex gap-1">
                                                                    {optionLabel}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <input
                                                        onChange={(e) => {
                                                            const value = Number(e.target.value);
                                                            if (value > 0) {
                                                                quantityChange(item.id, value, price);
                                                            }
                                                        }}
                                                        className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                                                        type="number"
                                                        min={1}
                                                        defaultValue={item.qty}
                                                    />
                                                    <img
                                                        onClick={() => updateQuantity(item.id, 0)}
                                                        src={assets.bin_icon}
                                                        className="w-4 mr-4 sm:w-5 cursor-pointer"
                                                        alt="Delete"
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                    </div>
                                </div>
                            : null
                        }
                    </div>
                ))
            }
            <div className="flex-1 border border-gray-400 rounded-lg py-7 mx-2 fixed-bottom bg-gray-200">
                <div className="flex items-center gap-2 lg:text-2xl font-medium text-gray-900 mr-5">
                    <div className='ml-auto flex items-center'>
                        <p className='ml-2'>Total Amount : </p>
                        <p className='ml-2 mr-5'>฿ {totalCart.totalAmount}</p>
                        <button onClick={()=>checkStock(totalCart,productDetail)} className="rounded-lg bg-black text-white text-sm px-8 py-3">
                            <FontAwesomeIcon icon={faCartShopping} className='text-[1rem] mr-3'/> 
                            CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
