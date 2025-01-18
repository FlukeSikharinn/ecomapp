import { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleRight,faCircleLeft } from '@fortawesome/free-solid-svg-icons';

function FeatureSlider() {
    const features = [
        { icon: assets.exchange_icon, title: 'Easy Exchange Policy', description: 'No hassle free exchange policy' },
        { icon: assets.quality_icon, title: '7 Days Return Policy', description: 'We provide 7 days free exchange' },
        { icon: assets.support_img, title: 'Best Customer Support', description: '24/7 customer support' },
        { icon: assets.exchange_icon, title: 'Secure Payment', description: 'Multiple secure payment options' },
        { icon: assets.quality_icon, title: 'Quality Assurance', description: 'High-quality products' },
        { icon: assets.support_img, title: 'Fast Delivery', description: 'Speedy delivery across locations' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3); // Default to 3 items per view (sm screen)
    const sliderRef = useRef(null);
    const startX = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(0);
    const isDragging = useRef(false);

    // Handle screen resizing
    useEffect(() => {
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
        <div
            className="relative overflow-hidden w-full max-w-full m-auto py-20"
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
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 text-center text-gray-700 px-2 ${
                            itemsPerView === 5 ? 'w-1/5' : 'w-1/3'
                        }`}
                    >
                        <div className="flex flex-col items-center">
                            <img src={feature.icon} className="w-12 mb-5" alt="" />
                            <p className="font-semibold">{feature.title}</p>
                            <p className="text-gray-400">{feature.description}</p>
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
    );
}

export default FeatureSlider;
