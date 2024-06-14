import React, { useEffect, useState } from 'react'
import './BestSellers.css'
import Item from '../Item/Item'

const BestSellers = () => {

    const [bestSellerProducts, setTopSellerProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/product/best-sellers')
            .then((response) => response.json())
            .then((data) => setTopSellerProducts(data));
    }, [])

    return (
        <div className="best-sellers"> 
            <h1>BEST SELLERS</h1>
            <hr />
            <div className="best-sellers-item">
                {bestSellerProducts.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.thumbnail_url} new_price={item.new_price} old_price={item.old_price} />
                })}
            </div>
        </div>
    )
}

export default BestSellers;