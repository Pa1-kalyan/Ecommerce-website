import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import '../../style/productList.css';

const ProductCard = ({ product }) => {
    const { cart, dispatch } = useCart();
    const cartItem = cart.find(item => item.id === product.id);

    const addToCart = (e) => {
        e.preventDefault(); // Prevent navigation if clicking button inside Link (though we should separate them)
        dispatch({ type: 'ADD_ITEM', payload: product });
    }

    const incrementItem = (e) => {
        e.preventDefault();
        dispatch({ type: 'INCREMENT_ITEM', payload: product });
    }

    const decrementItem = (e) => {
        e.preventDefault();
        if (cartItem && cartItem.quantity > 1) {
            dispatch({ type: 'DECREMENT_ITEM', payload: product });
        } else {
            dispatch({ type: 'REMOVE_ITEM', payload: product });
        }
    }

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                    {/* Use a placeholder if image fails or is missing */}
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('no-image') }}
                    />
                </div>
                <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                        <span className="product-price">₹{product.price.toFixed(2)}</span>
                    </div>
                </div>
            </Link>

            <div className="product-actions">
                {cartItem ? (
                    <div className="quantity-controls">
                        <button onClick={decrementItem} aria-label="Decrease quantity" className="qty-btn minus">-</button>
                        <span className="qty-value">{cartItem.quantity}</span>
                        <button onClick={incrementItem} aria-label="Increase quantity" className="qty-btn plus">+</button>
                    </div>
                ) : (
                    <button onClick={addToCart} className="btn-add-to-cart">
                        Add To Cart
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
