import { useState } from 'react';
import './AddUser.css';

const AddProduct = () => {
    const [productDetails, setProductDetails] = useState({
        name: "",
        address: "",
        category: "",
        phonenumber: "",
        email: "",
        password: "",
    });

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        await fetch('http://localhost:4000/product/addproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productDetails),
        })
            .then((resp) => resp.json())
            .then((data) => {
                data.success ? alert("Product Added") : alert("Failed");
            });
    };

    return (
        <div className="container">
            <div className="add-product">
                <div className="addproduct-itemfield">
                    <p>Full Name</p>
                    <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Address</p>
                    <input value={productDetails.address} onChange={changeHandler} type="text" name='address' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Email</p>
                    <input value={productDetails.email} onChange={changeHandler} type="text" name='email' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Password</p>
                    <input value={productDetails.password} onChange={changeHandler} type="text" name='pass-word' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Phone Number</p>
                    <input value={productDetails.phonenumber} onChange={changeHandler} type="text" name='phone_number' placeholder='Type here' />
                </div>


                <button onClick={() => { Add_Product() }} className="addproduct-btn">Add</button>
            </div>
        </div>
    );
};

export default AddProduct;
