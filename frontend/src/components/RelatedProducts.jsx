import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem';
import Title from './Title';

const RelatedProducts = ({category}) => {

    const {products} = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(() => {
        if(products.length > 0){
            let productCopy = products.slice();
            productCopy = productCopy.filter((item) => category === item.category);
        
            setRelated(productCopy.slice(0,5));
        }
    }, [products])

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-4 mg:grid-cols-6 lg:grid-cols-6 gap-4 gap-y-6'>
                {related.map((item,index)=>(
                    < ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.images} option={item.options} />
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts
