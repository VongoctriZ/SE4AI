const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');


// Function to download an image from a URL and save it to a specified path
async function downloadImage(url, filepath, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const writer = fs.createWriteStream(filepath);
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream',
                timeout: 10000 // Adding a timeout for the request
            });

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Error downloading image from ${url} (Attempt ${attempt} of ${retries}):`, error.message);

            // If the last attempt fails, throw the error
            if (attempt === retries) {
                throw error;
            }
        }
    }
}

// Function to process each file and download images from comments
async function processCommentsImages(filepath, outputDir) {

    console.log("execute comments files");

    let data;

    try {
        data = require(filepath); // Use require to import the JS file
    } catch (error) {
        console.error(`Error reading file ${filepath}:`, error);
        return;
    }

    if (!Array.isArray(data)) {
        console.error(`Data in file ${filepath} is not an array`);
        return;
    }

    let category;


    if (filepath.includes('tre_em')) {
        category = 'kids';
    } else if (filepath.includes('nam_nguoi_lon')) {
        category = 'men';
    } else if (filepath.includes('nu_nguoi_lon')) {
        category = 'women';
    }

    // console.log(category);

    for (const item of data) {

        const { id, images } = item;
        const itemDir = path.join(outputDir, category, String(id));
        await fs.ensureDir(itemDir);

        for (const image of images) {

            // console.log(Object.keys(image));

            const imageUrl = image.full_path;
            const imageFileName = `${image.id}.jpg`;  // Using image id for the file name
            const imageFilePath = path.join(itemDir, imageFileName);

            await downloadImage(imageUrl, imageFilePath);
            console.log(`Downloaded ${imageFileName} to ${itemDir}`);
        }

    }
}

// Function to process each file and download images from products
async function processProductsImages(filepath, outputDir) {

    let data;

    try {
        data = require(filepath); // Use require to import the JS file
    } catch (error) {
        console.error(`Error reading file ${filepath}:`, error);
        return;
    }

    if (!Array.isArray(data)) {
        console.error(`Data in file ${filepath} is not an array`);
        return;
    }

    let category;


    if (filepath.includes('tre_em')) {
        category = 'kids';
    } else if (filepath.includes('nam_nguoi_lon')) {
        category = 'men';
    } else if (filepath.includes('nu_nguoi_lon')) {
        category = 'women';
    }

    // console.log(category);

    for (const item of data) {
        const { id, images } = item;
        const itemDir = path.join(outputDir, category, String(id));
        await fs.ensureDir(itemDir);

        let img_id = 0;
        for (const image of images) {
            img_id += 1;
            // console.log(Object.keys(image));


            const imageUrls = {
                base: image.base_url,
                large: image.large_url,
                medium: image.medium_url,
                small: image.small_url,
                thumbnail: image.thumbnail_url
            };

            for (const [key, url] of Object.entries(imageUrls)) {
                if (url) {
                    const imageFileName = String(img_id) + `_${key}.jpg`;
                    const imageFilePath = path.join(itemDir, imageFileName);

                    await downloadImage(url, imageFilePath);
                    console.log(`Downloaded ${imageFileName} to ${itemDir}`);
                }
            }
        }
    }
}

// Main function to process all files in the directory
async function processDirectory(directoryPath, outputDir) {
    // Check if the directoryPath is a directory and ends with "comments"
    const stats = await fs.stat(directoryPath);

    if (!stats.isDirectory()) {
        console.error(`${directoryPath} is not a valid directory`);
        return;
    }

    let kind = directoryPath.endsWith('comments') ? 'comments' : 'products';
    // console.log(kind);


    const files = await fs.readdir(directoryPath);
    // console.log(files);

    for (const file of files) {
        // console.log(file);

        const filePath = path.join(directoryPath, file);
        const fileStats = await fs.stat(filePath);

        if (fileStats.isFile() && path.extname(file) === '.js') {

            if (kind == 'comments') {
                await processCommentsImages(filePath, outputDir);
            } else {
                await processProductsImages(filePath, outputDir);
            }
        }

        console.log("Done");
    }
}

// Usage example
const directoryPath = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/data/comments';
const outputDir = directoryPath + '/images';

processDirectory(directoryPath, outputDir)
    .then(() => console.log('All images downloaded successfully'))
    .catch(err => console.error('Error downloading images:', err));