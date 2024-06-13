import React, { createContext, useEffect, useState, useCallback } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    console.log("ShopContextProvider: ", props);

    const [allProduct, setAllProduct] = useState([]);

    // fectch all comments
    const [allComments, setAllComments] = useState([]);

    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState();

    // Fetch products based on category or all products
    const fetchProducts = useCallback(async () => {
        try {
            let response;
            if (props.category) {
                response = await fetch(`http://localhost:4000/product/category/${props.category}`);
            } else {
                response = await fetch('http://localhost:4000/product/allproducts');
            }
            const data = await response.json();
            setAllProduct(data);
            console.log("All Products fetched");
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [props.category]);

    // fetch comments
    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:4000/comment/allcomments');
            const data = await response.json();
            // console.log("data: ",data);
            setAllComments(data);
            console.log("All Comments fetched");
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }, []);

    // Fetch cart items for the user
    const fetchCart = useCallback(async () => {
        if (localStorage.getItem('auth-token')) {
            try {
                const userStr = localStorage.getItem('user');
                const user = JSON.parse(userStr);
                const userId = user.Id;

                console.log("User ID: ", userId);

                const response = await fetch('http://localhost:4000/cart/getcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId })
                });

                const data = await response.json();
                console.log("Products In Cart: ", data);

                // Initialize cartItems with productId and quantity
                const cartItems = {};
                data.forEach(product => {
                    cartItems[product.productId] = product.quantity;
                });

                // Update state with the cartItems
                setCartItems(cartItems);
                console.log("Cart items: ", cartItems);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchComments();
    }, [fetchProducts, fetchComments]);

    useEffect(() => {
        fetchCart();
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, [fetchCart]);

    const addToCart = async (itemId) => {
        console.log("add to cart: ", itemId);
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (localStorage.getItem('auth-token')) {
            try {
                await fetch('http://localhost:4000/cart/addtocart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: itemId }),
                });

                console.log("added successfully!");
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const newCartItems = { ...prev };
            if (newCartItems[itemId] > 1) {
                newCartItems[itemId]--;
            } else {
                delete newCartItems[itemId];
            }
            return newCartItems;
        });
        if (localStorage.getItem('auth-token')) {
            try {
                await fetch('http://localhost:4000/cart/removefromcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: itemId }),
                });
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        }
    }

    const getTotalCartItems = () => {
        console.log('---------------> testing :')
        let totalItem = 0;
        for (const item in cartItems) {
            console.log('item:', item, cartItems[item])
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = allProduct.find((product) => product.id === Number(itemId));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[itemId];
                } else {
                    console.error(`Product with id ${itemId} not found in allProduct array`);
                }
            }
        }
        return totalAmount;
    };



    const contextValue = { getTotalCartItems, getTotalCartAmount, addToCart, removeFromCart, allProduct, allComments, cartItems, user };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
