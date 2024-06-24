const axios = require('axios');
const path = require('path');

// Function to create user accounts
async function createUserAccountsFromFile(usersFilePath, signupUrl) {
    let cnt = 0; // Move count here
    try {
        const usersData = require(usersFilePath);

        for (const user of usersData) {
            const { id, full_name, phoneNumber, email, password, address } = user;

            const userPayload = {
                Id: id,
                fullName: full_name,
                phoneNumber,
                email,
                password,
                confirmPassword: password, // Assuming confirmPassword is the same as password
                address
            };

            // console.log(userPayload);

            try {
                const response = await axios.post(signupUrl, userPayload);
                console.log(`Successfully created account for user ID ${id}:`, response.data);
                cnt += 1;
            } catch (error) {
                console.error(`Error creating account for user ID ${id}:`, error.response ? error.response.data : error.message);
            }
        }

        console.log(`Created ${cnt} accounts!!!`); // Log count here
    } catch (error) {
        console.error("Error reading users file:", error);
    }
}

const usersFilePath = 'C:/Users/HuyTP/OneDrive - VNU-HCMUS/Course_Materials/CSC10011_SE4AI/src/clothes/data/users.js'; // Replace with the path to your users.js file
const signupUrl = 'http://localhost:4000/user/signup';

createUserAccountsFromFile(usersFilePath, signupUrl);