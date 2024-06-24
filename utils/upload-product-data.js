const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

let cnt = 0;

const uploadProducts = async (directoryPath, apiUrl) => {
    try {
        // Read all files in the directory
        const files = await fs.readdir(directoryPath);
        
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const fileStats = await fs.stat(filePath);


            // Check if the current path is a file and has a .js extension
            if (fileStats.isFile() && path.extname(file) === '.js') {
                console.log(filePath);

                try {
                    // Import the JS file to get the array of products
                    const products = require(filePath);
                    
                    if (Array.isArray(products)) {
                        // console.log(products.length);
                        for (const product of products) {
                            
                            if(product.images === null){
                                console.log("Do not upload product has no image!!!");
                                return;
                            }
                            try {
                                // Make a POST request to upload the product
                                const response = await axios.post(apiUrl, product);
                                console.log(`Uploaded product with id ${product.id}:`);
                                cnt+=1;
                            } catch (uploadError) {
                                console.error(`Failed to upload product with id ${product.id}:`, uploadError);
                            }
                        }
                    } else {
                        console.error(`Data in file ${filePath} is not an array`);
                    }
                } catch (importError) {
                    console.error(`Failed to import file ${filePath}:`, importError);
                }
            }
        }

        console.log(`All ${cnt} products have been processed.`);
    } catch (error) {
        console.error('Error processing directory:', error);
    }
};

// Usage example
const directoryPath = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/new-data/products';
const apiUrl = 'http://localhost:4000/product/addproduct';

uploadProducts(directoryPath, apiUrl)
    .then(() => console.log(`All ${cnt} products uploaded successfully`))
    .catch(err => console.error('Error uploading products:', err));
