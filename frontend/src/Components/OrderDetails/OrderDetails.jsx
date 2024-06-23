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
    const { fetchOrders, allOrders, allProduct } = useContext(ShopContext);
    const [loading, setLoading] = useState(true);
    const [sortCriteria, setSortCriteria] = useState('createdAt'); // Default sort by createdAt


    useEffect(() => {
        const fetchData = async () => {
            await fetchOrders();
            setLoading(false);
        };
        fetchData();
    }, [fetchOrders]);

    console.log("Render OrderDetails");

    // Handler for changing sort criteria
    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    // Sort orders based on criteria
    const sortedOrders = [...allOrders].sort((a, b) => {
        switch (sortCriteria) {
            case 'createdAt':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'total_money':
                return b.total_money - a.total_money;
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });


    return (
        <div className="order-details">
            <div className="order-details-header">
                <h1>My Orders</h1>
            </div>

            <div className="order-details-sort">
                <label htmlFor="sortCriteria">Sort by:</label>
                <select id="sortCriteria" onChange={handleSortChange} value={sortCriteria}>
                    <option value="createdAt">Date</option>
                    <option value="total_money">Total Price</option>
                    <option value="status">Status</option>
                </select>
            </div>

            {loading ? (
                <p>Loading orders...</p>
            ) : sortedOrders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="order-details-list">
                    {sortedOrders.map(order => (
                        <div key={order.id} className="order-details-item">
                            <div className="order-details-item-header">
                                <p>Order ID: {order.id}</p>
                                <p>{formatDate(order.createdAt)}</p>
                            </div>

                            <div className="order-details-item-products">
                                {order.products.map(product => {
                                    const productDetails = allProduct.find(p => p.id === product.productId);
                                    if (!productDetails) return null; // Handle if productDetails is null

                                    const totalPrice = product.quantity * productDetails.new_price;
                                    return (
                                        <div key={product.productId} className="order-details-product">
                                            <div className="order-details-product-thumbnail">
                                                {productDetails.thumbnail_url && (
                                                    <img src={productDetails.thumbnail_url} alt="Product Thumbnail" />
                                                )}
                                            </div>
                                            <div className="order-details-product-details">
                                                <div>
                                                    <p>Name: {productDetails.name}</p>
                                                    <p>Price: {formatPrice(productDetails.new_price)}</p>
                                                    <p>Quantity: {product.quantity}</p>
                                                    <p>Total Price: {formatPrice(totalPrice)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
