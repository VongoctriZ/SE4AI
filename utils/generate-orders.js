const fetch = require('node-fetch');

// Fetch user data
const fetchUserData = async () => {
    try {
        const response = await fetch('http://localhost:4000/user/allusers');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
};

// Fetch product data
const fetchProductData = async () => {
    try {
        const response = await fetch('http://localhost:4000/product/allproducts');
        const data = await response.json();
        return data; // Assuming the products are within a `products` property
    } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
    }
};

// Get a random element from an array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Get a random integer between min and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Log in a user and get the auth token
const loginUser = async (user) => {
    try {
        const response = await fetch('http://localhost:4000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email, password: user.password }),
        });

        if (!response.ok) {
            throw new Error('Failed to log in');
        }

        const data = await response.json();
        return data.token; // Assuming the token is in the `token` field
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
};

// Simulate adding items to the cart for a user
const addToCart = async (user, itemId, quantity) => {
    try {
        const response = await fetch('http://localhost:4000/cart/addtocart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': `${user.authToken}`, // Use user's auth token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, quantity }),
        });

        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }

        console.log("Item added to cart:", itemId);
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

const removeAllFromCart = async (user) => {
    // console.log("Remove all!!!");

    try {

        await fetch('http://localhost:4000/cart/removeallfromcart', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': `${user.authToken}`, // Use user's auth token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.Id }),
        });

    } catch (error) {
        console.error("Error removing all items from cart:", error);
    }
};

// Simulate creating an order for a user
const createOrder = async (user, cartItems, totalMoney) => {
    try {
        const response = await fetch('http://localhost:4000/order/create', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'auth-token': `${user.authToken}`, // Use user's auth token
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.Id, products: cartItems, total_money: totalMoney }),
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        const orderData = await response.json();
        console.log('Order created successfully:', orderData);

        try {
            const emptyCart = await removeAllFromCart(user);
            console.log("Empty Cart success!!!");
        } catch (error) {
            console.error("Failed to empty cart", error);
        }




    } catch (error) {
        console.error('Error creating order:', error);
    }
};

// Simulate adding items to the cart and creating an order for a user
const simulateOrder = async (user, products) => {
    try {
        const numberOfProducts = getRandomInt(1, 5); // Random number of products per order
        const cartItems = [];

        for (let i = 0; i < numberOfProducts; i++) {
            const product = getRandomElement(products);
            const quantity = getRandomInt(1, 10); // Random quantity for each product
            cartItems.push({ productId: product.id, quantity, price: product.new_price });

            // Add to cart
            await addToCart(user, product.id, quantity);
        }

        // Calculate total money
        const totalMoney = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Create order
        await createOrder(user, cartItems, totalMoney);

    } catch (error) {
        console.error('Error during order simulation:', error);
    }
};

// Fetch data and simulate orders for a subset of users and products based on percentage
const simulateOrdersWithPercentage = async (userPercentage, productPercentage) => {
    try {
        const users = await fetchUserData();
        const products = await fetchProductData();

        if (users.length === 0 || products.length === 0) {
            throw new Error('Users or products data is empty');
        }

        while (true) {
            const selectedUsers = users.slice(0, Math.ceil(users.length * (userPercentage / 100)));
            const selectedProducts = products.slice(0, Math.ceil(products.length * (productPercentage / 100)));

            const user = getRandomElement(selectedUsers);
            user.authToken = await loginUser(user); // Log in the user to get the auth token

            if (user.authToken) {
                await simulateOrder(user, selectedProducts);
            } else {
                console.error(`Skipping user ${user.email} due to login failure.`);
            }
        }
    } catch (error) {
        console.error('Error fetching data or simulating orders:', error);
    }
};

// Example: Simulate orders using 50% of users and 30% of products
simulateOrdersWithPercentage(70, 90);
