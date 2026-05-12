import React, { useState } from 'react';
import '../css/navbar.css';
import { Link } from 'react-router-dom'
const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="container">
            <div className="logo">GOCart Admin Panel</div>

            {/* Hamburger icon for mobile */}
            <div
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                &#9776;
            </div>

            {/* Menu items */}
            <ul className={`menu ${menuOpen ? 'active' : ''}`}>
                <li> <Link className='link' to={'/'}>Home</Link></li>
                <li> <Link className='link' to={'/product'}>Product</Link> </li>
                <li> <Link className='link' to={'/order'}>Orders</Link></li>
                <li> <Link className='link' to={'/analytics'}>Analytics</Link> </li>
            </ul>

            <button className="logout-btn">Logout</button>
        </nav>
    );
};

export default Navbar;