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
        return data;
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
        return data.token;
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
};

// Sample comments based on ratings
const sampleComments = {
    1: [
        "Sản phẩm quá tệ, hoàn toàn không giống mô tả.",
        "Chất lượng kém, rất thất vọng.",
        "Hàng bị hỏng, không thể sử dụng được."
    ],
    2: [
        "Không hài lòng với sản phẩm, chất lượng thấp.",
        "Giao hàng chậm, sản phẩm không đúng như mong đợi.",
        "Màu sắc và chất liệu không như quảng cáo."
    ],
    3: [
        "Sản phẩm tạm ổn, nhưng không nổi bật.",
        "Chất lượng trung bình, không có gì đặc biệt.",
        "Giá cả chấp nhận được, nhưng cần cải thiện chất lượng."
    ],
    4: [
        "Sản phẩm tốt, đúng như mô tả.",
        "Rất hài lòng, chất lượng khá ổn.",
        "Giao hàng nhanh, sản phẩm chất lượng tốt."
    ],
    5: [
        "Sản phẩm tuyệt vời, rất hài lòng!",
        "Chất lượng xuất sắc, đáng đồng tiền.",
        "Dịch vụ tốt, sản phẩm rất đẹp và chất lượng."
    ]
};

// Get a random comment based on the rating
const getRandomComment = (rating) => {
    const comments = sampleComments[rating];
    return comments[Math.floor(Math.random() * comments.length)];
};

// Create a comment
const createComment = async (user, product) => {
    try {
        const rating = getRandomInt(1, 5); // Random rating between 1 and 5
        const content = getRandomComment(rating);
        const response = await fetch('http://localhost:4000/comment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${user.authToken}`,
            },
            body: JSON.stringify({
                product_id: product.id,
                rating,
                created_by: { id: user.Id, full_name: user.fullName },
                content,
                images: [] // Add image paths if needed
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create comment');
        }

        const data = await response.json();
        console.log('Comment created successfully:', data.comment);
    } catch (error) {
        console.error('Error creating comment:', error);
    }
};

// Simulate creating comments for a subset of users and products
const simulateComments = async (userPercentage, productPercentage) => {
    try {
        const users = await fetchUserData();
        const products = await fetchProductData();

        if (users.length === 0 || products.length === 0) {
            throw new Error('Users or products data is empty');
        }

        const selectedUsers = users.slice(0, Math.ceil(users.length * userPercentage));
        const selectedProducts = products.slice(0, Math.ceil(products.length * productPercentage));

        for (const user of selectedUsers) {
            user.authToken = await loginUser(user);

            if (user.authToken) {
                for (const product of selectedProducts) {
                    await createComment(user, product);
                }
            } else {
                console.error(`Skipping user ${user.email} due to login failure.`);
            }
        }
    } catch (error) {
        console.error('Error fetching data or simulating comments:', error);
    }
};

// Example: Simulate comments for 50% of users and 50% of products
simulateComments(0.8, 0.8);
