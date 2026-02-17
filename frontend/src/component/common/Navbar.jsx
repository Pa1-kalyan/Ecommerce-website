import React, { useState } from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { cart } = useCart();

    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();

    // Calculate total items (sum of quantities)
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    }

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`);
        setIsMenuOpen(false); // Close menu on search
    }

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout? ");
        if (confirm) {
            ApiService.logout();
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
        setIsMenuOpen(false);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/" onClick={closeMenu}>
                    {/* Text-Based Logo for Cleaner Branding */}
                    <div className="navbar-logo-text">Pavan Kalyan Mart</div>
                </NavLink>
            </div>

            {/* SEARCH FORM - Hidden on mobile in this design iteration, or styled to fit */}
            <form className="navbar-search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    aria-label="Search products"
                />
                <button type="submit" aria-label="Search">Search</button>
            </form>

            <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`navbar-link ${isMenuOpen ? 'active' : ''}`}>
                <NavLink to="/" onClick={closeMenu}>Home</NavLink>
                <NavLink to="/categories" onClick={closeMenu}>Categories</NavLink>

                {isAuthenticated && <NavLink to="/profile" onClick={closeMenu}>My Account</NavLink>}
                {isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}

                {!isAuthenticated && <NavLink to="/login" onClick={closeMenu}>Login</NavLink>}
                {isAuthenticated && <span className="nav-item" onClick={handleLogout}>Logout</span>}

                <NavLink to="/cart" className="nav-cart-link" onClick={closeMenu}>
                    Cart
                    {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </NavLink>
            </div>
        </nav>
    );
};

export default Navbar;