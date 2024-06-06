import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
    const { getTotalCartAmount, allProduct, cartItems, removeFromCart } = useContext(ShopContext);

    console.log("All Products: ", allProduct);
    console.log("Cart Items: ", cartItems);

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
            {allProduct.map((e) => {
                if (cartItems[e.id] > 0) {

                    console.log(e.id);
                    
                    return (
                        <div key={e.id}>
                            <div className="cart-items-format cart-items-format-main">
                                <img src={e.thumbnail_url} alt="" className='cart-icon-product-icon' />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className='cart-items-quantity'>{cartItems[e.id]}</button>
                                <p>${e.new_price * cartItems[e.id]}</p>
                                <img src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cart-items-down">
                <div className="cart-items-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cart-items-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-items-total-item">
                            <p>Shipping Fee</p>
                            <p>Fee</p>
                        </div>
                        <hr />
                        <div className="cart-items-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button>PROCEED TO CHECKOUT</button>
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