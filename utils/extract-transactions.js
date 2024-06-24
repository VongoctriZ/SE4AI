const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

// Fetch all orders
const fetchAllOrders = async () => {
    try {
        const response = await fetch('http://localhost:4000/order/allorders');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return [];
    }
};

// Fetch all products
const fetchAllProducts = async () => {
    try {
        const response = await fetch('http://localhost:4000/product/allproducts');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all products:', error);
        return [];
    }
};

// Extract data and format as CSV
const formatOrdersToCSV = (orders, products) => {
    const csvData = [];

    const productRatings = {};
    products.forEach(product => {
        productRatings[product.id] = product.rating || 'N/A';
    });

    orders.forEach(order => {
        const userId = order.userId;
        const t_dat = order.createdAt;

        order.products.forEach(product => {
            const productId = product.productId;
            const rating = productRatings[productId] || 'N/A';
            csvData.push({
                t_dat,
                user_id: userId,
                product_id: productId,
                rating
            });
        });
    });

    const fields = ['t_dat', 'user_id', 'product_id', 'rating'];
    const opts = { fields };

    try {
        const csv = parse(csvData, opts);
        return csv;
    } catch (err) {
        console.error('Error converting to CSV:', err);
        return null;
    }
};

// Save CSV to file
const saveCSVToFile = (csv) => {
    const filePath = path.join(__dirname, 'transactions.csv');
    fs.writeFileSync(filePath, csv);
    console.log('CSV file saved at:', filePath);
};

// Main function to fetch orders, products, and save as CSV
const generateTransactionCSV = async () => {
    const [orders, products] = await Promise.all([fetchAllOrders(), fetchAllProducts()]);

    if (orders.length === 0 || products.length === 0) {
        console.log('No orders or products found.');
        return;
    }

    const csv = formatOrdersToCSV(orders, products);
    if (csv) {
        saveCSVToFile(csv);
    }
};

// Execute the main function
generateTransactionCSV();
