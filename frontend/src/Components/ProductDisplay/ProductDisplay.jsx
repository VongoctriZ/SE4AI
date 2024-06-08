import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);

    // Initialize the main image with the large_url of the first image
    const [mainImage, setMainImage] = useState(product.images[0].large_url);

    return (
        <div className="product-display">
            <div className="product-display-left">
                <div className="product-display-img-list">
                    {product.images.map((image, index) => (
                        <img
                            key={index}
                            src={image.base_url}
                            alt={`Product ${index}`}
                            onClick={() => setMainImage(image.large_url)}
                        />
                    ))}
                </div>
                <div className="product-display-img">
                    <img className="product-display-main-img" src={mainImage} alt="Main Product" />
                </div>
            </div>

            <div className="product-display-right">
                <h1>{product.name}</h1>
                <div className="product-display-right-star">
                    <img src={star_icon} alt="Star" />
                    <img src={star_icon} alt="Star" />
                    <img src={star_icon} alt="Star" />
                    <img src={star_icon} alt="Star" />
                    <img src={star_dull_icon} alt="Star Dull" />
                    <p>({product.review_counts})</p>
                </div>
                <div className="product-display-right-prices">
                    <div className="product-display-right-price-old">{formatPrice(product.old_price)}</div>
                    <div className="product-display-right-price-new">{formatPrice(product.new_price)}</div>
                </div>
                {/* <div className="product-display-right-description">
                    <p>{product.description}</p>
                </div> */}

                {/* <div className="product-display-right-size">
                    <h1>Select Size</h1>
                    <div className="product-display-right-sizes">
                        <div>S</div>
                        <div>M</div>
                        <div>L</div>
                        <div>XL</div>
                        <div>XXL</div>
                    </div>                
                </div>
                 */}

                <button onClick={() => { addToCart(product.id) }}>ADD TO CART</button>
                <p className="product-display-right-category">
                    <span>Category :</span> {product.category.join(', ')}
                </p>

                {/* <p className="product-display-right-category">
                    <span>Tags :</span>Modern, Latest
                </p>
             */}

            </div>
        </div>
    );
}

export default ProductDisplay;
