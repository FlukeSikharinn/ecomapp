import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import profile_icon from '../assets/user.png';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductList from './ProductList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear,faCheck,faXmark,faUser,faInfoCircle,faStar,faStarHalf,faShop,faCircleXmark,faBagShopping,faCartShopping,faAddressBook,faList } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import { toast } from 'react-toastify'
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Order from './Order';
import Address from './Address';
import { useLocation, useNavigate } from 'react-router-dom';

const ShopProfile = () => {

    const { backendUrl, currency, token} = useContext(ShopContext);

    const [isUploadImage,setIsUploadImage] = useState('setting');
    const [isUpdateProfile,setIsUpdateProfile] = useState('');
    const [currentImage,setCurrentImage] = useState(profile_icon);
    const [star,setStar] = useState(4.5);
    const [profileImage,setProfileImage] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [shopInfo, setShopInfo] = useState('');
    const [currentProfileName, setCurrentProfileName] = useState('');
    const [currentShopInfo, setCurrentShopInfo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [orders, setOrders] = useState(0);
    const [reviews, setReviews] = useState(0);
    const location = useLocation();
    const fromPath = location.state?.from || location.pathname;
    const navigate = useNavigate();

    const loadProfile = async () => {
        try {
            if(!token){
                return null;
            }
            const response = await axios.post(backendUrl + '/api/user/profile',{},{headers:{token}})
            if(response.data.success){
                const userData = response.data.userData || {};
                setCurrentProfileName(userData.name || '');
                setCurrentShopInfo(userData.detail || '................');
                setStartDate(userData.date);
                setOrders(response.data.orders || 0);
                setReviews(response.data.reviews || 0);
                setCurrentImage(userData.profileImage || p_img2_1);
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

            const response = await axios.post(backendUrl + '/api/user/profile-image-update', {image,type},{headers:{token}})
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
                name: profileName,
                info: shopInfo,
                type: "profile"
            };

            const response = await axios.post(backendUrl + '/api/user/profile-update',data,{headers:{token}})

            if(response.data.success){
                toast.success(response.data.message)
                setCurrentProfileName(profileName)
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
            < Title text1={'MY '} text2={'PROFILE'} />
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
                                <input onChange={(e)=>setProfileName(e.target.value)} value={profileName} className='bg-gray-50 border rounded-[4px] w-full max-w-[400px] px-3 py-2' type="text" placeholder='type here' required/>
                                <FontAwesomeIcon icon={faUser} className='text-[30px] text-blue-500 ml-2 hidden lg:block' />
                                <span className='ml-auto flex'>
                                    <button onClick={()=>saveUpdateProfile()} className='hover:scale-110 transition ease-in-out border rounded-full text-[1rem] px-2 py-0.5 bg-[#2ecc71] text-white'>
                                        <FontAwesomeIcon icon={faCheck} className='text-[1rem]' /> Save
                                    </button>
                                    <FontAwesomeIcon onClick={()=>setIsUpdateProfile('')} icon={faCircleXmark} className='cursor-pointer hover:scale-110 transition ease-in-out text-[35px] text-gray-500 ml-1 hidden lg:block' />
                                </span>
                            </p>
                            <div className='flex items-center gap-1 text-sm mt-1 text-gray-600 mt-2'>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>Writed {reviews} Reviews.</button>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>Sold {orders} Orders.</button>
                            </div>
                            <hr className='mt-4' />
                            <p className='mt-2'>
                                Start date : {new Date(startDate).toDateString()}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                                {currentProfileName}
                                <FontAwesomeIcon icon={faUser} className='text-[25px] text-blue-500 ml-2' />
                                <span className='ml-auto'>
                                    <button onClick={()=>{setIsUpdateProfile('updating'); setProfileName(currentProfileName); setShopInfo(currentShopInfo)}} className='hover:scale-110 transition ease-in-out border rounded-full text-[1rem] px-2 py-0.5'>
                                        <FontAwesomeIcon icon={faGear} className='text-[1rem]' /> Edit
                                    </button>
                                </span>
                            </p>
                            <div className='flex items-center gap-1 text-sm mt-1 text-gray-600 mt-2'>
                                <button className='py-0.5 px-2 border text-xs rounded-full'>Writed {reviews} Reviews.</button>
                                <button className='py-0.5 px-2 border text-xs rounded-full'>Sold {orders} Orders.</button>
                            </div>
                            <hr className='mt-4' />
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
                {/* <Tab
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faBagShopping} />
                    <span>Products</span>
                    </Box>
                }
                sx={{ fontWeight: 'bold', fontFamily: 'Outfit' }}
                /> */}
                <Tab
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Orders</span>
                    </Box>
                }
                sx={{ fontWeight: 'bold', fontFamily: 'Outfit' }}
                />
                <Tab
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faAddressBook} />
                    <span>Address</span>
                    </Box>
                }
                sx={{ fontWeight: 'bold', fontFamily: 'Outfit' }}
                />
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
            {/* {tapValue === 0 && <ProductList />} */}
            {tapValue === 0 && <Order user={'my-profile'} />}
            {tapValue === 1 && <Address />}
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