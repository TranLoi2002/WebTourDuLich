import React from 'react';
import {useEffect, useState} from "react";
import {Link, useLocation} from 'react-router-dom';

import logo from '../assets/images/logo.png';

import imageMain1 from '../assets/images/image_main_1.png';
import imageMain2 from '../assets/images/image_main_2.png';
import imageMain3 from '../assets/images/image_main_3.png';

import brand_1 from '../assets/images/brand01.png';
import brand_2 from '../assets/images/booking_brand02.png';
import brand_3 from '../assets/images/trivago_brand03.png';
import brand_4 from '../assets/images/trainline_brand04.png';
import brand_5 from '../assets/images/cheapflight_brand05.png';
import brand_6 from '../assets/images/momondo_brand06.png';

const Header = () => {
    // open menu
    const [openMenu, setOpenMenu] = useState(false);
    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
    }

    const location =useLocation();
    let headerClass = '';
    if(location.pathname === '/things_to_do'){
        headerClass = 'things_to_do_header';
    }else if(location.pathname === '/tours'){
        headerClass = 'tours_header';
    }else if(location.pathname === '/blogs'){
        headerClass = 'blogs_header';
    }


    return (
        <header>
            {/*header title*/}
            <div className="header_nav">

                <Link to="/" className="nav_logo" title="home page">
                    <img src={logo} alt="logo"/>
                    <span style={{textDecoration:'none'}}>Airtrav</span>
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
                        <li><Link  title="Currency conversion">USD</Link></li>
                        <li><Link to="/faq" >FAQ</Link></li>
                        <li><Link ><i className="fa-regular fa-bell" title="Notification
                            "></i></Link></li>
                        <li className="user-menu" onClick={handleOpenMenu}>
                            <img src="../image/user_header.png" alt="user.png" className="user-avatar"/>
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


        </header>
    );
}

export default Header;