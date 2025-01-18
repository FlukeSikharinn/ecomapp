import React from 'react'
import { assets } from '../assets/assets'
import hero_image from '../assets/hero.jpg';
import hero_image2 from '../assets/hero2.jpg';

const Hero = () => {
    const images = [hero_image, hero_image2];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400'>
            { /* ซ้าย */}
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                        <p className='font-medium text-sm md:text-base'>Practice Project</p>
                    </div>
                    <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Fluke Sikharin</h1>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold text-sm md:text-base'>E-Market</p>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                    </div>
                </div>
            </div>
            { /* ขวา */}
            <img src={randomImage} className='w-full sm:w-1/2' alt="" />
        </div>
    )
}

export default Hero
