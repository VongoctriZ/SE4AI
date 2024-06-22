import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
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

const Item = (props) => {

    return (
        <div className="item">
            <Link to={`/product/${props.id}`} className="item-link">
                <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt={props.name} className="item-image" />
                <p className="item-name">{props.name}</p>
                <div className="rating-star">
                    {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                            key={i}
                            color={i < roundRating(props.rating) ? '#ffc107' : '#e4e5e9'}
                        />
                    ))}
                </div>
                <div className="item-prices">
                    <div className="item-price-new">
                        {formatPrice(props.new_price)}
                    </div>
                    {props.new_price !== props.old_price && (<div className="item-price-old">
                        {formatPrice(props.old_price)}
                    </div>)}
                </div>
                <div className="item-details">
                    <p className="item-rating">Rating: {props.rating}</p>
                    <p className="item-sold">Sold: {props.quantity_sold}</p>
                </div>
            </Link>
        </div>
    );
}

export default Item;
