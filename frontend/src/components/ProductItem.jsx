import React , {useContext} from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons';

const ProductItem = ({id,image,name,price,option,isShop,editProduct }) => {

    const {currency} = useContext(ShopContext)

    return (
        <div className='text-gray-700 cursor-pointer pb-10' to={`/product/${id}`}>
            <div className='overflow-hidden h-[100%] w-full items-center relative aspect-[4/3]'>
                {
                    isShop ?
                    (
                        <p onClick={(e) => {e.stopPropagation(), editProduct(id)}} className='hover:scale-110 transition ease-in-out cursor-pointer absolute right-[10px] bottom-[10px] w-8 h-8 text-center leading-4 bg-gray-500 text-white rounded-full text-[8px] flex items-center justify-center z-10'>
                            <FontAwesomeIcon icon={faGear} className='text-[15px]' />
                        </p>
                    ) : null
                }
                <Link to={`/product/${id}`}>
                    <img src={image[0]} className='rounded-[3px] hover:scale-110 transition ease-in-out h-full w-full object-cover' alt="" />
                </Link>

            </div>
            <Link to={`/product/${id}`}>
                <p className='pt-3 pb-1 text-sm'>{name}</p>
            </Link>
            {
                option.length > 0 
                ? 
                (
                    option.some(opt => opt.option2 && opt.option2.length > 0)
                    ? (
                        (() => {
                            // Flatten the prices from option2
                            const allPrices = option.flatMap(opt => 
                                opt.option2
                                    .filter(opt => opt.active)
                                    .map(opt => opt.price)
                            );

                            if (allPrices.length > 0) {
                                const highestPrice = Math.max(...allPrices);
                                const lowestPrice = Math.min(...allPrices);
                                if(lowestPrice == highestPrice){
                                    return `${currency} ${lowestPrice}`;
                                }else{
                                    return `${currency} ${lowestPrice} - ${highestPrice}`;
                                }
                            } else {
                                return `${currency} 0`;
                            }
                        })()
                    )
                    : (
                        <p className='text-sm font-medium'>
                            {
                                (() => {
                                    const activeOptions = option.filter(opt => opt.active);
                                    if (activeOptions.length > 0) {
                                        const lowestPrice = Math.min(...activeOptions.map(opt => opt.price));
                                        const highestPrice = Math.max(...activeOptions.map(opt => opt.price));
                                        if(lowestPrice == highestPrice){
                                            return `${currency} ${lowestPrice}`;
                                        }else{
                                            return `${currency} ${lowestPrice} - ${highestPrice}`;
                                        }
                                    } else {
                                        return `${currency} 0`;
                                    }
                                })()
                            }
                        </p>
                    )
                )
                : 
                (
                    <p className='text-sm font-medium'>{currency} {price}</p>
                )
            }
        </div>
    )
}

export default ProductItem
