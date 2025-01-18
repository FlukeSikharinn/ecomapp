import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SearchBar = () => {

    const { search,setSearch,showSearch,setShowSearch,navigate,searchData,setSearchData } = useContext(ShopContext);
    const [visible,setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(location.pathname.includes('collection') || location.pathname.includes('')){
            setVisible(true);
        }else{
            setVisible(false);
        }
    }, [location])

    return showSearch && visible ? (
        <div className='border-t border-b bg-gray-50 text-center'>
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (location.pathname.includes('collection')) {
                                setSearchData(search);
                            } else {
                                navigate('/collection');
                            }
                        }
                    }} 
                    value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search' className='flex-1 outline-none bg-inherit text-sm' 
                />
                <p onClick={() => {navigate('/collection'), location.pathname.includes('collection') ? setSearchData(search) : ''}} className='hover:scale-110 transition ease-in-out cursor-pointer w-8 h-8 text-center bg-blue-500 text-white rounded-full text-[8px] flex items-center justify-center'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className='text-[15px]' />
                </p>
            </div>
            <img onClick={()=>{setShowSearch(false),setSearch('')}} src={assets.cross_icon} className='inline w-3 cursor-pointer' alt="" />
        </div>
    )  : null
}

export default SearchBar
