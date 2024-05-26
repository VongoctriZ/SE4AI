// src/Profile.js
import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/Profile.css';

const Profile = () => {

    const { user } = useContext(ShopContext)

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber:'',
        

    });

    useEffect(() => {
        console.log(user)

        if (user) {
            setFormData({
                fullName: user.fullName,
                email: user.email,
                password: ''
            })
        }
    }, [user])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);

        let responseData;
        // You can add form submission logic here
        await fetch('http://localhost:4000/user/update', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailAddress: formData.emailAddress,
                fullName: formData.fullName,
                password: formData.password
            }),
        }).then((response) => response.json()).then((data) => responseData = data);

        if (responseData.user) {
            console.log(responseData.user)
            localStorage.setItem('user', JSON.stringify(responseData.user));
            alert("Change success");
        }
    };

    return (
        <div className="profile-container">
            <h1>Update Profile</h1>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}

                    />
                </div>
                <button type="submit" className="submit-button">Update Profile</button>
            </form>
        </div>
    );
}

export default Profile;