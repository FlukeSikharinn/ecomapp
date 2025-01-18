import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight,faCircleCheck,faSquarePhone,faShop,faHouseChimneyUser,faLocationDot } from '@fortawesome/free-solid-svg-icons';

const PlaceOrder = () => {

    const [method,setMethod] = useState('cod');
    const {navigate,backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, currency} = useContext(ShopContext);
    const [name,setName] = useState('');
    const [phone,setPhone] = useState('');
    const [detail,setDetail] = useState('');

    const location = useLocation();
    const { cartData,cartProducts } = location.state;

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            let address;
            if(isOpenAddress1){
                address = {
                    name:name,
                    phone:phone,
                    detail:detail,
                    province:selectedProvince,
                    city:selectedCity,
                    district:selectedDistrict,
                    zipcode:zipcodes,
                }
            }else{
                const defaultAddress = userAddress.find((address) => address.status === true)
                address = {
                    name:defaultAddress.name,
                    phone:defaultAddress.phone,
                    detail:defaultAddress.detail,
                    province:defaultAddress.province,
                    city:defaultAddress.city,
                    district:defaultAddress.district,
                    zipcode:defaultAddress.zipcode,
                }
            }

            let orderData = {
                address: address,
                items: cartData
            }

            switch (method) {
                case "cod":
                    const response = await axios.post(backendUrl + '/api/order/place', orderData,{headers:{token}})
                    if(response.data.success){
                        navigate('/orders')
                    }else{
                        toast.error(response.data.message)
                    }
                    break;
            
                default:
                    break;
            }
            

        } catch (error) {
            
        }
    }

    const [isOpenAddress1, setIsOpenAddress1] = useState(true);
    const [thaiDatas, setThaiDatas] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedZipcode, setSelectedZipcode] = useState('');
    const [amphures, setAmphures] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [zipcodes, setZipcodes] = useState('');

    const getThaiData = async () => {
        try {
            const response = await axios.get('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json')
            if(response.data){
                setThaiDatas(response.data)
                // console.log(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const selectProvince = (event, newValue) => {
        setSelectedProvince(newValue);
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedZipcode('');
        setAmphures([]);
        setDistricts([]);
        setZipcodes([]);

        const selectedProvinceData = thaiDatas.find((province) => province.name_en === newValue);
        setAmphures(selectedProvinceData ? selectedProvinceData.amphure : []);
    };

    const selectCity = (event, newValue) => {
        setSelectedCity(newValue);
        setSelectedDistrict('');
        setSelectedZipcode('');
        setDistricts([]);
        setZipcodes([]);

        const selectedCityData = amphures.find((amphure) => amphure.name_en === newValue);
        setDistricts(selectedCityData ? selectedCityData.tambon : []);
    };

    const selectDistrict = (event, newValue) => {
        setSelectedDistrict(newValue);
        setSelectedZipcode('');
        setZipcodes([]);

        const selectedDistrictData = districts.find((district) => district.name_en === newValue);
        setZipcodes(selectedDistrictData.zip_code);
    };

    const [userAddress,setUserAddress] = useState([]);
    
    const getUserAddress = async () => {
        try {
            if(!token){
                return null;
            }
            const response = await axios.post(backendUrl + '/api/user/get-address',{},{headers:{token}})
            if(response.data.success){
                if(response.data.userAddress.length > 0){
                    setIsOpenAddress1(false)
                }
                setUserAddress(response.data.userAddress);
            }
        } catch (error) {
            
        }
    }

    const setAddressDefault = async (addressId) => {
        try {
            if(!token){
                return null;
            }
            const response = await axios.post(backendUrl + '/api/user/set-defalut-address',{addressId},{headers:{token}})
            if(response.data.success){
                setUserAddress(response.data.userAddress);
                toast.success('Set Default Address Successfully')
            }
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        getUserAddress();
        getThaiData();
    },[token])

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/*  left side */}
            <div className='flex flex-col w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    < Title text1={'DELEVERY'} text2={'INFORMATION'} />
                </div>
                <div onClick={()=>setIsOpenAddress1(!isOpenAddress1)} className='cursor-pointer mb-2'>
                    <p className=' text-xl flex items-center gap-2'>
                        Other Address
                        <FontAwesomeIcon icon={faChevronRight} className={`h-3 transform transition-transform duration-300 ml-1 ${!isOpenAddress1 ? 'rotate-90' : ''}`} />
                    </p>
                </div>
                <div className={`transition-all duration-400 overflow-hidden w-full ${!isOpenAddress1 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {
                        userAddress
                        .sort((a, b) => b.status - a.status)
                        .map((item, index) => (
                            <div key={index} className={`overflow-hidden w-full max-h-[1000px] opacity-100 fluke`}>
                                <div className={`address-detail flex-1 border border-gray-400 rounded-lg p-5 mx-2 mb-3 ${item.status ? 'bg-white' : 'bg-gray-200'}`}>
                                    <div>
                                        <p className="flex items-center gap-2 font-medium text-gray-900">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-[25px] text-blue-400 ml-2" />
                                            {item.name}
                                        </p>
                                        <div className="ml-5 mt-2">
                                            <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">{item.detail}</p>
                                            <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">
                                                {item.district}, {item.city}, {item.province}, {item.zipcode}
                                            </p>
                                            <p className="flex items-center gap-1 text-sm font-medium text-gray-500 mt-1">
                                                <FontAwesomeIcon icon={faSquarePhone} className="text-[1rem] mr-1" />
                                                {item.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <hr className="mt-2" />
                                    <div className="mt-3">
                                        <p className="flex items-center text-sm font-medium text-gray-500">
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                onClick={() => setAddressDefault(item._id)}
                                                className={`hover:scale-110 transition ease-in-out cursor-pointer text-[20px] ${
                                                    item.status ? 'text-green-500' : 'text-gray-500'
                                                } ml-2 mr-2`}
                                            />
                                            Select to Address
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div onClick={()=>setIsOpenAddress1(!isOpenAddress1)} className='cursor-pointer mb-2'>
                    <p className=' text-xl flex items-center gap-2'>
                        Add Address
                        <FontAwesomeIcon icon={faChevronRight} className={`h-3 transform transition-transform duration-300 ml-1 ${isOpenAddress1 ? 'rotate-90' : ''}`} />
                    </p>
                </div>
                <div className={`transition-all duration-400 overflow-hidden w-full ${isOpenAddress1 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className='flex flex-col gap-1 w-full mt-3 sm:max-w-[480px]'>
                        <div className='flex gap-3'>
                            <div className='w-full'>
                                <p>Name</p>
                                <input onChange={(e)=>setName(e.target.value)} name="firstName" value={name} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                            </div>
                            <div className='w-full'>
                                <p>Phone</p>
                                <input onChange={(e)=>setPhone(e.target.value)} name="phone" value={phone} type="text" className='border border-gray-300 rounded py-1.5 px-3.5 w-full' />
                            </div>
                        </div>
                        <div className='w-full'>
                            <p>Detail</p>
                            <textarea onChange={(e)=>setDetail(e.target.value)} className='input-f w-full max-w-[500px] px-3 py-2' type="text" />
                        </div>
                        <div className='flex gap-3'>
                            <div className='w-full'>
                                <p>Province</p>
                                <Autocomplete
                                    value={selectedProvince}
                                    onChange={selectProvince}
                                    disablePortal
                                    options={thaiDatas.map((thaiData) => thaiData.name_en)}
                                    renderInput={(params) => <TextField {...params} size="small" />}
                                />
                            </div>
                            <div className='w-full'>
                                <p>City</p>
                                <Autocomplete
                                    value={selectedCity}
                                    onChange={selectCity}
                                    disablePortal
                                    options={amphures.map((amphure) => amphure.name_en)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            className={!selectedProvince ? 'bg-gray-100' : ''}
                                        />
                                    )}
                                    disabled={!selectedProvince}
                                />
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <div className='w-full'>
                                <p>District</p>
                                <Autocomplete
                                    value={selectedDistrict}
                                    onChange={selectDistrict}
                                    disablePortal
                                    options={districts.map((district) => district.name_en)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            className={!selectedCity ? 'bg-gray-100' : ''}
                                        />
                                    )}
                                    disabled={!selectedCity}
                                />
                            </div>
                            <div className='w-full'>
                                <p>Zipcode</p>
                                <input value={zipcodes} onChange={(e)=>setZipcodes(e.target.value)} name="zipcode" type="number" className={`border border-gray-400 rounded py-1.5 px-3.5 w-full ${!selectedDistrict ? 'bg-gray-100' : ''}`} disabled={!selectedDistrict} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            {/*  r side */}
            <div className='mt-10'>
                <br />
                <div className='text-2xl mb-3'>
                    <div className='w-full'>
                        <div className='text-2xl'>
                            < Title text1={'PRODUCTS'} text2={'LIST'} />
                        </div>
                        <div className="text-sm py-2 border-t border-b text-gray-700 grid grid-cols-[0.5fr_4fr_1.5fr_1.5fr] sm:grid-cols-[0.5fr_4fr_1.5fr_1.5fr] items-center gap-4">
                            <p></p>
                            <p>Product</p>
                            <p>Qty.</p>
                            <p>Amount</p>
                        </div>
                            {
                                cartData.items.map((item, index) => {
                                    let productData;
                                    let price = 0;
                                    let optionLabel = "";

                                    if (item.option === 0) {
                                        productData = cartProducts.find((product) => product._id === item.id);
                                        price = productData.price
                                    } else if (item.option === 1) {
                                        productData = cartProducts.find((product) =>
                                            product.options.some((option) => option._id === item.id)
                                        );
                                        if (productData) {
                                            const option = productData.options.find((opt) => opt._id === item.id);
                                            price = option.price;
                                            optionLabel = (
                                                <p className="px-2 border bg-slate-50">
                                                    {option.option}
                                                </p>
                                            );
                                        }
                                    } else if (item.option === 2) {
                                        productData = cartProducts.find((product) =>
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
                                                    <p className="px-2 border bg-slate-50">
                                                        {option.option}
                                                    </p>
                                                    <p className="px-2 border bg-slate-50">
                                                        {subOption.option}
                                                    </p>
                                                </>
                                            );
                                        }
                                    }

                                    return (
                                        <div key={item.id} className="text-sm py-2 border-b text-gray-700 grid grid-cols-[0.5fr_4fr_1.5fr_1.5fr] sm:grid-cols-[0.5fr_4fr_1.5fr_1.5fr] items-center gap-4">
                                            <div className="flex items-center gap-2 text-2xl font-medium text-gray-900 ml-5">
                                                <div className="w-[50px] mr-2">
                                                    <div className="relative pb-[100%] w-full">
                                                        <img src={productData?.images[0]} className="rounded-[2px] absolute top-0 left-0 w-full h-full object-cover" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-medium">{productData?.name}</p>
                                                <div className="flex items-center gap-5 mt-1">
                                                    <p>{currency} {price}</p>
                                                    <div className="flex gap-1">
                                                        {optionLabel}
                                                    </div>
                                                </div>
                                            </div>
                                            <p>{item.qty}</p>
                                            <p>{currency} {item.qty*price}</p>
                                        </div>
                                    );
                                })
                            }
                        {/* </div> */}
                    </div>
                </div>
                <div className='mt-8 min-w-80'>
                    <CartTotal total={cartData.totalAmount} />
                </div>
                <div className='mt-12'>
                    < Title text1={'PAYMENT'} text2={'MEDTHOD'} />
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img src={assets.stripe_logo} className='h-5 mx-4' alt="" />
                        </div>
                        <div onClick={()=>setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img src={assets.razorpay_logo} className='h-5 mx-4' alt="" />
                        </div>
                        <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>
                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
