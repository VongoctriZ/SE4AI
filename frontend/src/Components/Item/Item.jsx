import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

const Item = (props) => {
    // console.log("Item.props: ", props);

    return (
        <div className="item">
            <Link to={`/product/${props.id}`} className="item-link">
                <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt={props.name} className="item-image" />
                <p className="item-name">{props.name}</p>
                <div className="item-prices">
                    <div className="item-price-new">
                        {formatPrice(props.new_price)}
                    </div>
                    {props.new_price !== props.old_price && (<div className="item-price-old">
                        {formatPrice(props.old_price)}
                    </div>)}
                </div>
            </Link>
        </div>
    );
}

export default Item;
