import React, { useEffect, useState } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

const NewCollections = () => {
    const [newCollections, setNewCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/product/newcollections')
            .then((response) => response.json())
            .then((data) => {
                setNewCollections(data);
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
        <div className="new-collections">
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collections">
                {newCollections.map((item, i) => (
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

export default NewCollections;
