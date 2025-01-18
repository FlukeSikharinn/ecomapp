import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePhone,faReceipt,faInfoCircle,faShop,faHouseChimneyUser,faLocationDot,faUser,faRankingStar,faStarHalfStroke, faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const Order = ({user}) => {

    const { backendUrl, currency, token} = useContext(ShopContext);

    const [orderData,setOrderData] = useState([]);
    const [productDetail,setProductDetail] = useState([]);
    const [shopsData,setShopsData] = useState([]);
    const [usersData,setUsersData] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const loadOrderData = async () => {
        try {
            if(!token){
                return null;
            }
            const response = await axios.post(backendUrl + '/api/order/userorders',{user},{headers:{token}})
            if(response.data.success){
                setOrderData(response.data.datas.orders.reverse())
                setProductDetail(response.data.datas.products)
                setShopsData(response.data.datas.shops)
                setUsersData(response.data.datas.users)
                setUserReviews(response.data.datas.reviews)
            }
        } catch (error) {
            
        }
    }

    const updateOrderStatus = async (orderId,status) => {
        try {
            if(!token){
                return null;
            }
            setOpenBackdrop(true);
            const response = await axios.post(backendUrl + '/api/order/status',{orderId,status},{headers:{token}})
            // console.log(response)
            if(response.data.success){
                toast.success(response.data.message)
                loadOrderData();
                setOpenBackdrop(false);
            }
        } catch (error) {
            
        }
    }
    
    const ratingItem = (orderId, itemId, newRating) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [orderId]: {
                ...prevRatings[orderId],
                [itemId]: newRating,
            },
        }));
    };
    
    const reviewItem = (orderId, itemId, review) => {
        setReviews((prevReviews) => ({
            ...prevReviews,
            [orderId]: {
                ...prevReviews[orderId],
                [itemId]: review,
            },
        }));
    };

    const reviewProduct = async (orderId,productId,shopId) => {

        if (!ratings[orderId] || typeof ratings[orderId][productId] === 'undefined') {
            toast.error("Please select a rating");
            return;
        }
        if (!reviews[orderId] || typeof reviews[orderId][productId] === 'undefined') {
            toast.error("Please enter a review");
            return;
        }

        let rating = ratings[orderId][productId]
        let review = reviews[orderId][productId]

        try {
            setOpenBackdrop(true);

            const response = await axios.post(backendUrl + '/api/order/review-product',{rating,review,productId,orderId,shopId},{headers:{token}})
            // console.log(response)
            if(response.data.success){
                toast.success(response.data.message)
                loadOrderData();
                setOpenBackdrop(false);
            }
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        loadOrderData();
    },[token])

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                < Title text1={'MY'} text2={'ORDERS'} />
            </div>

            <div>
                {
                    orderData.map((order,index) => {
                        const groupedByShop = order.items.reduce((acc, item) => {
                            const userId = item.userId;
                            if (!acc[userId]) {
                                acc[userId] = [];
                            }
                            acc[userId].push(item);
                            return acc;
                        }, {});
                        return Object.entries(groupedByShop).map(([userId, items]) => {
                            let userAddress = order.address
                            if(user == 'shop'){
                                let userData = usersData.find((user) => user._id === userId)
                                return (
                                    <div key={userId} className="flex-1 border border-gray-400 rounded-lg lg:p-8 py-3 bg-white mb-5 lg:mx-5">
                                        <div className="flex mx-3 items-center gap-2 lg:text-2xl font-medium text-gray-900">
                                            Order : 
                                            <p>{order.orderCode}</p>
                                            <FontAwesomeIcon icon={faReceipt} className='text-[30px] text-blue-500 ml-2 hidden lg:block' />
                                            <span className="ml-auto">
                                                <button className={`text-white rounded-full text-[1rem] px-2 py-0.5
                                                                    ${order.status == "Order Placed" ? 'bg-gray-400' : ''}
                                                                    ${order.status == "Order Confirmed" ? 'bg-blue-500' : ''}
                                                                    ${order.status == "Order Sending" ? 'bg-yellow-500' : ''}
                                                                    ${order.status == "Order Canceled" ? 'bg-red-500' : ''}
                                                                    ${order.status == "Order Delivered" ? 'bg-green-500' : ''}
                                                                    `}>
                                                    {order.status}
                                                </button>
                                            </span>
                                        </div>
                                        <hr className="mt-4" />
                                        
                                        <div>
                                            {items.map((item, itemIndex) => {
                                                let productData;
                                                let price = 0;
                                                let optionLabel = "";
        
                                                if (item.option === 0) {
                                                    productData = productDetail.find((product) => product._id === item.id);
                                                    price = productData ? productData.price : 0;
                                                } else if (item.option === 1) {
                                                    productData = productDetail.find((product) =>
                                                        product.options.some((option) => option._id === item.id)
                                                    );
                                                    if (productData) {
                                                        const option = productData.options.find((opt) => opt._id === item.id);
                                                        price = option ? option.price : 0;
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
                                                        const subOption = option ? option.option2.find((subOpt) => subOpt._id === item.id) : null;
                                                        price = subOption ? subOption.price : 0;
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
                                                    <div key={itemIndex} className="mx-3 py-4 border-t border-b text-gray-700 grid grid-cols-[1fr_0.5fr_0.5fr] sm:grid-cols-[1fr_0.5fr_0.5fr] items-center gap-4">
                                                        <div className="flex items-start gap-6">
                                                            <div className="w-16 sm:w-20">
                                                                <div className="relative pb-[100%] w-full">
                                                                    <img src={productData?.images[0]} className="absolute top-0 left-0 w-full h-full object-cover" alt="Product" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs sm:text-lg font-medium">{productData?.name}</p>
                                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 mt-2">
                                                                    <p>{currency} {price}</p>
                                                                    <div className="flex gap-1">
                                                                        {optionLabel}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p>Qty : {item.qty}</p>
                                                        <p>Price : {currency} {item.qty*price}</p>
                                                    </div>
                                                    
                                                );
                                            })}
                                        </div>
                                        <div className={`address-detail flex-1 border border-gray-400 rounded-lg p-5 mx-5 mb-3 bg-white`}>
                                            <div>
                                                <div className="flex mx-3 items-center gap-2 font-medium text-gray-900">
                                                    <div className="w-[30px] mr-2">
                                                        <div className="relative pb-[100%] w-full">
                                                            <img src={userData.profileImage} className="rounded-full absolute top-0 left-0 w-full h-full object-cover" />
                                                        </div>
                                                    </div>
                                                    <p>{userData.name}</p>
                                                    <FontAwesomeIcon icon={faUser} className='text-blue-500 ml-2 hidden lg:block' />
                                                </div>
                                                <hr className="mt-2 mb-2" />
                                                <p className="flex items-center gap-2 font-medium text-gray-900">
                                                    <FontAwesomeIcon icon={faLocationDot} className="text-blue-400 ml-2" />
                                                    {userAddress.name}
                                                </p>
                                                <div className="ml-5 mt-2">
                                                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">{userAddress.detail}</p>
                                                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">
                                                        {userAddress.district}, {userAddress.city}, {userAddress.province}, {userAddress.zipcode}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">
                                                        <FontAwesomeIcon icon={faSquarePhone} className="text-[1rem] mr-1" />
                                                        {userAddress.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-2 p-5 text-sm'>
                                            <div className='flex justify-between mx-5'>
                                                <p>Date</p>
                                                <p>{new Date(order.date).toDateString()}</p>
                                            </div>
                                            <hr />
                                            <div className='flex justify-between mx-5'>
                                                <p>Amount</p>
                                                <p>{currency} {order.amount}.00</p>
                                            </div>
                                            <hr />
                                            <div className='flex justify-between mx-5'>
                                                <p>Shipping Fee</p>
                                                <p>{currency} 10.00</p>
                                            </div>
                                            <hr />
                                            <div className='flex justify-between mx-5'>
                                                <b>Total Amount</b>
                                                <b>{currency} {order.amount+10}.00</b>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 lg:text-xl font-medium text-gray-900 mr-5">
                                            <div className='ml-auto flex items-center'>
                                                {
                                                    order.status === "Order Placed"
                                                    ?
                                                    (
                                                        <button onClick={()=>updateOrderStatus(order._id,"Order Confirmed")} className="hover:scale-105 transition ease-in-out rounded-lg bg-green-500 text-white text-sm px-8 py-3 mr-2">
                                                            CONFIRM ORDER
                                                        </button>
                                                    )
                                                    : order.status === "Order Confirmed" ?
                                                    (
                                                        <button onClick={()=>updateOrderStatus(order._id,"Order Sending")} className="hover:scale-105 transition ease-in-out rounded-lg bg-green-500 text-white text-sm px-8 py-3 mr-2">
                                                            SEND ORDER
                                                        </button>
                                                    )
                                                    : null
                                                }
                                                
                                                {
                                                    order.status !== "Order Canceled" && order.status !== 'Order Delivered'
                                                    ?
                                                    (
                                                        <button  onClick={()=>updateOrderStatus(order._id,"Order Canceled")}  className="hover:scale-105 transition ease-in-out rounded-lg bg-gray-300 text-gray-800 text-sm px-8 py-3">
                                                            CANCEL
                                                        </button>
                                                    )
                                                    : null
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                );
                            }else{
                                return (
                                    <div key={userId} className="flex-1 border border-gray-400 rounded-lg lg:p-8 py-7 bg-white mb-5 lg:mx-5">
                                        <div className="flex mx-3 items-center gap-2 text-2xl font-medium text-gray-900">
                                            <div className="w-[60px] mr-2">
                                                <div className="relative pb-[100%] w-full">
                                                    <img src={shopsData.find((shop) => shop._id === userId).shopImage} className="rounded-full absolute top-0 left-0 w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <p>{shopsData.find((shop) => shop._id === userId).name}</p>
                                            <FontAwesomeIcon icon={faShop} className='text-[30px] text-blue-500 ml-2 hidden lg:block' />
                                            <span className="ml-auto">
                                                <button className={`text-white rounded-full text-[1rem] px-2 py-0.5
                                                                    ${order.status == "Order Placed" ? 'bg-gray-400' : ''}
                                                                    ${order.status == "Order Confirmed" ? 'bg-blue-500' : ''}
                                                                    ${order.status == "Order Sending" ? 'bg-yellow-500' : ''}
                                                                    ${order.status == "Order Canceled" ? 'bg-red-500' : ''}
                                                                    ${order.status == "Order Delivered" ? 'bg-green-500' : ''}
                                                                    `}>
                                                    { order.status == "Order Placed" ? 'Order Placed' : '' }
                                                    { order.status == "Order Confirmed" ? 'Order Preparing' : '' }
                                                    { order.status == "Order Sending" ? 'Order Shiping' : '' }
                                                    { order.status == "Order Canceled" ? 'Order Canceled' : '' }
                                                    { order.status == "Order Delivered" ? 'Order Completed' : '' }
                                                </button>
                                            </span>
                                        </div>
                                        <hr className="mt-4" />
                                        
                                        <div>
                                            {items.map((item, itemIndex) => {
                                                let productData;
                                                let price = 0;
                                                let optionLabel = "";
                                                if (item.option === 0) {
                                                    productData = productDetail.find((product) => product._id === item.id);
                                                    price = productData ? productData.price : 0;
                                                } else if (item.option === 1) {
                                                    productData = productDetail.find((product) =>
                                                        product.options.some((option) => option._id === item.id)
                                                    );
                                                    if (productData) {
                                                        const option = productData.options.find((opt) => opt._id === item.id);
                                                        price = option ? option.price : 0;
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
                                                        const subOption = option ? option.option2.find((subOpt) => subOpt._id === item.id) : null;
                                                        price = subOption ? subOption.price : 0;
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
                                                let review = userReviews.find((review) => review.orderId === order._id && review.productId === item.id )
                                                return (
                                                <div key={itemIndex}>
                                                    <div  className={`mx-3 py-4 border-t ${order.status !== 'Order Delivered' ? 'border-b' : ''} text-gray-700 grid grid-cols-[1fr_0.5fr_0.5fr] sm:grid-cols-[1fr_0.5fr_0.5fr] items-center gap-4`}>
                                                        <div className="flex items-start gap-6">
                                                            <div className="w-16 sm:w-20">
                                                                <div className="relative pb-[100%] w-full">
                                                                    <img src={productData?.images[0]} className="absolute top-0 left-0 w-full h-full object-cover" alt="Product" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs sm:text-lg font-medium">{productData?.name}</p>
                                                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 mt-2">
                                                                    <p>{currency} {price}</p>
                                                                    <div className="flex gap-1">
                                                                        {optionLabel}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p>Qty : {item.qty}</p>
                                                        <p>Price : {currency} {item.qty*price}</p>
                                                    </div>
                                                    {
                                                        order.status === 'Order Delivered'
                                                        ?
                                                            typeof review === 'undefined' ?
                                                            (
                                                                <div className='flex flex-col gap-2 p-3 text-sm'>
                                                                    <div className='flex justify-between mx-5'>
                                                                        <b>Rate :</b>
                                                                        <Box sx={{ '& > legend': { mt: 2 } }}>
                                                                            <Rating
                                                                                name="simple-controlled"
                                                                                value={ratings[order._id]?.[item.id] || 0}
                                                                                onChange={(event, newValue) => ratingItem(order._id, item.id, Number(newValue))}
                                                                            />
                                                                        </Box>
                                                                    </div>
                                                                    <div className='flex justify-between mx-5'>
                                                                        <b>Review :</b>
                                                                        <textarea
                                                                            className="input-f w-[80%] ml-5 px-3 py-2"
                                                                            type="text"
                                                                            value={reviews[order._id]?.[item.id] || ''}
                                                                            onChange={(event) => reviewItem(order._id, item.id, event.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className='ml-auto flex items-center mr-5'>
                                                                        <button onClick={()=>reviewProduct(order._id, item.id, userId)} className=" hover:scale-105 transition ease-in-out rounded-lg bg-blue-500 text-white text-sm px-8 py-3">
                                                                            SEND REVIEW
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) 
                                                            : 
                                                            (
                                                                <div className='flex flex-col gap-2 p-3 text-sm'>
                                                                    <div className='flex justify-between mx-5'>
                                                                        <b>Rate :</b>
                                                                        <Box sx={{ '& > legend': { mt: 2 } }}>
                                                                            <Rating
                                                                                name="simple-controlled"
                                                                                value={review.rate}
                                                                                onChange={(event, newValue) => ratingItem(order._id, item.id, Number(newValue))}
                                                                                readOnly
                                                                            />
                                                                        </Box>
                                                                    </div>
                                                                    <div className='flex justify-between mx-5'>
                                                                        <b>Review :</b>
                                                                        <textarea
                                                                            className="input-f w-[80%] ml-5 px-3 py-2 bg-gray-200"
                                                                            type="text"
                                                                            value={review.review}
                                                                            onChange={(event) => reviewItem(order._id, item.id, event.target.value)}
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )
                                                        : null
                                                    }
                                                </div>
                                                );
                                            })}
                                        </div>
                                        <div className={`address-detail flex-1 border border-gray-400 rounded-lg p-5 mx-5 mb-3 bg-white`}>
                                            <div>
                                                <p className="flex items-center gap-2 font-medium text-gray-900">
                                                    <FontAwesomeIcon icon={faLocationDot} className="text-blue-400 ml-2" />
                                                    {userAddress.name}
                                                </p>
                                                <div className="ml-5 mt-2">
                                                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">{userAddress.detail}</p>
                                                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">
                                                        {userAddress.district}, {userAddress.city}, {userAddress.province}, {userAddress.zipcode}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">
                                                        <FontAwesomeIcon icon={faSquarePhone} className="text-[1rem] mr-1" />
                                                        {userAddress.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-2 p-5 text-sm'>
                                            <div className='flex justify-between mx-5'>
                                                <p>Date</p>
                                                <p>{new Date(order.date).toDateString()}</p>
                                            </div>
                                            <hr />
                                            <div className='flex justify-between mx-5'>
                                                <p>Amount</p>
                                                <p>{currency} {order.amount}.00</p>
                                            </div>
                                            <hr />
                                            <div className='flex justify-between mx-5'>
                                                <p>Shipping Fee</p>
                                                <p>{currency} 10.00</p>
                                            </div>
                                            <hr />
                                            <div className='flex justify-between mx-5'>
                                                <b>Total Amount</b>
                                                <b>{currency} {order.amount+10}.00</b>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 lg:text-xl font-medium text-gray-900 mr-5">
                                            <div className='ml-auto flex items-center'>
                                                {
                                                    order.status === 'Order Sending'
                                                    ?
                                                    (
                                                        <button onClick={()=>updateOrderStatus(order._id,"Order Delivered")}  className=" hover:scale-105 transition ease-in-out rounded-lg bg-green-500 text-white text-sm px-8 py-3 mr-3">
                                                                ORDER DELIVERED
                                                            </button>
                                                    )
                                                    :null
                                                }
                                                {
                                                    order.status !== "Order Canceled" && order.status !== 'Order Delivered'
                                                    ?
                                                    (
                                                        <button className=" hover:scale-105 transition ease-in-out rounded-lg bg-gray-300 text-gray-800 text-sm px-8 py-3">
                                                            CANCEL
                                                        </button>
                                                    )
                                                    :null
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                        });

                    })
                }
            </div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openBackdrop}  // Change this line
                onClick={()=>setOpenBackdrop(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    )
}

export default Order
