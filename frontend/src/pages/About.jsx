import React from 'react'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import Title from '../components/Title'

const About = () => {
    return (
        <div>

            <div className='text-2xl text-center pt-8 border-t'>
                < Title text1={'ABOUT'} text2={'US'} />
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img src={assets.about_img} className='w-full md:max-w-[450px]' alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, enim repellendus magnam, quidem maxime harum facere sit, officiis itaque quam sequi! Provident dignissimos consequuntur eveniet rem, nesciunt labore fugit similique.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ipsam amet cum consectetur aut, ipsum voluptas veniam, harum laborum incidunt est error laudantium earum deserunt blanditiis maiores, expedita quas veritatis?</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, ad quisquam. Nostrum et voluptate ducimus veritatis doloribus veniam suscipit? Aut dolore nesciunt repudiandae neque cumque nulla sunt consequuntur sed perferendis.</p>
                </div>
            </div>
            <div className='text-4xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>
            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium magni nostrum, nobis soluta illo facilis? Et ipsum nam sequi ipsam voluptatem, aspernatur dolorem pariatur! Consequuntur deleniti sint pariatur quasi?</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium magni nostrum, nobis soluta illo facilis? Et ipsum nam sequi ipsam voluptatem, aspernatur dolorem pariatur! Consequuntur deleniti sint pariatur quasi?</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance:</b>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae accusantium magni nostrum, nobis soluta illo facilis? Et ipsum nam sequi ipsam voluptatem, aspernatur dolorem pariatur! Consequuntur deleniti sint pariatur quasi?</p>
                </div>
            </div>
            <NewsletterBox />
        </div>
    )
}

export default About
