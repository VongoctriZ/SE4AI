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

    const Add_User = async () => {
        await fetch('http://localhost:4000/user/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    // Hiển thị form thông báo thành công
                    alert("User Added Successfully");

                    // Chuyển hướng về trang home
                    window.location.href = '/adduser';
                } else {
                    alert("User Addition Failed!!!");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("An error occurred while adding the user.");
            });
    };

    return (
        <div className="container">

            <div className="add-product">
                <div className="addproduct-itemfield">
                    <p>Full Name</p>
                    <input value={userDetails.fullName} onChange={changeHandler} type="text" name='fullName' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Address</p>
                    <input value={userDetails.address} onChange={changeHandler} type="text" name='address' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Email</p>
                    <input value={userDetails.email} onChange={changeHandler} type="text" name='email' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Password</p>
                    <input value={userDetails.password} onChange={changeHandler} type="text" name='password' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Confirm Password</p>
                    <input value={userDetails.confirmPassword} onChange={changeHandler} type="password" name='confirmPassword' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Phone Number</p>
                    <input value={userDetails.phoneNumber} onChange={changeHandler} type="text" name='phoneNumber' placeholder='Type here' />
                </div>

                <button onClick={() => { Add_User() }} className="addproduct-btn">Add</button>
            </div>
        </div>
    );
};

export default AddUser;
