import React, { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle,faArrowLeft,faXmark,faChevronRight,faXmarkCircle,faPlus,faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import upload_area from '../assets/upload_area.png';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify'

const ProductList = ({shopId,isShop}) => {

    const {search,showSearch,backendUrl,token,searchData,setSearchData} = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts,setFilterProducts] = useState([]);
    const [category,setCategory] = useState([]);
    // const [subCategory,setSubCategory] = useState([]);
    const [sortType,setSortType] = useState('relevent');
    const [isAddProduct,setIsAddProduct] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [products,setProducts] = useState([]);
    const [latestProducts,setLatestProducts] = useState([]);
    const [bestsellerProducts,setBestsellerProducts] = useState([]);
    const [allProducts,setAllProducts] = useState([]);
    const [type,setType] = useState('Default');
    const [categoriesShop,setCategoriesShop] = useState([]);
    const [checkShop,setCheckShop] = useState(false);

    const getProductShop = async () => {
        let query = search;
        let shop = shopId;
        try {
            const response = await axios.post(backendUrl + '/api/product/search-product',{query,shop})
            if(response.data.success){
                setProducts(response.data.datas.allProducts)
                setAllProducts(response.data.datas.allProducts)
                setLatestProducts(response.data.datas.latestProducts.reverse())
                setBestsellerProducts(response.data.datas.bestsellerProducts)
                setCategoriesShop(response.data.datas.categories)
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
    }, [category,search,showSearch,products])

    useEffect(() => {
        selectType();
    }, [type])

    useEffect(() => {
        sortProduct();
    }, [sortType])

    useEffect(() => {
        getProductShop();
    }, [searchData])

    ////////////////////////////////////////////////////////

    const [name,setName] = useState('');
    const [description,setDescription] = useState('');
    const [price,setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [categories,setCategories] = useState([]);
    const [categoryInput,setCategoryInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleInputChange = (event, newInputValue) => {
        if(newInputValue != ''){
            setCategoryInput(newInputValue);
        }
    };

    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
    };

    // const onImageChange = (e, index) => {
    //     const files = [...images];
    //     files[index] = e.target.files[0];
    //     setImages(files);
    //   };
    
    const addImageInput = async (file) => {
        if(file){
            setImages([...images, await convertToBase64(file)]);
        }
    };

    const removeImageInput = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    useEffect(()=>{
        if(images.length > 0){

        }
    },[images])

    const fetchAllCategory = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/category/get',{},{headers:{token}})
            if(response.data.success){
                setCategories(response.data.categories)
            }else{
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const addNewCategory = () => {
        if (!categories.some(category => category.name === categoryInput) && categoryInput !== '') {
            const newCategory = { name: categoryInput };
        
            setCategories(prevCategories => {
                const updatedCategories = [...prevCategories, newCategory];
                setSelectedCategory(newCategory.name);
                return updatedCategories;
            });
        
            setCategoryInput('');
        }
    };

    const [isOpenOption1, setIsOpenOption1] = useState(true);
    const [option1, setOption1] = useState([]);
    const [option1Input, setOption1Input] = useState('');
    const [isOpenOption2, setIsOpenOption2] = useState(true);
    const [option2, setOption2] = useState([]);
    const [option2Input, setOption2Input] = useState('');

    const addOption1 = async (value) => {
        if (!option1.some(option => option.option === value) && value !== '') {
            await setOption1([...option1, {
                option: value,
                image: '',
                price: 0,
                active: false,
                amount: 0,
                option2: option2
            }]);
            setOption1Input('');
        }
    };

    const addImageOption = async( index, file) => {
        if(file){
            const updatedOptions = [...option1];
            updatedOptions[index].image = await convertToBase64(file);
            setOption1(updatedOptions);
        }
    };

    // useEffect(()=>{
    //     // console.log(option1)
    // },[option1])
    
    const removeOption1 = (index) => {
        setOption1(option1.filter((_, i) => i !== index));
    };

    const addOption2 = async (value) => {
        if(!option2.some(option => option.option === value) && value !== ''){
            const newOption2 = {
                option: value,
                price: 0,
                amount: 0,
                active: false,
            };

            await setOption2(prevOption2 => {
                const newOption2Array = [...prevOption2, newOption2];
                
                const updatedOption1 = option1.map((option) => ({
                    ...option,
                    option2: newOption2Array
                }));

                setOption1(updatedOption1);
                return newOption2Array;
            });

            setOption2Input('');
        }
    };

    const removeOption2 = (index) => {
        const updatedOption2 = option2.filter((_, i) => i !== index);
    
        const updatedOption1 = option1.map((option) => ({
            ...option,
            option2: updatedOption2, 
        }));
    
        setOption1(updatedOption1);
        setOption2(updatedOption2);
    };

    const inputOptionDetail = async (e, index, index2, field) => {
        if (field === 'active') {
            await setTimeout(() => {
                setOption1((prevOptions) => {
                    const updatedOptions = prevOptions.map((option, i) => {
                        if (i === index) {
                            if (index2 !== '') {
                                const updatedOption2 = option.option2.map((opt2, j) => {
                                    if (j === index2) {
                                        return { ...opt2, [field]: !opt2[field] };
                                    }
                                    return opt2;
                                });
                                return { ...option, option2: updatedOption2 };
                            } else {
                                return { ...option, [field]: !option[field] };
                            }
                        }
                        return option;
                    });
                    return updatedOptions;
                });
            }, 300);
        }else{
            await setOption1((prevOptions) => {
                const updatedOptions = prevOptions.map((option, i) => {
                    if (i === index) {
                        if (index2 !== '') {
                            const updatedOption2 = option.option2.map((opt2, j) => {
                                if (j === index2) {
                                    return { ...opt2, [field]: e.target.value };
                                }
                                return opt2;
                            });
                            return { ...option, option2: updatedOption2 };
                        } else {
                            return { ...option, [field]: e.target.value };
                        }
                    }
                    return option;
                });
                return updatedOptions;
            });
        }
    };

    useEffect(() => {
        applyFilter();
        fetchAllCategory();
    }, [category,search,showSearch,products])

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 50,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
            transform: 'translateX(24px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                backgroundColor: '#2ECA45',
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
            duration: 500,
            }),
            ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
            }),
        },
    }));

    // const [switchStates, setSwitchStates] = useState({});

    const [editingProductId,setEditingProductId] = useState('');

    const addProductConfirm = async () => {
        setOpenBackdrop(true);
        try {

            const productToSend = {
                name: name,
                description: description,
                category: selectedCategory,
                images: images,
                price: price,
                options: option1,
                productId: editingProductId
            };
    
            const response = await axios.post(backendUrl + '/api/product/add-new-product', productToSend, {
                headers: { 'Content-Type': 'application/json', token:token }
            });
    
            // console.log(response);
            
            if(response.data.success){
                toast.success(response.data.message)
                setName('')
                setIsAddProduct('')
                setEditingProductId('')
                setDescription('')
                setSelectedCategory('')
                setImages([])
                setPrice(0)
                setOption1([])
                setOption2([])
                getProductShop()
            }else{
                toast.error(response.data.message)
            }
            setOpenBackdrop(false);
        } catch (error) {
            console.log(error)
            toast.error(error.message)
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

    const editProduct = async (id) => {

        const productEditing = filterProducts.find(product => product._id === id);

        if (productEditing) {
            setEditingProductId(id)
            setIsAddProduct('addproduct');
            setName(productEditing.name || '')
            setDescription(productEditing.description || '');
            setSelectedCategory(productEditing.category || '');
            setImages(productEditing.images || []);
            setPrice(productEditing.price || 0);
            setOption1(productEditing.options)
            productEditing.options.forEach((item,index)=>{
                setOption2(item.option2)
            })
            // setOption1(productEditing.option1 || []);
            // setOption2(productEditing.option2 || []);
        } else {
            console.log('Product not found');
        }

    }

    useEffect(()=>{
        if(token){
            getProductShop();
        }
    },[token])
    

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            { /* filter */}
            <div className='min-w-60'>
                <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
                    <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
                </p>
                {/* catagory filter  */}
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
                            categoriesShop.map((item,index)=>(
                                <p key={index} className='flex gap-2'>
                                    <input className='w-3' type="checkbox" value={item.name} onChange={toggleCategory} checked={category.includes(item.name)} /> {item.name}
                                </p>
                            ))
                        }
                    </div>
                </div>
                {
                    isShop ?
                        (
                            <button onClick={()=>setIsAddProduct('addproduct')} className='w-full hover:scale-110 transition ease-in-out rounded-[10px] text-[1rem] px-5 py-2 bg-[#2ecc71] text-white mb-3'>
                                <FontAwesomeIcon icon={faPlusCircle} className='text-[1rem] mr-2' />
                                Add Product
                            </button>
                        )
                    : null
                }

            </div>

            { /* right side */}
            {
                isAddProduct === 'addproduct'
                ? (
                    <div>
                        <p className='hover:scale-105 transition ease-in-out my-2 text-xl flex items-center cursor-pointer gap-2 mb-3' onClick={()=>{setIsAddProduct(''),setEditingProductId('')}}>
                            <FontAwesomeIcon icon={faArrowLeft} className='text-[15px]' />
                            BACK
                        </p>
                        <div className='w-[90%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                            <form className='flex flex-col w-full items-start gap-3'>
                                <div className='w-full'>
                                <p>Product name</p>
                                <input onChange={(e)=>setName(e.target.value)} value={name} className='w-[100%] input-f h-[56px] max-w-[500px] px-3 py-2' type="text" placeholder='type here' required/>
                                </div>
                                <div className='w-full'>
                                <p>Description</p>
                                <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='input-f w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write detail here' required/>
                                </div>
                                <p className='mb-2'>Upload Image</p>
                                <div className='flex gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mb-2'>
                                    {images.map((image, index) => (
                                        <div key={index} className='h-[100px] w-[100px] items-center relative mb-4'>
                                            <img src={image} className='bg-primary h-full w-full object-cover' alt="" />
                                            <div>
                                                <p onClick={() => removeImageInput(index)} className='hover:scale-110 transition ease-in-out cursor-pointer absolute right-[-7px] bottom-[-7px] w-7 h-7 text-center leading-4 bg-[#e74c3c] text-white rounded-full text-[8px] flex items-center justify-center'>
                                                    <FontAwesomeIcon icon={faXmark} className='text-[20px]' />
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <label htmlFor="imageInput">
                                        <img className='hover:scale-105 transition ease-in-out cursor-pointer h-[100px] w-[100px]' src={upload_area} alt="" />
                                        <input onChange={(e)=>addImageInput(e.target.files[0])} type="file" id="imageInput" hidden/>
                                    </label>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                                    <div>
                                        <p className=''>Product category</p>
                                        <Autocomplete
                                            value={selectedCategory}
                                            disablePortal
                                            onInputChange={handleInputChange} 
                                            onChange={handleCategoryChange} 
                                            options={categories ? categories.map(category => category.name) : []} 
                                            sx={{ width: 350 }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </div>
                                    <div>
                                        <p className=''>Add new category</p>
                                        <button type='button' onClick={addNewCategory} className='rounded-[10px] h-[56px] px-5 py-2 bg-[#2ecc71] text-white'>
                                            <FontAwesomeIcon icon={faPlusCircle} className='text-[1rem] mr-2' />
                                            Add category
                                        </button>
                                    </div>
                                </div>

                                <div onClick={()=>setIsOpenOption1(!isOpenOption1)} className='cursor-pointer'>
                                    <p className='my-2 text-xl flex items-center gap-2'>
                                        OPTIONS 1
                                        <FontAwesomeIcon icon={faChevronRight} className={`h-3 transform transition-transform duration-300 ml-1 ${isOpenOption1 ? 'rotate-90' : ''}`} />
                                    </p>
                                </div>
                                <div className={`transition-all duration-400 overflow-hidden w-full ${isOpenOption1 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p>Option</p>
                                    <div className='flex gap-2 w-full sm:gap-2 mb-2'>
                                        <input onChange={(e)=>setOption1Input(e.target.value)} value={option1Input} className='input-f px-3 py-2 w-[80%]' type="text" placeholder='Add option' required/>
                                        <button type='button' onClick={()=>addOption1(option1Input)} className='rounded-[10px] h-[56px] px-5 py-2 bg-[#2ecc71] text-white'>
                                            <FontAwesomeIcon icon={faPlusCircle} className='text-[1rem]' />
                                        </button>
                                    </div>
                                    <div>
                                    <p className='mb-2'>Option List 1</p>
                                        <div className='flex gap-3'>
                                            {option1.map((option, index) => (
                                                <div key={index} className='items-center relative mb-2'>
                                                    <div className='h-[100px] w-[100px] items-center relative'>
                                                        <label htmlFor={`image${index}`}>
                                                            <img src={option.image !== '' ? option.image : upload_area} className='cursor-pointer bg-primary h-full w-full object-cover' alt="" />
                                                            <input onChange={(e) => addImageOption(index, e.target.files[0])} type="file" id={`image${index}`} hidden/>
                                                        </label>
                                                    </div>
                                                    <div className={`px-3 py-1 bg-slate-200 text-center`}>
                                                        {option.option}
                                                        <span onClick={() => removeOption1(index)} className='hover:scale-110 transition ease-in-out cursor-pointer absolute right-[-7px] bottom-[-7px] w-5 h-5 text-center leading-4 bg-[#e74c3c] text-white rounded-full text-[8px] flex items-center justify-center'>
                                                            <FontAwesomeIcon icon={faXmark} className='text-[15px]' />
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div onClick={()=>setIsOpenOption2(!isOpenOption2)} className='cursor-pointer'>
                                    <p className='my-2 text-xl flex items-center gap-2'>
                                        OPTIONS 2
                                        <FontAwesomeIcon icon={faChevronRight} className={`h-3 transform transition-transform duration-300 ml-1 ${isOpenOption2 ? 'rotate-90' : ''}`} />
                                    </p>
                                </div>
                                <div className={`transition-all duration-400 overflow-hidden w-full ${isOpenOption2 ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p>Option</p>
                                    <div className='flex gap-2 w-full sm:gap-2 mb-2'>
                                        <input onChange={(e)=>setOption2Input(e.target.value)} value={option2Input} className='input-f px-3 py-2 w-[80%]' type="text" placeholder='Add option' required/>
                                        <button type='button' onClick={()=>addOption2(option2Input)} className='text-cener rounded-[10px] h-[56px] px-5 py-2 bg-[#2ecc71] text-white'>
                                            <FontAwesomeIcon icon={faPlusCircle} className='text-[1rem]' />
                                        </button>
                                    </div>
                                    <div>
                                        <p className='mb-2'>Option List 2</p>
                                        <div className='flex gap-3'>
                                            {option2.map((option22, index) => (
                                                <div key={index} className='mb-2 items-center relative'>
                                                    <div className={`px-3 py-1 bg-slate-200 text-center`}>
                                                        {option22.option}
                                                        <span onClick={() => removeOption2(index)} className='hover:scale-110 transition ease-in-out cursor-pointer absolute right-[-7px] bottom-[-7px] w-5 h-5 text-center leading-4 bg-[#e74c3c] text-white rounded-full text-[8px] flex items-center justify-center'>
                                                            <FontAwesomeIcon icon={faXmark} className='text-[15px]' />
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {option1.map((option, index) => (
                                    option.option2.length > 0 ? (
                                        option.option2.map((option22, index2) => (
                                            <div key={`option1-${index}-option2-${index2}`} className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                                                <div className='w-full'>
                                                    <p className='mb-2'>Option {(index * option2.length) + (index2 + 1)}</p>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='items-center relative'>
                                                            <button type='button' className='rounded-[5px] px-5 py-2 bg-slate-200'>
                                                                {option.option}
                                                            </button>
                                                        </div>
                                                        <p className='cursor-pointer w-7 h-7 text-center leading-4 bg-[#006bd6] text-white rounded-full text-[8px] flex items-center justify-center'>
                                                            <FontAwesomeIcon icon={faPlus} className='text-[20px]' />
                                                        </p>
                                                        <div className='items-center relative'>
                                                            <button type='button' className='rounded-[5px] px-5 py-2 bg-slate-200'>
                                                                {option22.option}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className='mb-2'>Price</p>
                                                    <input onChange={(e) => inputOptionDetail(e, index, index2, 'price')} value={option22.price} className='input-f w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='0' />
                                                </div>
                                                <div>
                                                    <p className='mb-2'>Amount</p>
                                                    <input onChange={(e) => inputOptionDetail(e, index, index2, 'amount')} value={option22.amount} className='input-f w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='0' />
                                                </div>
                                                <div>
                                                    <p className='mb-2'>Active</p>
                                                    {
                                                        option22.active ? (
                                                            <FormControlLabel

                                                                control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                                                                onClick={(e) => inputOptionDetail(e, index, index2, 'active')}
                                                            />
                                                        ) : (
                                                            <FormControlLabel
                                                                control={<IOSSwitch sx={{ m: 1 }} />}
                                                                onClick={(e) => inputOptionDetail(e, index, index2, 'active')}
                                                            />
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div key={`option1-${index}`} className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                                            <div className='w-full'>
                                                <p className='mb-2'>Option {(index + 1)}</p>
                                                <div className='flex items-center gap-2'>
                                                    <div className='items-center relative'>
                                                        <button type='button' className='rounded-[5px] px-5 py-2 bg-slate-200'>
                                                            {option.option}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className='mb-2'>Price</p>
                                                <input onChange={(e) => inputOptionDetail(e, index, '', 'price')} value={option.price} className='input-f w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='0' />
                                            </div>
                                            <div>
                                                <p className='mb-2'>Amount</p>
                                                <input onChange={(e) => inputOptionDetail(e, index, '', 'amount')} value={option.amount} className='input-f w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='0' />
                                            </div>
                                            <div>
                                                <p className='mb-2'>Active</p>
                                                {
                                                    option.active ? (
                                                        <FormControlLabel

                                                            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                                                            onClick={(e) => inputOptionDetail(e, index, '', 'active')}
                                                        />
                                                    ) : (
                                                        <FormControlLabel
                                                            control={<IOSSwitch sx={{ m: 1 }} />}
                                                            onClick={(e) => inputOptionDetail(e, index, '', 'active')}
                                                        />
                                                    )
                                                }

                                            </div>
                                        </div>
                                    )
                                ))}

                                {
                                    option1.length === 0 && option2.length === 0
                                    ?  
                                    (
                                        <div className='w-full'>
                                            <p>Price</p>
                                            <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-[100%] input-f h-[56px] max-w-[500px] px-3 py-2' type="Number" placeholder='type here' required/>
                                        </div>
                                    )
                                    : null
                                }
                                

                                <button type='button' onClick={()=>addProductConfirm()} className='mt-5 hover:scale-110 transition ease-in-out rounded-[5px] h-[56px] px-5 py-2 bg-[#0080FF] text-white'>
                                    ADD PRODUCT
                                    <FontAwesomeIcon icon={faShoppingBag} className='text-[1rem] ml-2' />
                                </button>
                            </form>
                        </div>
                    </div>
                )
                : isAddProduct === 'addoption' ? (
                    <div>
                        <p className='hover:scale-105 transition ease-in-out my-2 text-xl flex items-center cursor-pointer gap-2 mb-3' onClick={()=>setIsAddProduct('addproduct')}>
                            <FontAwesomeIcon icon={faArrowLeft} className='text-[15px]' />
                            BACK
                        </p>
                        <div className='w-[90%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                            <form className='flex flex-col w-full items-start gap-3'>
                            </form>
                        </div>
                    </div>
                )
                : (
                    <div>
                        <div className='flex-1'>
                            <div className='flex justify-between text-base sm:text-2xl mb-4'>
                                <Title text1={'ALL'} text2={'COLLECTIONS'} />
                                { /* product sort */ }
                                <select onChange={(e)=>setSortType(e.target.value)} className='border border-gray-300 text-sm px-2'>
                                    <option value="relevent">Sort by: Relevent</option>
                                    <option value="low-high">Sort by: Low to High</option>
                                    <option value="high-low">Sort by: High to Low</option>
                                </select>
                            </div>

                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6'>
                                {
                                    filterProducts.map((item,index)=>(
                                        < ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} option={item.options} isShop={isShop} editProduct={editProduct} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )

            }

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

export default ProductList
