import { useState, useRef, useEffect, useContext } from 'react';
import { assets } from '../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleRight,faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import Title from './Title';
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

function FeatureSlider() {

    const { backendUrl,navigate } = useContext(ShopContext);
    const [shops,SetShops] = useState([]);

    const loadShops = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/user/get-shops',{},{})
            // console.log(response)
            if(response.data.success){
                SetShops(response.data.shops)
                // console.log(response.data.shops)
            }
        } catch (error) {
            
        }
    }

    const goToShop = async (shopId) => {
        navigate(`/shop/${shopId}`);
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3); // Default to 3 items per view (sm screen)
    const sliderRef = useRef(null);
    const startX = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
    const isDragging = useRef(false);

    // Handle screen resizing
    useEffect(() => {
        loadShops();
        const updateItemsPerView = () => {
            if (window.innerWidth >= 1024) { // `lg` breakpoint in Tailwind CSS
                setItemsPerView(5);
            } else {
                setItemsPerView(3);
            }
        };

        window.addEventListener('resize', updateItemsPerView);
        updateItemsPerView();

        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    // Drag functionality
    const startDrag = (e) => {
        isDragging.current = true;
        startX.current = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        sliderRef.current.style.transition = "none";
    };

    const onDrag = (e) => {
        if (!isDragging.current) return;
        const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        const deltaX = currentX - startX.current;
        currentTranslate.current = prevTranslate.current + deltaX;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
    };

    const endDrag = () => {
        isDragging.current = false;
        const movedBy = currentTranslate.current - prevTranslate.current;

        // Determine slide based on drag distance
        if (movedBy < -50 && currentIndex < features.length - itemsPerView) {
            setCurrentIndex((prev) => prev + 1);
        } else if (movedBy > 50 && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }

        // Reset translation with smooth transition
        sliderRef.current.style.transition = "transform 0.3s ease";
        prevTranslate.current = -currentIndex * (sliderRef.current.clientWidth / itemsPerView);
        sliderRef.current.style.transform = `translateX(${prevTranslate.current}px)`;
    };

    return (
        <div>
            <div className='text-center text-3xl pt-10'>
                <Title text1={'TOP'} text2={'SHOPS'}/>
                <p className='w-3/4 m-auto text-xs xm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </p>
            </div>
            <div
                className="relative overflow-hidden w-full max-w-full m-auto pt-10 pb-20"
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                onMouseMove={onDrag}
                onTouchMove={onDrag}
                onMouseUp={endDrag}
                onTouchEnd={endDrag}
                onMouseLeave={() => isDragging.current && endDrag()}
            >
                <div
                    ref={sliderRef}
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                >
                    {shops.map((shop, index) => (
                        <div
                            key={index}
                            className={`flex-shrink-0 text-center text-gray-700 px-2 ${
                                itemsPerView === 5 ? 'w-1/5' : 'w-1/3'
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <div onClick={()=>goToShop(shop._id)} className="w-[80px] mr-2 mb-2 cursor-pointer">
                                    <div className="relative pb-[100%] w-full">
                                        <img src={shop.shopImage} className="rounded-full absolute top-0 left-0 w-full h-full object-cover" />
                                    </div>
                                </div>
                                {/* <img src={shop.shopImage} className="w-12 mb-5" alt="" /> */}
                                <p onClick={()=>goToShop(shop._id)} className="font-semibold cursor-pointer">{shop.shopName}</p>
                                <Box sx={{ '& > legend': { mt: 2 } }}>
                                    <Rating
                                        name="simple-controlled"
                                        value={shop.shopRate}
                                        readOnly
                                    />
                                </Box>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-2xl font-bold"
                >
                    ‹
                </button>
                <button
                    onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, features.length - itemsPerView))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 text-2xl font-bold"
                >
                    ›
                </button>
            </div>
        </div>
    );
}

export default FeatureSlider;
