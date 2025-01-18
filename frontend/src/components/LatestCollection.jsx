import React, { useContext , useState ,useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';
import Title from './Title'

const LatestCollection = ({products}) => {

    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0,10));
    },[products])

    return (
        <div className='my-15'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'}/>
                <p className='w-3/4 m-auto text-xs xm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    latestProducts.map((item,index)=>(
                        < ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} option={item.options} />
                    ))
                }
            </div>
        </div>
    )
}

export default LatestCollection
