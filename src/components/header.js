import React from 'react';
import { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import Modal from 'react-modal'

import logo from '../assets/images/logo.png';
import user_avt from '../assets/images/user_header.png';

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showNavbar, setShowNavbar] = useState(false);

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleToggleNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    const location = useLocation();
    let headerClass = '';
    if (location.pathname === '/things_to_do') {
        headerClass = 'things_to_do_header';
    } else if (location.pathname === '/tours') {
        headerClass = 'tours_header';
    } else if (location.pathname === '/blogs') {
        headerClass = 'blogs_header';
    }

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <header>
            <div className={`header_nav ${showHeader ? 'visible' : 'hidden'}`}>
                <Link to="/" className="nav_logo" title="home page">
                    <img src={logo} alt="logo" />
                    <span style={{ textDecoration: 'none' }}>Airtrav</span>
                </Link>

                <div className={`nav_select ${headerClass}`}>
                    <ul>
                        <li>
                            <Link className="link_target" target="_self" to="/things_to_do" title="click to details page">Things
                                To Do</Link>
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
                        <li className="navbar_icon" onClick={handleToggleNavbar}>
                            <i className="fa-solid fa-bars"></i>
                        </li>
                        <li className="user-menu" onClick={handleOpenMenu}>
                            <img src={user_avt} alt="user.png" className="user-avatar" />
                            <ul className={`menu ${openMenu ? 'active' : ''}`}>
                                <li><Link to="/account">Accounts</Link></li>
                                <li><Link to="/help">Helps</Link></li>
                                <li>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                    <Link to="/auth/sign_in">Login</Link>
                                </li>
                                <li><Link href="">Interface</Link>
                                    <div className="status">
                                        <i className="fa-regular fa-sun"></i>
                                        <i className="fa-solid fa-moon"></i>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={showNavbar}
                onRequestClose={handleToggleNavbar}
                className="navbar_modal show"
                overlayClassName="navbar_overlay"
                contentLabel="Navbar Modal"
            >
                <div className="navbar_close" onClick={handleToggleNavbar}>
                    <i className="fa-solid fa-times"></i>
                </div>
                <div className="navbar_content">
                    <div className={`nav_select ${headerClass}`}>
                        <ul>
                            <li>
                                <Link
                                    onClick={handleToggleNavbar}
                                    className="link_target" target="_self" to="/things_to_do"
                                      title="click to details page">Things
                                    To Do</Link>
                            </li>
                            <li>
                                <Link
                                    onClick={handleToggleNavbar}
                                    className="link_target" to="/tours" title="click to details page">Tour</Link>
                            </li>
                            <li>
                                <Link
                                    onClick={handleToggleNavbar}
                                    className="link_target" to="/blogs" title="click to details page">Blog</Link>
                            </li>
                            <li><Link title="Currency conversion">USD</Link></li>
                            <li><Link
                                onClick={handleToggleNavbar}
                                to="/faq">FAQ</Link></li>
                            <li><Link>
                                Notification
                            </Link></li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

export default Header;