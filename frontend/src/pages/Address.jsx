import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard,faCircleCheck,faSquarePhone,faXmark,faHouseChimneyUser,faLocationDot,faXmarkCircle,faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const Address = () => {

    const [method,setMethod] = useState('cod');
    const {navigate,backendUrl, token, currency} = useContext(ShopContext);
    const [name,setName] = useState('');
    const [phone,setPhone] = useState('');
    const [detail,setDetail] = useState('');
    const [userAddress,setUserAddress] = useState([]);

    const saveUserAddress = async () => {
        try {

            const address = {
                name:name,
                phone:phone,
                detail:detail,
                province:selectedProvince,
                city:selectedCity,
                district:selectedDistrict,
                zipcode:zipcodes,
            }

            const response = await axios.post(backendUrl + '/api/user/add-address', {address},{headers:{token}})
            if(response.data.success){
                toast.success(response.data.message)
                setName('')
                setPhone('')
                setDetail('')
                setSelectedProvince('');
                setSelectedCity('');
                setSelectedDistrict('');
                setSelectedZipcode('');
                setAmphures([]);
                setDistricts([]);
                setZipcodes([]);
                getUserAddress();
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(response.error.message)
        }
    }

    const getUserAddress = async () => {
        try {
            if(!token){
                return null;
            }
            const response = await axios.post(backendUrl + '/api/user/get-address',{},{headers:{token}})
            if(response.data.success){
                setUserAddress(response.data.userAddress);
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
    
    const [editIndex, setEditIndex] = useState(null);
    const [nameEdit, setNameEdit] = useState('');
    const [phoneEdit, setPhoneEdit] = useState('');
    const [detailEdit, setDetailEdit] = useState('');
    const [selectedProvinceEdit, setSelectedProvinceEdit] = useState('');
    const [selectedCityEdit, setSelectedCityEdit] = useState('');
    const [selectedDistrictEdit, setSelectedDistrictEdit] = useState('');
    const [selectedZipcodeEdit, setSelectedZipcodeEdit] = useState('');
    const [amphuresEdit, setAmphuresEdit] = useState([]);
    const [districtsEdit, setDistrictsEdit] = useState([]);
    const [zipcodesEdit, setZipcodesEdit] = useState('');

    const editAddress = (index) => {
        if (editIndex === index) {
            setEditIndex(null);
        } else {
            setEditIndex(index);
            setNameEdit(userAddress[index].name);
            setPhoneEdit(userAddress[index].phone);
            setDetailEdit(userAddress[index].detail);
            setSelectedProvinceEdit(userAddress[index].province);
            setSelectedCityEdit(userAddress[index].city);
            setSelectedDistrictEdit(userAddress[index].district);
            setZipcodesEdit(userAddress[index].zipcode);

            const selectedProvinceDataEdit = thaiDatas.find((province) => province.name_en === userAddress[index].province);
            setAmphuresEdit(selectedProvinceDataEdit ? selectedProvinceDataEdit.amphure : []);

            const selectedCityDataEdit = amphuresEdit.find((amphure) => amphure.name_en === userAddress[index].city);
            setDistrictsEdit(selectedCityDataEdit ? selectedCityDataEdit.tambon : []);
        }
    };


    const selectProvinceEdit = (event, newValue) => {
        setSelectedProvinceEdit(newValue);
        setSelectedCityEdit('');
        setSelectedDistrictEdit('');
        setSelectedZipcodeEdit('');
        setAmphuresEdit([]);
        setDistrictsEdit([]);
        setZipcodesEdit([]);

        const selectedProvinceDataEdit = thaiDatas.find((province) => province.name_en === newValue);
        setAmphuresEdit(selectedProvinceDataEdit ? selectedProvinceDataEdit.amphure : []);
    };

    const selectCityEdit = (event, newValue) => {
        setSelectedCityEdit(newValue);
        setSelectedDistrictEdit('');
        setSelectedZipcodeEdit('');
        setDistrictsEdit([]);
        setZipcodesEdit([]);

        const selectedCityDataEdit = amphuresEdit.find((amphure) => amphure.name_en === newValue);
        setDistrictsEdit(selectedCityDataEdit ? selectedCityDataEdit.tambon : []);
    };

    const selectDistrictEdit = (event, newValue) => {
        setSelectedDistrictEdit(newValue);
        setSelectedZipcodeEdit('');
        setZipcodesEdit([]);

        const selectedDistrictDataEdit = districtsEdit.find((district) => district.name_en === newValue);
        setZipcodesEdit(selectedDistrictDataEdit.zip_code);
    };
    
    const saveEditAddress = async (addressId,status) => {
        const address = {
            name: nameEdit,
            phone: phoneEdit,
            detail: detailEdit,
            province: selectedProvinceEdit,
            city: selectedCityEdit,
            district: selectedDistrictEdit,
            zipcode: zipcodesEdit,
            status: status
        };
    
        try {
            const response = await axios.post(backendUrl + '/api/user/edit-address', { address, addressId }, { headers: { token } });
            if (response.data.success) {
                toast.success("Edit Address Successfully");
                setEditIndex(null);
                setUserAddress(response.data.userAddress);
                // getUserAddress();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the address.");
            console.error(error);
        }
    };    

    useEffect(()=>{
        getThaiData();
        getUserAddress();
    },[token])

    return (
        <div className='flex flex-col sm:flex-row gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            <div className='flex flex-col w-full sm:w-1/2'>
                <div className='text-xl sm:text-2xl my-3'>
                    < Title text1={'DELEVERY'} text2={'INFORMATION'} />
                </div>
                <div className={`transition-all duration-400 overflow-hidden w-full max-h-[1000px] opacity-100`}>
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
                            <textarea onChange={(e)=>setDetail(e.target.value)} value={detail} className='input-f w-full max-w-[500px] px-3 py-2' type="text" />
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
                        <div className='flex justify-center'>
                            <button onClick={()=>saveUserAddress()} className='w-[80%] hover:scale-105 transition ease-in-out rounded-[10px] text-[1rem] px-5 py-2 bg-blue-500 text-white mb-3 mt-5'>
                                <FontAwesomeIcon icon={faAddressCard} className='text-[1rem] mr-2' />
                                Add address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col w-full sm:w-1/2 mt-5 lg:mt-10 lg:pt-10'>
            {
                userAddress.map((item, index) => (
                    <div key={index} className={`overflow-hidden w-full max-h-[1000px] opacity-100 fluke`}>
                        {editIndex === index ? (
                            <div className={`address-detail flex-1 border border-gray-400 rounded-lg p-5 mx-2 mb-3 bg-white`}>
                                <p className="flex items-center gap-2 font-medium text-gray-900">
                                    <FontAwesomeIcon icon={faPenToSquare} className="text-[25px] text-yellow-400 ml-2" />
                                    Edit Address
                                    <span className="ml-auto">
                                        <button
                                            onClick={() => editAddress(index)}
                                            className="hover:scale-110 transition ease-in-out bg-red-500 text-white rounded-full text-[1rem] px-2 py-0.5"
                                        >
                                            <FontAwesomeIcon icon={faXmarkCircle} className="text-[1rem]" /> Cancel
                                        </button>
                                    </span>
                                </p>
                                <div className="flex flex-col gap-1 w-full mt-3 sm:max-w-[480px]">
                                    <div className="flex gap-3">
                                        <div className="w-full">
                                            <p>Name</p>
                                            <input
                                                onChange={(e) => setNameEdit(e.target.value)}
                                                name="firstName"
                                                value={nameEdit}
                                                type="text"
                                                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <p>Phone</p>
                                            <input
                                                onChange={(e) => setPhoneEdit(e.target.value)}
                                                name="phone"
                                                value={phoneEdit}
                                                type="text"
                                                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <p>Detail</p>
                                        <textarea
                                            onChange={(e) => setDetailEdit(e.target.value)}
                                            value={detailEdit}
                                            className="input-f w-full max-w-[500px] px-3 py-2"
                                            type="text"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-full">
                                            <p>Province</p>
                                            <Autocomplete
                                                value={selectedProvinceEdit}
                                                onChange={selectProvinceEdit}
                                                // value={selectedProvinceEdit}
                                                // onChange={(event, newValue) => setSelectedProvinceEdit(newValue)}
                                                disablePortal
                                                options={thaiDatas.map((thaiData) => thaiData.name_en)}
                                                renderInput={(params) => <TextField {...params} size="small" />}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <p>City</p>
                                            <Autocomplete
                                                value={selectedCityEdit}
                                                onChange={selectCityEdit}
                                                // value={selectedCityEdit}
                                                // onChange={(event, newValue) => setSelectedCityEdit(newValue)}
                                                disablePortal
                                                options={amphuresEdit.map((amphure) => amphure.name_en)}
                                                renderInput={(params) => <TextField {...params} size="small" />}
                                                disabled={!selectedProvinceEdit}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-full">
                                            <p>District</p>
                                            <Autocomplete
                                                value={selectedDistrictEdit}
                                                onChange={selectDistrictEdit}
                                                // value={selectedDistrictEdit}
                                                // onChange={(event, newValue) => setSelectedDistrictEdit(newValue)}
                                                disablePortal
                                                options={districtsEdit.map((district) => district.name_en)}
                                                renderInput={(params) => <TextField {...params} size="small" />}
                                                disabled={!selectedCityEdit}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <p>Zipcode</p>
                                            <input
                                                value={zipcodesEdit}
                                                onChange={(e) => setZipcodesEdit(e.target.value)}
                                                name="zipcode"
                                                type="number"
                                                className={`border border-gray-400 rounded py-1.5 px-3.5 w-full ${!selectedDistrictEdit ? 'bg-gray-100' : ''}`}
                                                disabled={!selectedDistrictEdit}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => saveEditAddress(item._id,item.status)}
                                            className="w-[80%] hover:scale-105 transition ease-in-out text-white rounded-[10px] text-gray text-[1rem] px-5 py-2 bg-green-500 mb-3 mt-5"
                                        >
                                            <FontAwesomeIcon icon={faAddressCard} className="text-[1rem] mr-2" />
                                            Save Edit Address
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`address-detail flex-1 border border-gray-400 rounded-lg p-5 mx-2 mb-3 ${item.status ? 'bg-white' : 'bg-gray-200'}`}>
                                <div>
                                    <p className="flex items-center gap-2 font-medium text-gray-900">
                                        <FontAwesomeIcon icon={faLocationDot} className="text-[25px] text-blue-400 ml-2" />
                                        {item.name}
                                        <span className="ml-auto">
                                            <button
                                                onClick={() => editAddress(index)}
                                                className="hover:scale-110 transition ease-in-out border rounded-full text-[1rem] px-2 py-0.5"
                                            >
                                                <FontAwesomeIcon icon={faHouseChimneyUser} className="text-[1rem]" /> Edit
                                            </button>
                                        </span>
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
                                        Select to set Default Address
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default Address
