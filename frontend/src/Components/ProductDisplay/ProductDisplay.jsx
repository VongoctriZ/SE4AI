import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';
import { FaStar } from 'react-icons/fa';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

const roundRating = (rating) => {
    return Math.round(rating * 100) / 100;
};

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart } = useContext(ShopContext);
    const [mainImage, setMainImage] = useState(product.images[0].large_url);

    const roundedRating = roundRating(product.rating);



    return (
        <div className="product-display">
            <div className="product-display-left">
                <div className="product-display-img-bar">
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
                    {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                            key={i}
                            color={i < roundedRating ? '#ffc107' : '#e4e5e9'}
                        />
                    ))}
                    <p>({product.review_counts})</p>

                </div>

                <div className="product-display-right-prices">

                    <div className="product-display-right-price-new">{formatPrice(product.new_price)}</div>

                    {product.old_price !== product.new_price && (
                        <div className="product-display-right-price-old">{formatPrice(product.old_price)}</div>
                    )}

                    <div className="product-display-sold">
                        <p>Sold: {product.all_time_quantity_sold}</p>
                    </div>
                </div>



                <button onClick={() => { addToCart(product.id) }}>ADD TO CART</button>
                <p className="product-display-right-category">
                    <span>Category :</span> {product.category.join(', ')}
                </p>
            </div>
        </div>
    );
}

export default ProductDisplay;
