import React, { useEffect, useState } from 'react';
import './Recommendations.css';
import Item from '../Item/Item';

const Recommendations = () => {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/recommendations?user_id=1')  // Adjust the endpoint and user_id as needed
            .then((response) => response.json())
            .then((data) => {
                setRecommendedProducts(data);
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
        <div className="recommendations">
            <h1>RECOMMENDATIONS</h1>
            <hr />
            <div className="recommendations-item">
                {recommendedProducts.map((item, i) => (
                    <Item
                        key={i}
                        id={item.id}
                        name={item.name}
                        image={item.thumbnail_url}
                        new_price={item.new_price}
                        old_price={item.old_price}
                        rating={item.rating}
                        quantity_sold={item.all_time_quantity_sold}
                    />
                ))}
            </div>
        </div>
    );
}

export default Recommendations;
