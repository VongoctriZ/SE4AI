import React, { createContext, useEffect, useState, useCallback } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [allProduct, setAllProduct] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [allOrders, setAllOrders] = useState([]);

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

    // Fetch search results based on query
    const fetchSearchResults = useCallback(async (query) => {
        try {
            console.log("query: ", query);
            const response = await fetch(`http://localhost:4000/product/search?q=${query}`);
            const data = await response.json();
            setSearchResults(data);
            console.log("Search Results fetched: ", data.length);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }, []);

    // Fetch comments
    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:4000/comment/allcomments');
            const data = await response.json();
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
                const newCartItems = {};
                data.forEach(product => {
                    newCartItems[product.productId] = product.quantity;
                });

                // Update state with the cartItems
                setCartItems(newCartItems);
                console.log("Cart items: ", newCartItems);

                // Update local storage
                localStorage.setItem('cartItems', JSON.stringify(newCartItems));
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
    }, []);

    // Fetch orders of current user
    const fetchOrders = useCallback(async () => {
        if (localStorage.getItem('auth-token')) {
            try {
                const userStr = localStorage.getItem('user');
                const user = JSON.parse(userStr);
                const userId = user.Id;

                console.log("User ID: ", userId);

                const response = await fetch(`http://localhost:4000/order/user/${userId}`, {
                    headers: {
                        'auth-token': `${localStorage.getItem('auth-token')}`
                    }
                });

                const data = await response.json();
                setAllOrders(data.orders);
                console.log("User Orders fetched: ", data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }
    }, []);

    useEffect(() => {
        // Fetch initial data
        fetchProducts();
        fetchComments();
    }, [fetchProducts, fetchComments]);

    useEffect(() => {
        // Fetch cart data and user data
        fetchCart();
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        console.log("user data: ", userData);
    }, [fetchCart]);

    useEffect(() => {
        // Fetch user orders
        fetchOrders();
    }, [fetchOrders]);

    const addToCart = async (itemId) => {
        console.log("add to cart: ", itemId);
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        // Update local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

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
    };

    const removeFromCart = async (itemId) => {
        // console.log("Remove here!!!");
        setCartItems((prev) => {
            const newCartItems = { ...prev };
            if (newCartItems[itemId] > 1) {
                newCartItems[itemId]--;
            } else {
                delete newCartItems[itemId];
            }
            return newCartItems;
        });

        // Update local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

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
    };

    const removeAllFromCart = async () => {
        // console.log("Remove all!!!");
        setCartItems({});

        // Update local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        if (localStorage.getItem('auth-token')) {
            try {
                const userStr = localStorage.getItem('user');
                const user = JSON.parse(userStr);
                const userId = Number(user.Id);

                await fetch('http://localhost:4000/cart/removeallfromcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userId }),
                });

            } catch (error) {
                console.error("Error removing all items from cart:", error);
            }
        }
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
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

    const createOrder = async () => {
        if (localStorage.getItem('auth-token')) {
            try {
                // Check if the cart is empty
                if (Object.keys(cartItems).length === 0) {
                    console.log("Cart is empty. Cannot create order.");
                    alert("Your cart is empty. Please add items to your cart before making an order.");
                    return 'empty';
                }

                const userStr = localStorage.getItem('user');
                const user = JSON.parse(userStr);
                const userId = Number(user.Id);

                const orderData = {
                    userId,
                    products: Object.keys(cartItems).map(productId => ({
                        productId: Number(productId),
                        quantity: cartItems[productId]
                    })),
                    total_money: getTotalCartAmount(),
                    status: "pending"
                };

                console.log("Order Data: ", orderData);

                const response = await fetch('http://localhost:4000/order/create', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                const data = await response.json();
                console.log("Order created successfully:", data);

                // Clear the cart after creating the order
                setCartItems({});
                localStorage.setItem('cartItems', JSON.stringify({}));
                console.log("Reset Cart Items to empty!!!");

                // Fetch the updated orders
                fetchOrders();

                // Remove all items from cart in the database
                removeAllFromCart();

                // Fetch the updated cart to ensure it's cleared
                fetchCart();
                
                return 'success';
            } catch (error) {
                console.error("Error creating order:", error);
                return 'failed';
            }
        }
    };

    const removeOrder = async (orderId) => {

    };

    const removeAllOrder = async () => {

    };

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        addToCart,
        removeFromCart,
        removeAllFromCart,
        allProduct,
        allComments,
        cartItems,
        user,
        searchResults,
        fetchSearchResults,
        fetchCart,
        allOrders,
        fetchOrders,
        createOrder
    };


    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
