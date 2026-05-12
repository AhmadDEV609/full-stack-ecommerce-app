import React, { useState } from 'react';
import '../css/Navbar.css';
import {
    FaShoppingCart,
    FaHeart,
    FaBars,
    FaTimes,
    FaUserCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
    const [toggle, setToggle] = useState(false);


    const userQuery = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/v1/api/user/status", {
                credentials: "include",
            });
            return res.json();
        },
    });

    // 🛒 CART
    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/v1/api/cart/display", {
                credentials: "include",
            });
            return res.json();
        },
        refetchOnWindowFocus: true,
    });


    const wishlistQuery = useQuery({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/v1/api/wishlist", {
                credentials: "include",
            });
            return res.json();
        },
    });

    const user = userQuery.data?.user;

    const isUser = user?.role === "user";
    const isAdmin = user?.role === "admin";

    const items = cartQuery.data?.cart?.items || [];
    const wishlistItems = wishlistQuery.data?.wishlist?.wishlistItem || [];

    const cartCount = items.reduce((a, b) => a + b.quantity, 0);
    const wishlistCount = wishlistItems.length;

    const isLoading =
        userQuery.isLoading ||
        cartQuery.isLoading ||
        wishlistQuery.isLoading;

    if (isLoading) {
        return (
            <nav className="Navbar-container">
                <p>Loading...</p>
            </nav>
        );
    }

    return (
        <>

            {/* SIDEBAR */}
            <div className={`sidebar ${toggle ? 'show' : 'hide'}`}>
                <FaTimes
                    className='menu-icon'
                    onClick={() => setToggle(!toggle)}
                    size={24}
                />

                <div>
                    <ul className='container_sidebar'>
                        <li><Link onClick={() => setToggle(!toggle)} className='link menu_mobile' to={'/login'}>Login</Link></li>
                        <li><Link onClick={() => setToggle(!toggle)} className='link menu_mobile' to={'/signup'}>Signup</Link></li>
                        <li><Link onClick={() => setToggle(!toggle)} className='link menu_mobile' to={'/'}>Home</Link></li>
                        <li><Link onClick={() => setToggle(!toggle)} className='link menu_mobile' to={'/Contact'}>Contact</Link></li>
                        <li><Link onClick={() => setToggle(!toggle)} className='link menu_mobile' to={'/About'}>About</Link></li>
                        <li><Link onClick={() => setToggle(!toggle)} className='link menu_mobile' to={'/product'}>Products</Link></li>

                    </ul>

                </div>
            </div>

            {/* TOP BAR */}
            <div className='Navbar'>
                <h5 className='text-top'>
                    Summer sale for all swim suits and free express delivery - OFF 50% !
                </h5>
            </div>

            {/* MAIN NAVBAR */}
            <nav className='Navbar-container'>

                <div className='menu-icon'>
                    <FaBars onClick={() => setToggle(!toggle)} size={24} />
                </div>

                <h1>GoCart</h1>

                <ul>
                    <li><Link className='link' to={'/'}>Home</Link></li>
                    <li><Link className='link' to={'/Contact'}>Contact</Link></li>
                    <li><Link className='link' to={'/About'}>About</Link></li>
                    <li><Link className='link' to={'/product'}>Products</Link></li>

                </ul>

                <div className="Navbar-icons">

                    {/* 👤 USER ICON ONLY FOR USER */}
                    {isUser && (
                        <div className="navbar-user-wrapper">

                            <div className="navbar-user-icon-only">
                                <FaUserCircle className="navbar-user-icon" />
                            </div>

                            <div className="navbar-user-dropdown">

                                <div className="navbar-user-name">
                                    {user.name}
                                </div>

                                <button
                                    className="navbar-logout-btn"
                                    onClick={async () => {
                                        await fetch("http://localhost:5000/v1/api/user/logout", {
                                            credentials: "include",
                                        });
                                        window.location.reload();
                                    }}
                                >
                                    Logout
                                </button>

                                <Link className='link' to={'/order/status'}>
                                    Order Status
                                </Link>

                            </div>

                        </div>
                    )}

                    {/* ❤️ WISHLIST */}
                    <Link to={'/wishlist'} className='link'>
                        <FaHeart size={24} className="wishlist-icon" />
                        {wishlistCount}
                    </Link>

                    {/* 🛒 CART */}
                    <Link to={'/Cart'} className='link'>
                        <FaShoppingCart size={24} className="cart-icon" />
                        {cartCount}
                    </Link>

                </div>

            </nav>

        </>
    );
};

export default Navbar;