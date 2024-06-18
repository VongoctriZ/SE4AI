import React, { useContext, useEffect, useState } from 'react';
import './OrderDetails.css';
import { ShopContext } from '../../Context/ShopContext';
import { format } from 'date-fns';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
};

const OrderDetails = () => {
    const { fetchOrders, allOrders } = useContext(ShopContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders().then(() => setLoading(false));
    }, [fetchOrders]);

    console.log("Render OrderDetails");

    return (
        <div className="order-details">
            <div className="order-details-header">
                <h1>My Orders</h1>
            </div>

            {loading ? (
                <p>Loading orders...</p>
            ) : allOrders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="order-details-list">
                    {allOrders.map(order => (
                        <div key={order.id} className="order-details-item">
                            <div className="order-details-item-header">
                                <p>Order ID: {order.id}</p>
                                <p>Date: {formatDate(order.createdAt)}</p>
                            </div>

                            <div className="order-details-item-products">
                                {order.products.map(product => (
                                    <div key={product.productId} className="order-details-product">
                                        <div className="order-details-product-details">
                                            <p>Product ID: {product.productId}</p>
                                            <p>Quantity: {product.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-details-item-total">
                                <h3>Order Total: {formatPrice(order.total_money)}</h3>
                                <p>Status: {order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderDetails;
