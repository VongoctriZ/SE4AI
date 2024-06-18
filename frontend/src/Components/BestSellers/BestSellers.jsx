import React, { useEffect, useState } from 'react';
import './BestSellers.css';
import Item from '../Item/Item';

const BestSellers = () => {
    const [bestSellerProducts, setBestSellerProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/product/best-sellers')
            .then((response) => response.json())
            .then((data) => {
                setBestSellerProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="best-sellers">
            <h1>BEST SELLERS</h1>
            <hr />
            <div className="best-sellers-item">
                {bestSellerProducts.map((item, i) => (
                    <Item key={i} id={item.id} name={item.name} image={item.thumbnail_url} new_price={item.new_price} old_price={item.old_price} />
                ))}
            </div>
        </div>
    );
}

export default BestSellers;
