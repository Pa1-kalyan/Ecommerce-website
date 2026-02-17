import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";
import '../../style/cart.css'

const CartPage = () => {
    const { cart, dispatch } = useCart();
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const incrementItem = (product) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    }

    const decrementItem = (product) => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!ApiService.isAuthenticated()) {
            setMessage("You need to login first before you can place an order");
            setTimeout(() => {
                setMessage('')
                navigate("/login")
            }, 3000);
            return;
        }

        const orderItems = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const orderRequest = {
            totalPrice,
            items: orderItems,
        }

        try {
            const response = await ApiService.createOrder(orderRequest);
            setMessage(response.message)

            setTimeout(() => {
                setMessage('')
            }, 5000);

            if (response.status === 200) {
                dispatch({ type: 'CLEAR_CART' })
            }

        } catch (error) {
            setMessage(error.response?.data?.message || error.message || 'Failed to place an order');
            setTimeout(() => {
                setMessage('')
            }, 3000);
        }
    };

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>
            {message && <p className="response-message">{message}</p>}

            {cart.length === 0 ? (
                <div className="empty-cart-message">
                    <p>Your cart is empty.</p>
                    <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cart.map(item => (
                            <div className="cart-item" key={item.id}>
                                <img src={item.imageUrl} alt={item.name} className="cart-item-image" onError={(e) => { e.target.style.display = 'none' }} />
                                <div className="cart-item-details">
                                    <div>
                                        <h3 className="cart-item-title">{item.name}</h3>
                                        <p className="cart-item-desc">{item.description}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <span className="cart-item-price">${item.price.toFixed(2)}</span>
                                        <div className="cart-qty-controls">
                                            <button className="cart-qty-btn" onClick={() => decrementItem(item)}>-</button>
                                            <span className="cart-qty-value">{item.quantity}</span>
                                            <button className="cart-qty-btn" onClick={() => incrementItem(item)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>$0.00</span>
                        </div>
                        <div className="cart-total">
                            <h3>Total:</h3>
                            <h3>₹{totalPrice.toFixed(2)}</h3>
                        </div>
                        <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage;
