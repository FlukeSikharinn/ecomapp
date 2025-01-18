import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePhone, faStar, faShop } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const Product = () => {

    const {productId} = useParams();
    const {currency,addToCart,backendUrl,navigate} = useContext(ShopContext);
    const [productData,setProductData] = useState(false);
    const [image,setImage] = useState('');
    const [option1,setOption1] = useState('');
    const [option2,setOption2] = useState('');
    const [allPrice,setAllPrice] = useState('');
    const [price,setPrice] = useState('');
    const [checkOption,setCheckOption] = useState(0);
    const [selectProductId,setSelectProductId] = useState('');
    const [navInfo,setNavInfo] = useState('des');
    const [reviews,setReviews] = useState('');
    const [userReviews,setUserReviews] = useState('');
    const [selectedRating, setSelectedRating] = useState(null);
    const [shop,setShop] = useState('');
    const [orders,setOrders] = useState('');
    const [shopId,setShopId] = useState('');

    const fetchProductData = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/product/single',{productId})
            if(response.data.success){
                await setProductData(response.data.product)
                await setReviews(response.data.reviews)
                await setUserReviews(response.data.userReviews)
                await setImage(response.data.product.images[0])
                await setShop(response.data.shop)
                await setShopId(response.data.shop._id)
                await setOrders(response.data.orders)
                if (response.data.product.options.length > 0) {
                    if (response.data.product.options[0].option2.length > 0) {
                        const allPrices = response.data.product.options.flatMap(opt => 
                            opt.option2
                                .filter(opt => opt.active)
                                .map(opt => opt.price)
                        );
                
                        if (allPrices.length > 0) {
                            const highestPrice = Math.max(...allPrices);
                            const lowestPrice = Math.min(...allPrices);
                            if(lowestPrice === highestPrice){
                                setPrice(`${lowestPrice}`);
                                setAllPrice(`${lowestPrice}`);
                            }else{
                                setPrice(`${lowestPrice} - ${highestPrice}`);
                                setAllPrice(`${lowestPrice} - ${highestPrice}`);
                            }
                        } else {
                            setPrice('0');
                            setAllPrice('0');
                        }
                        setCheckOption(2)
                    } else {
                        const activeOptions = response.data.product.options.filter(opt => opt.active === true);
                        const minPrice = Math.min(...activeOptions.map(opt => opt.price));
                        const maxPrice = Math.max(...activeOptions.map(opt => opt.price));
                        if (minPrice === maxPrice) {
                            setPrice(`${minPrice}`);
                            setAllPrice(`${minPrice}`);
                        } else {
                            setPrice(`${minPrice} - ${maxPrice}`);
                            setAllPrice(`${minPrice} - ${maxPrice}`);
                        }
                        setCheckOption(1);
                    }
                } else {
                    setPrice(response.data.product.price);
                    setAllPrice(response.data.product.price);
                    setCheckOption(0)
                }
                setSelectProductId(response.data.product._id)
            }else{
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const isButtonDisabled = () => {
        if (checkOption === 0) {
            return false;
        } 
        if (checkOption === 1) {
            return option1 === '';
        } 
        if (checkOption === 2) {
            return option1 === '' || option2 === '';
        }
        return true;
    };

    const selectRating = (rating) => {
        if (selectedRating === rating) {
            setSelectedRating(null);
        } else {
            setSelectedRating(rating);
        }
    };

    const goToShop = async () => {
        navigate(`/shop/${shopId}`);
    }

    const filteredReviews = selectedRating
    ? reviews.filter(review => review.rate === selectedRating)
    : reviews;

    useEffect(()=>{
        fetchProductData();
    },[productId])

    return productData ? (
        <div className='border-t pt-10 transtion-opacity ease-in duration-500 opacity-100'>
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* image */}
                <div className='flex-1 flex flex-col reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:justify-normal sm:w-[18.7%] w-full'>
                        {
                            productData.images.map((item, index) => (
                                <div key={index} className='relative w-[24%] sm:w-full sm:mb-3 flex-shrink-0 mr-1'>
                                    <div className="relative pb-[100%] w-full">
                                    <img
                                        onClick={() => setImage(item)}
                                        src={item}
                                        className='absolute top-0 left-0 w-full h-full object-cover cursor-pointer'
                                        alt=""
                                    />
                                    </div>
                                </div>
                            ))
                        }

                        {       
                            productData.options.length > 0 
                            ? 
                            productData.options.map((item, index) => (
                                <div key={index} className='relative w-[24%] sm:w-full sm:mb-3 flex-shrink-0 mr-1'>
                                    <div className="relative pb-[100%] w-full">
                                    <img
                                        onClick={() => setImage(item.image)}
                                        src={item.image}
                                        className='absolute top-0 left-0 w-full h-full object-cover cursor-pointer'
                                        alt=""
                                    />
                                    </div>
                                </div>
                            ))
                            : null
                        }

                    </div>

                    <div className='w-full sm:w-[80%]'>
                        <div className="relative pb-[100%] w-full">
                            <img src={image} className='absolute top-0 left-0 w-full h-full object-contain bg-gray-200' alt="" />
                        </div>
                    </div>
                </div>
                {/* info */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                    <div className='flex items-center gap-1 mt-2'>
                        <Box sx={{ '& > legend': { mt: 2 } }}>
                            <Rating
                            name="simple-controlled"
                            value={productData.rate ? productData.rate : 0}
                            readOnly
                            />
                        </Box>
                        <p className='pl-2'>({reviews.length})</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>{currency} {price}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

                    {/* {productData.option.map((item,index)=>(
                        <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                    ))} */}
                    {
                        productData.options.length > 0 
                        ? 
                        (
                            productData.options[0].option2.length > 0
                            ? (
                                <div>
                                    <div className='flex flex-col gap-4 my-8'>
                                        <p>Select Option 1</p>
                                        <div className='flex gap-2'>
                                            {productData.options.map((item, index) => {
                                                const isDisabled = option2
                                                    ? !item.option2.some(opt2 => opt2.option === option2 && opt2.active)
                                                    : false;

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                setOption1(option1 === item.option ? '' : item.option);
                                                                setImage(option1 === item.option ? image : item.image);
                                                                if(option2){
                                                                    setPrice(option1 === item.option ? allPrice : item.option2.filter(opt2 => opt2.option === option2)[0].price);
                                                                }else{
                                                                    setPrice(allPrice);
                                                                }
                                                            }
                                                        }}
                                                        className={`border-2 py-2 px-4 bg-gray-100 ${
                                                            item.option === option1 ? 'border-blue-500' : ''
                                                        } ${isDisabled ? 'cursor-not-allowed bg-gray-300' : ''}`}
                                                        disabled={isDisabled}
                                                    >
                                                        {item.option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {
                                        option1 === ''
                                        ?
                                        <div className='flex flex-col gap-4 my-8'>
                                            <p>Select Option 2</p>
                                            <div className='flex gap-2'>
                                                {productData.options[0].option2.map((item,index)=>(
                                                    <button onClick={() => {setOption2(option2 === item.option ? '' : item.option); setSelectProductId(item._id)}} className={`border-2 py-2 px-4 bg-gray-100 ${item.option === option2 ? 'border-blue-500' : ''}`} key={index}>{item.option}</button>
                                                ))}
                                            </div>
                                        </div>
                                        :
                                        <div className='flex flex-col gap-4 my-8'>
                                            <p>Select Option 2</p>
                                            <div className='flex gap-2'>
                                                {productData.options
                                                    .find(opt => opt.option === option1)?.option2.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                setOption2(option2 === item.option ? '' : item.option);
                                                                setSelectProductId(option2 === item.option ? '' : item._id);
                                                                setPrice(option2 === item.option ? allPrice : item.price);
                                                            }}
                                                            className={`border-2 py-2 px-4 bg-gray-100 ${
                                                                item.option === option2 ? 'border-blue-500' : ''
                                                            } ${!item.active ? 'cursor-not-allowed bg-gray-300' : ''}`}
                                                            disabled={!item.active}
                                                        >
                                                            {item.option}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    }

                                </div>
                            )
                            : (
                                <div className='flex flex-col gap-4 my-8'>
                                    <p>Select Option</p>
                                    <div className='flex gap-2'>
                                        {productData.options.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (item.active) {
                                                        setOption1(option1 === item.option ? '' : item.option);
                                                        setPrice(option1 === item.option ? allPrice : item.price);
                                                        setSelectProductId(item._id);
                                                        setImage(option1 === item.option ? image : item.image);
                                                    }
                                                }}
                                                className={`border-2 py-2 px-4 bg-gray-100 ${item.option === option1 ? 'border-blue-500' : ''} ${!item.active ? 'cursor-not-allowed bg-gray-300' : ''}`}
                                                disabled={!item.active}
                                            >
                                                {item.option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        )
                        : (
                            <br />
                        )
                    }

                    <button onClick={isButtonDisabled() ? null : () => addToCart(selectProductId,checkOption,productData.userId,shopId)}
                        className={`${isButtonDisabled() ? 'bg-gray-300' : 'bg-black'} text-white px-8 py-3 text-sm ${!isButtonDisabled() && 'active:bg-gray-700'}`}
                        disabled={isButtonDisabled()}
                    >
                        ADD TO CART
                    </button>

                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>100% Original product.</p>
                        <p>Chas on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>
            {/* review */}
            <hr className='mt-20' />
            <div className='mt-10'>
                <div className='flex'>
                    <b onClick={()=>setNavInfo('des')} className={`border px-5 py-3 text-sm cursor-pointer ${navInfo == "des" ? '' : 'bg-gray-200'}`}>Description</b>
                    <b onClick={()=>setNavInfo('review')} className={`border px-5 py-3 text-sm cursor-pointer ${navInfo == "review" ? '' : 'bg-gray-200'}`}>Reviews ({reviews.length})</b>
                </div>
                <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                    {
                        navInfo === 'des' 
                        ? 
                            (
                                <div>
                                    <div className="flex mx-3 items-center text-xl gap-2 font-medium text-gray-900">
                                        <div className="w-[50px] mr-2">
                                            <div onClick={()=>goToShop(shop._id)} className="cursor-pointer relative pb-[100%] w-full">
                                                <img src={shop.shopImage} className="rounded-full absolute top-0 left-0 w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <p onClick={()=>goToShop()} className='cursor-pointer'>{shop.shopName}</p>
                                        <FontAwesomeIcon icon={faShop} className='text-blue-500 ml-2 hidden lg:block' />
                                    </div>
                                    <hr className='mt-3 mb-3' />
                                    <div className='mx-5 flex'>
                                        <b className='mr-2'>Shop : </b>
                                        <Box sx={{ '& > legend': { mt: 2 } }}>
                                            <Rating
                                            name="simple-controlled"
                                            value={shop.shopRate ? shop.shopRate : 0}
                                            readOnly
                                            />
                                        </Box>
                                    </div>
                                    <div className='mx-5 flex'>
                                        <b className='mr-2'>Selled : {orders.length}</b>
                                    </div>
                                </div>
                            )
                        : navInfo === 'review' 
                        ? 
                            (
                                <>
                                <div className='flex mx-5'>
                                    <button className={`border-2 py-2 px-2 mr-2 ${selectedRating === 5 ? '' : 'bg-gray-200'}`} onClick={() => selectRating(5)}>
                                        <FontAwesomeIcon icon={faStar} className='text-yellow-500 mr-1' />
                                        (5)
                                    </button>
                                    <button className={`border-2 py-2 px-2 ${selectedRating === 4 ? '' : 'bg-gray-200'} mr-2`} onClick={() => selectRating(4)}>
                                        <FontAwesomeIcon icon={faStar} className='text-yellow-500 mr-1' />
                                        (4)
                                    </button>
                                    <button className={`border-2 py-2 px-2 ${selectedRating === 3 ? '' : 'bg-gray-200'} mr-2`} onClick={() => selectRating(3)}>
                                        <FontAwesomeIcon icon={faStar} className='text-yellow-500 mr-1' />
                                        (3)
                                    </button>
                                    <button className={`border-2 py-2 px-2 ${selectedRating === 2 ? '' : 'bg-gray-200'} mr-2`} onClick={() => selectRating(2)}>
                                        <FontAwesomeIcon icon={faStar} className='text-yellow-500 mr-1' />
                                        (2)
                                    </button>
                                    <button className={`border-2 py-2 px-2 ${selectedRating === 1 ? '' : 'bg-gray-200'} mr-2`} onClick={() => selectRating(1)}>
                                        <FontAwesomeIcon icon={faStar} className='text-yellow-500 mr-1' />
                                        (1)
                                    </button>
                                </div>

                                {filteredReviews.map((review, index) => {
                                    const user = userReviews.find(user => user._id.toString() === review.userId.toString());

                                    let optionLabel = null;
                                    if (review.productId !== productData._id) {
                                        productData.options.forEach(option => {
                                            if (option._id === review.productId) {
                                                optionLabel = (
                                                <p className="px-2 sm:px-3 py-1 border bg-slate-50">
                                                    {option.option}
                                                </p>
                                                );
                                            }

                                            if (optionLabel === null) {
                                                option.option2.forEach(option2 => {
                                                if (option2._id === review.productId) {
                                                    optionLabel = (
                                                    <div className='flex'>
                                                        <p className="px-2 sm:px-3 border bg-slate-50 mr-2">
                                                        {option.option}
                                                        </p>
                                                        <p className="px-2 sm:px-3 border bg-slate-50">
                                                        {option2.option}
                                                        </p>
                                                    </div>
                                                    );
                                                }
                                                });
                                            }
                                        });
                                    }

                                    return (
                                        <div key={index} className='flex-1 border border-gray-400 rounded-md p-5 lg:mx-5 mb-3 bg-white'>
                                            <div className='flex items-center gap-2'>
                                                <div className='w-[30px] mr-2'>
                                                    <div className='relative pb-[100%] w-full'>
                                                        <img 
                                                        src={user?.profileImage || '/default-avatar.png'}
                                                        alt={user?.name || 'Anonymous'} 
                                                        className='rounded-full absolute top-0 left-0 w-full h-full object-cover' 
                                                        />
                                                    </div>
                                                </div>
                                                <p className='font-medium text-gray-900'>{user?.name || 'Anonymous'}</p>
                                            </div>
                                        <hr className='mt-3 mb-3' />
                                        <div className='ml-5 mt-2'>
                                            <div className='flex text-sm font-medium text-gray-500'>
                                                <b className='mr-2'>Rate:</b>
                                                <Box sx={{ '& > legend': { mt: 2 } }}>
                                                    <Rating
                                                    name="simple-controlled"
                                                    value={review.rate}
                                                    readOnly
                                                    />
                                                </Box>
                                                </div>
                                                <div className='flex'>
                                                    <b className='text-sm font-medium text-gray-500 mr-2'>
                                                        Option:
                                                    </b>
                                                    {optionLabel}
                                                </div>
                                                <p className='text-sm font-medium text-gray-500 mt-2'>Review: {review.review}</p>
                                                <p className='text-sm font-medium text-gray-500 mt-1'>Date: {new Date(review.date).toDateString()}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                            )
                        : null
                    }
                    
                </div>
            </div>

            {/* relate product */ }

            <RelatedProducts category={productData.category} />
        </div>
    ) : <div className='opacity-0'></div>
}

export default Product
