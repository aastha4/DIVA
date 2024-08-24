import React, { useState, useRef, useContext } from 'react';
import "./Navbar.css";
import { Link } from 'react-router-dom';
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    const isLoggedIn = !!localStorage.getItem('auth-token');

    return (
        <div className='navbar'>
            <div className='nav-logo'>
                <img src={logo} alt="Logo" />
                <p>DIVA'S ATTIRE</p>
            </div>
            <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt='Dropdown' />
            <ul ref={menuRef} className='nav-menu'>
                <li onClick={() => { setMenu("shop") }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>Shop</Link>
                    {menu === "shop" ? <hr /> : null}
                </li>
                <li onClick={() => { setMenu("mens") }}>
                    <Link style={{ textDecoration: 'none' }} to="/mens">Men</Link>
                    {menu === "mens" ? <hr /> : null}
                </li>
                <li onClick={() => { setMenu("womens") }}>
                    <Link style={{ textDecoration: 'none' }} to="/womens">Women</Link>
                    {menu === "womens" ? <hr /> : null}
                </li>
                <li onClick={() => { setMenu("kids") }}>
                    <Link style={{ textDecoration: 'none' }} to="/kids">Kids</Link>
                    {menu === "kids" ? <hr /> : null}
                </li>
            </ul>
            <div className='nav-login-cart'>
                {isLoggedIn ? (
                    <>
                        <button onClick={() => {
                            localStorage.removeItem("auth-token");
                            window.location.replace('/');
                        }}>Logout</button>
                        <Link to="/cart">
                            <img src={cart_icon} alt="Cart" />
                        </Link>
                        <div className='nav-cart-count'>{getTotalCartItems()}</div>
                    </>
                ) : (
                    <Link to="/login"><button>Login</button></Link>
                )}
            </div>
        </div>
    )
}

export default Navbar;
