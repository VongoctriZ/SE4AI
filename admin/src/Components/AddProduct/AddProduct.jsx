import { useState } from 'react';
import './AddProduct.css';
import insertPicture from '../../assets/insertPicture.png';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        category: "",
        new_price: "",
        old_price: "",
        thumbnail_url: "",
    });

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        setLoading(true);
        try {
            let responseData;

            if (image) {
                const formData = new FormData();
                formData.append('product', image);

                const uploadResponse = await fetch('http://localhost:4000/upload', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: formData,
                });
                responseData = await uploadResponse.json();

                if (responseData.success) {
                    productDetails.thumbnail_url = responseData.image_url;
                }
            }

            const productResponse = await fetch('http://localhost:4000/product/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productDetails),
            });
            const productData = await productResponse.json();

            if (productData.success) {
                alert("Product Added Successfully");
                window.location.href = '/addproduct';
            } else {
                alert("Product Addition Failed!!!");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while adding the product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="add-product">
                <div className="addproduct-itemfield">
                    <p>Product Name</p>
                    <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Description</p>
                    <input value={productDetails.description} onChange={changeHandler} type="text" name='description' placeholder='Type here' />
                </div>

                <div className="addproduct-price">
                    <div className="addproduct-itemfield">
                        <p>New Price</p>
                        <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                    </div>
                    <div className="addproduct-itemfield">
                        <p>Old Price</p>
                        <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                    </div>
                </div>

                <div className="addproduct-itemfield">
                    <p>Product Category</p>
                    <select value={productDetails.category} onChange={changeHandler} name='category' className='add-product-selector'>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kids">Kids</option>
                    </select>
                </div>

                <div className="addproduct-itemfield">
                    <p>Insert Image</p>
                    <label htmlFor="file-input" className="addproduct-thumbnail-label">
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="addproduct-thumbnail-img"
                            />
                        ) : (
                            <img
                                src={insertPicture}
                                alt="Insert Placeholder"
                                className="addproduct-placeholder-img"
                            />
                        )}
                    </label>
                    <input
                        onChange={imageHandler}
                        type="file"
                        name="image"
                        id="file-input"
                        hidden
                    />
                </div>

                <button onClick={Add_Product} className="addproduct-btn" disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>
        </div>
    );
};

export default AddProduct;