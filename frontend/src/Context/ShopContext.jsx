import React, { createContext, useEffect, useState } from "react";
import all_product from '../Components/Assets/all_product';
import Item from "../Components/Item/Item";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }

    return cart;
}

const ShopContextProvider = (props) => {

    console.log("ShopContextProvider: ", props);

    const [all_product, setAll_Product] = useState([]);

    const [cartItems, setCartItems] = useState(getDefaultCart());

    const [user, setUser] = useState();

    useEffect(() => {
        // fetch('http://localhost:4000/product/allproducts')
        //     .then((response) => response.json())
        //     .then((data) => setAll_Product(data));

        // fetch by category

        if (props.category) {
            fetch(`http://localhost:4000/product/category/${props.category}`)
                .then((response) => response.json())
                .then((data) => setAll_Product(data))
                .catch((error) => console.error("Error fetching products:", error));
        }

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/cart/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data));

            const userData = JSON.parse(localStorage.getItem('user'));

            setUser(userData);
        }

    }, [])

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/cart/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/cart/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "itemId": itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart, user };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;

