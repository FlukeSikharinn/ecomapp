import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import profile_icon from '../assets/user.png';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductList from './ProductList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear,faCheck,faXmark,faCertificate,faInfoCircle,faStar,faStarHalf,faShop,faCircleXmark,faBagShopping,faCartShopping,faAddressBook,faList } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { toast } from 'react-toastify'
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Order from './Order';
import Address from './Address';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const ShopProfile = () => {

    const { backendUrl, currency, token} = useContext(ShopContext);

    const [isUploadImage,setIsUploadImage] = useState('setting');
    const [isUpdateProfile,setIsUpdateProfile] = useState('');
    const [currentImage,setCurrentImage] = useState(profile_icon);
    const [star,setStar] = useState(4.5);
    const [profileImage,setProfileImage] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [shopName, setShopName] = useState('');
    const [shopInfo, setShopInfo] = useState('');
    const [currentShopName, setCurrentShopName] = useState('');
    const [currentShopInfo, setCurrentShopInfo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [orders, setOrders] = useState('');
    const [shopRating, setShopRating] = useState(0);
    const [shopId, setShopId] = useState(0);

    const loadProfile = async () => {
        try {
            if(!token){
                return null;
            }
            setOpenBackdrop(true);
            const response = await axios.post(backendUrl + '/api/user/profile',{},{headers:{token}})
            if(response.data.success){
                setStartDate(response.data.userData.date)
                setOrders(response.data.orders)
                setShopId(response.data.userData._id)

                if(response.data.userData.shopRate){
                    setShopRating(parseFloat(response.data.userData.shopRate.toFixed(2)));
                }else{
                    let rate = 0;
                    response.data.reviewsData.forEach((review) => {
                        rate += review.rate;
                    });
                    rate = rate / response.data.reviewsData.length;
                    if (rate > 0) {
                        setShopRating(parseFloat(rate.toFixed(2)));
                    }
                }

                setOpenBackdrop(false);
                const userData = response.data?.userData || {};
                const ordersData = response.data?.orders || [];

                setCurrentImage(userData.shopImage || p_img2_1);
                setCurrentShopName(userData.shopName || userData.name || 'Default Shop Name');
                setCurrentShopInfo(userData.detail || '................');
            }
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        loadProfile();
    },[token])

    const uploadProfileImage = async () => {
        try {
            setOpenBackdrop(true);
            const image = await convertToBase64(profileImage);
            const type = 'profile'
            
            const response = await axios.post(backendUrl + '/api/user/profile-image-update', {image} ,{headers:{token}})
            // console.log(response)
            if(response.data.success){
                toast.success(response.data.message)
            }
            setOpenBackdrop(false);
            setIsUploadImage('setting');
        } catch (error) {
            console.log(error)
        }
    }
    
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const saveUpdateProfile = async () => {
        try {
            setOpenBackdrop(true);

            const data = {
                name: shopName,
                info: shopInfo,
                type: "shop"
            };
    
            const response = await axios.post(backendUrl + '/api/user/profile-update',data,{headers:{token}})
            // console.log(response)
            if(response.data.success){
                toast.success(response.data.message)
                setCurrentShopName(shopName)
                setCurrentShopInfo(shopInfo)
            }
            setOpenBackdrop(false);
            setIsUpdateProfile('');
        } catch (error) {
            console.log(error)
        }
    }

    const [tapValue, setTapValue] = useState(0);

    const handleChangeTap = (event, newValue) => {
        setTapValue(newValue);
    };

  return (
    <div>
        
        <div className='text-2xl text-center pt-8 border-t mb-2'>
            < Title text1={'SHOP '} text2={'PROFILE'} />
        </div>
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-5'>
            <div className='h-[270px] w-[270px] items-center relative'>
                    <img src={profileImage ? URL.createObjectURL(profileImage) : currentImage} className='bg-primary h-full w-full object-cover rounded-lg' alt="" />
                    {
                        isUploadImage === 'setting' ? (
                            <div>
                                <label htmlFor="profileImage">
                                    <p className='hover:scale-110 transition ease-in-out cursor-pointer absolute right-[10px] bottom-[10px] w-8 h-8 text-center leading-4 bg-gray-500 text-white rounded-full text-[8px] flex items-center justify-center'>
                                        <FontAwesomeIcon icon={faGear} className='text-[15px]' />
                                    </p>
                                    <input onChange={(e)=>{setProfileImage(e.target.files[0]); setIsUploadImage('uploading')}} type="file" id="profileImage" hidden/>
                                </label>
                            </div>
                        ) : isUploadImage === 'uploading' ? (
                            <div>
                                <p onClick={()=>{setProfileImage(''); setIsUploadImage('setting')}} className='hover:scale-110 transition ease-in-out cursor-pointer absolute right-[10px] bottom-[10px] w-8 h-8 text-center leading-4 bg-[#e74c3c] text-white rounded-full text-[8px] flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faXmark} className='text-[15px]' />
                                </p>
                                <p onClick={()=>uploadProfileImage()} className='hover:scale-110 transition ease-in-out cursor-pointer absolute right-[45px] bottom-[10px] w-8 h-8 text-center leading-4 bg-[#2ecc71] text-white rounded-full text-[8px] flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faCheck} className='text-[15px]' />
                                </p>
                            </div>
                        ) : null
                    }
            </div>
            <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2'>
                {
                    isUpdateProfile === 'updating' ? (
                        <div>
                            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                                <input onChange={(e)=>setShopName(e.target.value)} value={shopName} className='bg-gray-50 border rounded-[4px] w-full max-w-[400px] px-3 py-2' type="text" placeholder='type here' required/>
                                <FontAwesomeIcon icon={faShop} className='text-[30px] text-blue-500 ml-2 hidden lg:block' />
                                <span className='ml-auto flex'>
                                    <button onClick={()=>saveUpdateProfile()} className='hover:scale-110 transition ease-in-out border rounded-full text-[1rem] px-2 py-0.5 bg-[#2ecc71] text-white'>
                                        <FontAwesomeIcon icon={faCheck} className='text-[1rem]' /> Save
                                    </button>
                                    <FontAwesomeIcon onClick={()=>setIsUpdateProfile('')} icon={faCircleXmark} className='cursor-pointer hover:scale-110 transition ease-in-out text-[35px] text-gray-500 ml-1 hidden lg:block' />
                                </span>
                            </p>
                            <div className='flex items-center gap-1 text-sm mt-1 text-gray-600 mt-2'>
                                <Box sx={{ '& > legend': { mt: 2 } }}>
                                    <Rating
                                        name="simple-controlled"
                                        value={shopRating}
                                        readOnly
                                    />
                                </Box>
                                {shopRating} | 
                                <button className='py-0.5 px-2 border text-xs rounded-full'>Sold {orders} Order.</button>
                            </div>
                            <hr className='mt-1' />
                            <div>
                                <p className='flex items-center gap-1 text-sm font-medium text-gray-500 mt-3'>
                                    About
                                    <FontAwesomeIcon icon={faInfoCircle} className='text-[15px]' />
                                </p>
                                <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
                                    <textarea onChange={(e)=>setShopInfo(e.target.value)} value={shopInfo} className='bg-gray-50 border rounded-[4px] w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write detail here' required/>
                                </p>
                            </div>
                            <p className='mt-2'>
                                Start date : {new Date(startDate).toDateString()}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                                {currentShopName}
                                <FontAwesomeIcon icon={faShop} className='text-[25px] text-blue-500 ml-2' />
                                <span className='ml-auto'>
                                    <button onClick={()=>{setIsUpdateProfile('updating'); setShopName(currentShopName); setShopInfo(currentShopInfo)}} className='hover:scale-110 transition ease-in-out border rounded-full text-[1rem] px-2 py-0.5'>
                                        <FontAwesomeIcon icon={faGear} className='text-[1rem]' /> Edit
                                    </button>
                                </span>
                            </p>
                            <div className='flex items-center gap-1 text-sm mt-1 text-gray-600 mt-2'>
                                <Box sx={{ '& > legend': { mt: 1 } }}>
                                    <Rating
                                        name="simple-controlled"
                                        value={shopRating}
                                        readOnly
                                    />
                                </Box> 
                                ({shopRating}) | 
                                <button className='py-0.5 px-2 border text-xs rounded-full'>Sold {orders} Order.</button>
                            </div>
                            <hr className='mt-1' />
                            <div>
                                <p className='flex items-center gap-1 text-sm font-medium text-gray-500 mt-3'>
                                    About <FontAwesomeIcon icon={faInfoCircle} className='text-[15px]' />
                                </p>
                                <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
                                    {currentShopInfo}
                                </p>
                            </div>
                            <p className='mt-2'>
                                Start date : {new Date(startDate).toDateString()}
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
        <hr />
        <Box sx={{ width: '100%' }}>
            <Tabs
                value={tapValue}
                onChange={handleChangeTap}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                textColor="primary"
                indicatorColor="primary"
            >
                <Tab
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faBagShopping} />
                    <span>Products</span>
                    </Box>
                }
                sx={{ fontWeight: 'bold', fontFamily: 'Outfit' }}
                />
                <Tab
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Orders</span>
                    </Box>
                }
                sx={{ fontWeight: 'bold', fontFamily: 'Outfit' }}
                />
                {/* <Tab
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faAddressBook} />
                    <span>Address</span>
                    </Box>
                }
                sx={{ fontWeight: 'bold', fontFamily: 'Outfit' }}
                /> */}
                {/* <Tab
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faList} />
                    <span>List</span>
                    </Box>
                }
                sx={{ fontWeight: 'bold', fontFamily: 'Outfit' }}
                /> */}
            </Tabs>
        </Box>
        <div>
            {shopId !== 0 && tapValue === 0 && <ProductList shopId={shopId} />}
            {tapValue === 1 && <Order user={'shop'} />}
            {tapValue === 2 && <Address />}
            {/* {tapValue === 3 && <p>List Content</p>} */}
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

export default ShopProfile

// <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
//                 <Tabs value={tapValue} onChange={handleChangeTap} variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary">
//                     <Tab icon={<FontAwesomeIcon icon={faBagShopping} />} label="Products" />
//                     <Tab icon={<FontAwesomeIcon icon={faCartShopping} />} label="Orders" />
//                     <Tab icon={<FontAwesomeIcon icon={faAddressBook} />} label="Address" />
//                     <Tab icon={<FontAwesomeIcon icon={faList} />} label="List" />
//                 </Tabs>
//             </Box>