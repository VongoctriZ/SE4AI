const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

// Fetch data from API
const fetchDataFromAPI = async (apiUrl) => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from API (${apiUrl}):`, error);
        return [];
    }
};

// Flatten nested objects, including arrays of objects
const flattenObject = (obj, parent = '', res = {}) => {
    for (let key in obj) {
        const propName = parent ? `${parent}_${key}` : key;

        if (Array.isArray(obj[key])) {
            if (typeof obj[key][0] === 'object') {
                obj[key].forEach((item, index) => {
                    flattenObject(item, `${propName}_${index + 1}`, res);
                });
            } else {
                res[propName] = obj[key].join(', '); // Join array of strings into a single string
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            flattenObject(obj[key], propName, res);
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
};

// Create CSV from flattened data
const createCSV = (data) => {
    if (!Array.isArray(data)) {
        console.log('Data is not an array, converting to array');
        data = [data];
    }

    if (data.length === 0) {
        console.log('No data available to create CSV.');
        return null;
    }

    const flattenedData = data.map(item => flattenObject(item));
    const fields = Object.keys(flattenedData[0]); // Extract attributes dynamically
    const opts = { fields };

    try {
        const csv = parse(flattenedData, opts);
        return csv;
    } catch (err) {
        console.error('Error converting to CSV:', err);
        return null;
    }
};

// Save CSV to file
const saveCSVToFile = (csv, fileName) => {
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, csv);
    console.log('CSV file saved at:', filePath);
};

// Main function to fetch data and create CSV
const generateCSVFromAPI = async (apiUrl, fileName) => {
    const data = await fetchDataFromAPI(apiUrl);
    const csv = createCSV(data);
    if (csv) {
        saveCSVToFile(csv, fileName);
    }
};

// Example usage
const apiUrl = 'http://localhost:4000/comment/allcomments'; // Replace with your API URL
const fileName = 'comments.csv'; // Output file name
generateCSVFromAPI(apiUrl, fileName);
