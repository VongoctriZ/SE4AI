import React, { useContext, useEffect, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
};

const CartItems = () => {
    const {createOrder, fetchCart, getTotalCartAmount, allProduct, cartItems, removeFromCart } = useContext(ShopContext);
    const [orderCreated, setOrderCreated] = useState('');

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);


    const handleCheckout = async () => {
        try {
            const result = await createOrder();
            setOrderCreated(result);
        } catch (error) {
            console.error("Error creating order:", error);
            setOrderCreated('failed');
        }
    };

    useEffect(() => {
        if (orderCreated === 'success') {
            fetchCart(); // Ensure cart is updated after order creation
            console.log("Order created successfully!");
        } else if (orderCreated === 'failed') {
            console.log("Order creation failed. Please try again.");
        } else if (orderCreated === 'empty') {
            console.log("Your cart is empty. Please add items to your cart before making an order.");
        }
    }, [orderCreated, fetchCart]);


    return (
        <div className="cart-items">
            <div className="cart-items-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />

            <div className="cart-items-scroll">
                {
                    (orderCreated === 'empty' || orderCreated === 'success') ?
                        (
                            <p>Your cart is currently empty.</p>
                        ) : (
                            allProduct.map((e) => {
                                if (cartItems[e.id] > 0) {
                                    console.log(e.id);

                                    return (
                                        <div key={e.id}>
                                            <div className="cart-items-format cart-items-format-main">
                                                <img src={e.thumbnail_url} alt="" className='cart-icon-product-icon' />
                                                <p>{e.name}</p>
                                                <p>{formatPrice(e.new_price)}</p>
                                                <button className='cart-items-quantity'>{cartItems[e.id]}</button>
                                                <p>{formatPrice(e.new_price * cartItems[e.id])}</p>
                                                <img src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" className="cart-icon-remove-icon" />
                                            </div>
                                            <hr />
                                        </div>
                                    );
                                }
                                return null;
                            })
                        )}
            </div>

            <div className="cart-items-down">
                <div className="cart-items-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cart-items-total-item">
                            <p>Subtotal</p>
                            <p>{formatPrice(getTotalCartAmount())}</p>
                        </div>
                        <hr />
                        <div className="cart-items-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cart-items-total-item">
                            <h3>Total</h3>
                            <h3>{formatPrice(getTotalCartAmount())}</h3>
                        </div>
                    </div>
                    <button onClick={handleCheckout}>CHECKOUT</button>
                    {orderCreated === 'success' && <p>Order created successfully!</p>}
                    {orderCreated === 'failed' && <p>Order creation failed. Please try again.</p>}
                    {orderCreated === 'empty' && <p>Your cart is empty. Please add items to your cart before making an order.</p>}
                </div>
                <div className="cart-items-promocode">
                    <p>If you have a promo code, Enter it here</p>
                    <div className="cart-items-promobox">
                        <input type="text" placeholder='promo code' />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
