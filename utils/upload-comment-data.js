const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

let cnt = 0;

const uploadComments = async (directoryPath, apiUrl) => {
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
                    // Import the JS file to get the array of comments
                    const comments = require(filePath);
                    
                    if (Array.isArray(comments)) {
                        // let i = 0;
                        for (const comment of comments) {
                            // i += 1;
                            // if(i > 2){
                            //     return;
                            // }
                            try {
                                // Make a POST request to upload the comment
                                const response = await axios.post(apiUrl, comment);
                                // console.log("response")
                                console.log(`Uploaded comment with id ${comment.id}:`);
                                cnt+=1;
                            } catch (uploadError) {
                                console.error(`Failed to upload comment with id ${comment.id}:`);
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

        console.log(`All ${cnt} comments have been processed.`);
    } catch (error) {
        console.error('Error processing directory:', error);
    }
};

// Usage example
const directoryPath = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/new-data/comments';
const apiUrl = 'http://localhost:4000/comment/create';

uploadComments(directoryPath, apiUrl)
    .then(() => console.log(`All ${cnt} comments uploaded successfully`))
    .catch(err => console.error('Error uploading comments:', err));