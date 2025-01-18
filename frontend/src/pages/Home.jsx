import React, { useContext, useEffect, useState } from 'react'
import BestSeller from '../components/BestSeller'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import NewsletterBox from '../components/NewsletterBox'
import OurPolicy from '../components/OurPolicy'
import Shops from '../components/Shops'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Home = () => {

    const { backendUrl, currency, token} = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);
    const [bestSellerProducts,setBestSellerProducts] = useState([]);

    const getProductShop = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/product/home-product',{})
            if(response.data.success){
                setLatestProducts(response.data.datas.latestProducts)
                setBestSellerProducts(response.data.datas.bestsellerProducts)
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
    },[])

    return (
        <div>
            <Hero />
            <Shops />
            <LatestCollection products={latestProducts} />
            <BestSeller products={bestSellerProducts} />
            <OurPolicy />
            <NewsletterBox />
        </div>
    )
}

export default Home
