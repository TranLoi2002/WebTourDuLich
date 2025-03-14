import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import logo from '../assets/images/logo.png';
import user_avt from '../assets/images/user_header.png';

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setOpenMenu(false);
    };

    return (
        <header>
            <div className="header_nav">
                <Link to="/" className="nav_logo" title="home page">
                    <img src={logo} alt="logo" />
                    <span style={{ textDecoration: 'none' }}>Airtrav</span>
                </Link>

                <div className="nav_select">
                    <ul>
                        <li>
                            <Link className="link_target" to="/things_to_do" title="click to details page">Things To Do</Link>
                        </li>
                        <li>
                            <Link className="link_target" to="/tours" title="click to details page">Tour</Link>
                        </li>
                        <li>
                            <Link className="link_target" to="/blogs" title="click to details page">Blog</Link>
                        </li>
                    </ul>
                </div>

                <div className="nav_user">
                    <ul>
                        <li><Link title="Currency conversion">USD</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link><i className="fa-regular fa-bell" title="Notification"></i></Link></li>
                        <li className="navbar_icon" onClick={handleOpenMenu}>
                            <i className="fa-solid fa-bars"></i>
                        </li>

                        {isLoggedIn ? (
                            <li className="user-menu" onClick={handleOpenMenu}>
                                <img src={user_avt} alt="user.png" className="user-avatar" />
                                <ul className={`menu ${openMenu ? 'active' : ''}`}>
                                    <li><Link to="/account">Accounts</Link></li>
                                    <li><Link to="/help">Helps</Link></li>
                                    <li onClick={handleLogout}>
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                        <Link>Sign out</Link>
                                    </li>
                                    <li>
                                        <Link>Interface</Link>
                                        <div className="status">
                                            <i className="fa-regular fa-sun"></i>
                                            <i className="fa-solid fa-moon"></i>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li>
                                <Link to="/auth/sign_in" className="nav_sign_in" onClick={handleLogin}>Login now</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={openMenu}
                onRequestClose={handleOpenMenu}
                className="navbar_modal show"
                overlayClassName="navbar_overlay"
                contentLabel="Navbar Modal"
            >
                <div className="navbar_close" onClick={handleOpenMenu}>
                    <i className="fa-solid fa-times"></i>
                </div>
                <div className="navbar_content">
                    <div className="nav_select">
                        <ul>
                            <li>
                                <Link onClick={handleOpenMenu} className="link_target" to="/things_to_do" title="click to details page">Things To Do</Link>
                            </li>
                            <li>
                                <Link onClick={handleOpenMenu} className="link_target" to="/tours" title="click to details page">Tour</Link>
                            </li>
                            <li>
                                <Link onClick={handleOpenMenu} className="link_target" to="/blogs" title="click to details page">Blog</Link>
                            </li>
                            <li><Link title="Currency conversion">USD</Link></li>
                            <li><Link onClick={handleOpenMenu} to="/faq">FAQ</Link></li>
                            <li><Link>Notification</Link></li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

export default Header;