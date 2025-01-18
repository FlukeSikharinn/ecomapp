import React from 'react'
import { assets } from '../assets/assets'
import logo_real from '../assets/logo_real.png';

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={logo_real} className='mb-5 w-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus voluptatem maxime doloremque inventore praesentium sed sit laudantium reiciendis incidunt in ipsum sapiente delectus cum, earum aperiam minus, fugit molestias totam.
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+66 123-456-7895</li>
                        <li>testteste@hotmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2024@ FlukeSikharin.com All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
