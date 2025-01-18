import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "฿";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products,setProducts] = useState([]);
    const [token,setToken] = useState('');
    const [searchData,setSearchData] = useState('');
    const navigate = useNavigate();

    const addToCart = async (productId,checkOption,userId,shopId) => {

        let cartData = structuredClone(cartItems);
        if(cartData[productId]) {
            cartData[productId].qty += 1;
        } else {
            cartData[productId] = {
                qty: 1,
                option: checkOption,
                userId: userId,
                shopId: shopId
            };
        }
        setCartItems(cartData);

        if(token){
            try {

                const response =  await axios.post(backendUrl + '/api/cart/add', { productId,checkOption } ,{headers:{token}})
                if(response.data.success){
                    toast.success(response.data.message)
                }else{
                    toast.error(response.data.message)
                }

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }else{
            toast.error("Plz Login")
            return
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        return Object.keys(cartItems).length;
    }

    const updateQuantity = async (productId,quantity) => {
        let cartData = structuredClone(cartItems);

        if(quantity == 0){
            delete cartData[productId];
        }else{
            cartData[productId].qty = quantity;
        }

        setCartItems(cartData);

        if(token){
            try {

                await axios.post(backendUrl + '/api/cart/update', {productId,quantity} ,{headers:{token}})
                
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductData = async () => {
        try {
            
            const response = await axios.get(backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
            }else{
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get',{},{ headers:{ token: token } });
            if(response.data.success){
                setCartItems(response.data.cartData)
                // console.log(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getProductData();
    },[])

    useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }   
    })

    const value = {
        products, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,addToCart,
        getCartCount,updateQuantity,
        getCartAmount,navigate,backendUrl,
        token,setToken,setCartItems,
        searchData,setSearchData
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;