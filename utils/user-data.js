const fs = require('fs-extra');
const path = require('path');
const removeAccents = require('remove-accents');

// Function to preprocess full name
function preprocessFullName(name) {
    if (!name) return '';

    // Convert to English by removing accents
    let processedName = removeAccents(name);

    // Remove extra spaces and trim
    processedName = processedName.replace(/\s+/g, ' ').trim();

    return processedName;
}

// Function to generate additional user information
function generateUserInfo(created_by) {
    const userId = created_by.id;
    let userName = created_by.full_name;

    // Preprocess the full name
    userName = preprocessFullName(userName);

    // Ensure userName is defined
    const emailName = userName.split(' ').join('.').toLowerCase();
    
    return {
        id: userId,
        full_name: userName,
        email: `${emailName}@example.com`,
        address: `linh Trung`,
        password: `pass${userId}`,  // This is just a simple example. Use a more secure method in production.
        phoneNumber: `0${String(userId).padStart(9, '0')}`
    };
}   

// Function to process all files in the directory and generate users
async function generateUsersFromFiles(directoryPath, outputFilePath) {
    try {
        const files = await fs.readdir(directoryPath);
        const usersMap = new Map();
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            if (path.extname(file) === '.js') {
                const data = require(filePath);
                // console.log(filePath);
                data.forEach(item => {
                    const createdBy = item.created_by;
                    if (createdBy && createdBy.id && createdBy.full_name) {  // Ensure createdBy, createdBy.id, and createdBy.full_name are defined
                        if (!usersMap.has(createdBy.id)) {
                            const userInfo = generateUserInfo(createdBy);
                            usersMap.set(createdBy.id, userInfo);
                        }
                    }
                });
            }
        }

        const users = Array.from(usersMap.values());
        const usersJsContent = `const users = ${JSON.stringify(users, null, 2)};\n\nmodule.exports = users;`;

        await fs.writeFile(outputFilePath, usersJsContent);

        console.log(`Successfully generated users and saved to ${outputFilePath}`);
    } catch (error) {
        console.error("Error generating users:", error);
    }
}

// Usage example
const directoryPath = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/data/comments'; // Replace with the path to your directory containing JS files
const outputFilePath = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/data/users.js'; // Replace with the path to your output file

generateUsersFromFiles(directoryPath, outputFilePath);
