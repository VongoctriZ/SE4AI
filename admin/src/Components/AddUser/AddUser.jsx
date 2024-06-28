import { useState } from 'react';
import './AddUser.css';

const AddUser = () => {
    const [userDetails, setUserDetails] = useState({
        fullName: "",
        address: "",
        phoneNumber: "",
        email: "",
        confirmPassword: "",
        password: "",
    });

    const changeHandler = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const addUser = async () => {
        try {
            const response = await fetch('http://localhost:4000/user/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            });
            const data = await response.json();
            if (data.success) {
                alert("User Added Successfully");
                window.location.href = '/adduser';
            } else {
                alert("User Addition Failed!!!");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while adding the user.");
        }
    };

    return (
        <div className="container">
            <div className="add-product">
                {['fullName', 'address', 'email', 'password', 'confirmPassword', 'phoneNumber'].map((field) => (
                    <div className="addproduct-itemfield" key={field}>
                        <p>{field.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + field.replace(/([A-Z])/g, ' $1').slice(1)}</p>
                        <input
                            type={field === 'password' || field === 'confirmPassword' ? 'password' : 'text'}
                            name={field}
                            value={userDetails[field]}
                            onChange={changeHandler}
                            placeholder='Type here'
                        />
                    </div>
                ))}
                <button onClick={addUser} className="addproduct-btn">Add</button>
            </div>
        </div>
    );
};

export default AddUser;
