import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight,faGear,faInfoCircle,faShop,faHouseChimneyUser,faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Collection = ({shopId}) => {

    const {search,showSearch,searchData,setSearchData} = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts,setFilterProducts] = useState([]);
    const [categories,setCategories] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory,setSubCategory] = useState([]);
    const [sortType,setSortType] = useState('relevent');
    const { backendUrl, currency, token} = useContext(ShopContext);
    const [products,setProducts] = useState([]);
    const [latestProducts,setLatestProducts] = useState([]);
    const [bestsellerProducts,setBestsellerProducts] = useState([]);
    const [allProducts,setAllProducts] = useState([]);
    const [type,setType] = useState('Default');

    const getProductShop = async () => {
        let query = search;
        try {
            const response = await axios.post(backendUrl + '/api/product/search-product',{query})
            // console.log(response)
            if(response.data.success){
                setProducts(response.data.datas.allProducts)
                setAllProducts(response.data.datas.allProducts)
                setLatestProducts(response.data.datas.latestProducts.reverse())
                setBestsellerProducts(response.data.datas.bestsellerProducts)
                setCategories(response.data.datas.categories)
            }else{
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getProductShop();
    },[token])
    
    const toggleCategory = (e) => {
        if(category.includes(e.target.value)){
            setCategory(prev=> prev.filter(item => item !== e.target.value))
        }else{
            setCategory(prev=> [...prev,e.target.value])
        }
    }

    // const toggleSubCategory = (e) => {
    //     if(subCategory.includes(e.target.value)){
    //         setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    //     }else{
    //         setSubCategory(prev=> [...prev,e.target.value])
    //     }
    // }

    const applyFilter = () => {
        let productsCopy = products.slice();
        // if(showSearch && search){
        //     productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        // }
        if(category.length > 0){
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }
        // if(subCategory.length > 0){
        //     productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        // }
        setFilterProducts(productsCopy);
    }

    const sortProduct = () => {

        let fpCopy = filterProducts.slice();
        fpCopy.forEach((item) => {
            if (item.options && item.options.length > 0) {
                const hasOption2 = item.options.some(opt => opt.option2 && opt.option2.length > 0);
        
                if (hasOption2) {
                    const allPrices = item.options.flatMap(opt => 
                        opt.option2
                            .filter(opt2 => opt2.active)
                            .map(opt2 => opt2.price)
                    );
        
                    if (allPrices.length > 0) {
                        item.lowPrice = Math.min(...allPrices);
                        item.highPrice = Math.max(...allPrices);
                    } else {
                        item.lowPrice = 0;
                        item.highPrice = 0;
                    }
                } else {
                    item.lowPrice = Math.min(...item.options.map(opt => opt.price));
                    item.highPrice = Math.max(...item.options.map(opt => opt.price));
                }
            } else {
                item.lowPrice = item.price;
                item.highPrice = item.price;
            }
        });

        switch (sortType){
            case 'low-high':
                setFilterProducts(fpCopy.sort((a,b)=>(a.lowPrice - b.lowPrice)));
                break;
            case 'high-low':
                setFilterProducts(fpCopy.sort((a,b)=>(b.highPrice - a.highPrice)));
                break;

            default:
                applyFilter();
                break;
        }
    }

    const selectType = async () => {
        if(type === 'Latest'){
            setProducts(latestProducts);
        }else if(type === 'Bestseller'){
            setProducts(bestsellerProducts);
        }else{
            setProducts(allProducts);
        }
        setCategory([])
        setSortType['relevent']
    }
    
    useEffect(() => {
        applyFilter();
    }, [category,subCategory,search,showSearch,products])

    useEffect(() => {
        selectType();
    }, [type])

    useEffect(() => {
        sortProduct();
    }, [sortType])

    useEffect(() => {
        getProductShop();
    }, [searchData])


    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            { /* filter */}
            <div className='min-w-60'>
                <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
                    <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
                </p>
                <div className={`border border-gray-300 px-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPE</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <button onClick={()=>setType('Default')} className={`w-full hover:scale-105 transition ease-in-out rounded-[8px] text-[1rem] px-5 py-2 ${ type == 'Default' ? 'bg-blue-500' : 'bg-gray-400 ' } text-white`}>
                                Default
                            </button>
                        </p>
                        <p className='flex gap-2'>
                            <button onClick={()=>setType('Latest')} className={`w-full hover:scale-105 transition ease-in-out rounded-[8px] text-[1rem] px-5 py-2 ${ type == 'Latest' ? 'bg-green-500' : 'bg-gray-400 ' } text-white`}>
                                Latest
                            </button>
                        </p>
                        <p className='flex gap-2'>
                            <button onClick={()=>setType('Bestseller')} className={`w-full hover:scale-105 transition ease-in-out rounded-[8px] text-[1rem] px-5 py-2 ${ type == 'Bestseller' ? 'bg-orange-500' : 'bg-gray-400 ' } text-white mb-2`}>
                                Bestseller
                            </button>
                        </p>
                    </div>
                </div>
                {/* catagory filter  */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 mb-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        {
                            categories.map((item,index)=>(
                                <p key={index} className='flex gap-2'>
                                    <input className='w-3' type="checkbox" value={item.name} onChange={toggleCategory} checked={category.includes(item.name)} /> {item.name}
                                </p>
                            ))
                        }
                    </div>
                </div>
                {/*sub  catagory filter  */}
            </div>

            { /* right side */}

            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'PRODUCTS'} text2={'LIST'} />
                    { /* product sort */ }
                    <select onChange={(e)=>{setSortType(e.target.value)}} className='border border-gray-300 text-sm px-2'>
                        <option value="relevent">Sort by: Relevent</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6'>
                    {
                        filterProducts.map((item,index)=>(
                            < ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} option={item.options} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Collection
