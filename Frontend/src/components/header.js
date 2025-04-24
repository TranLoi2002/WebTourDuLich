import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import logo from '../assets/images/logo.png';
import user_avt from '../assets/images/user_header.png';
import { logout } from '../api/auth.api';
import {toast} from "react-toastify";

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const userDetail = localStorage.getItem('user');
        if (userDetail) {
            setUser(JSON.parse(userDetail));
        } else {
            setUser(null);
        }
        setIsLoggedIn(!!user);
    }, [location]);

    console.log("user", user);

    // Lắng nghe sự thay đổi trong localStorage
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'user') {
                const user = localStorage.getItem('user');
                setIsLoggedIn(!!user);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Xử lý cuộn trang
    useEffect(() => {
        const controlHeader = () => {
            const currentScrollY = window.scrollY;
            setShowHeader(currentScrollY <= lastScrollY || currentScrollY <= 100);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlHeader);
        return () => window.removeEventListener('scroll', controlHeader);
    }, [lastScrollY]);

    const handleOpenMenu = () => setOpenMenu(!openMenu);
    const handleUserMenu = () => setShowUserMenu(!showUserMenu);

    const handleLogin = () => navigate('/auth/sign_in');
    const handleLogout = () => {
        logout()
            .then(() => {
                setIsLoggedIn(false);
                setShowUserMenu(false);
                localStorage.removeItem('user');
                toast.info("Logout successfully.",
                   );
                navigate('/auth/sign_in');
            })
            .catch((error) => console.error('Logout failed:', error));
    };

    const headerClass = location.pathname === '/thingstodo'
        ? 'things_to_do_header'
        : location.pathname === '/tours'
            ? 'tours_header'
            : location.pathname === '/blogs'
                ? 'blogs_header'
                : '';

    return (
        <header>
            <div
                className={`header_nav fixed top-0 w-full bg-white z-[99999] transition-transform duration-300 ease-in-out shadow-[0_20px_30px_-10px_rgba(38,57,77,0.8)] flex justify-around py-4 text-lg ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                <Link to="/" className="nav_logo flex items-center cursor-pointer no-underline">
                    <img src={logo} alt="logo" />
                    <span className="font-extrabold text-[20px] leading-[25px] ml-2 text-primary">Airtrav</span>
                </Link>

                <div className={`nav_select ${headerClass} flex`}>
                    <ul className="relative flex justify-center items-center">
                        <li className="relative list-none">
                            <Link className="link_target mx-5 text-gray-800 text-[1.1rem]" to="/thingstodo">Things to do</Link>
                        </li>
                        <li className="relative list-none">
                            <Link className="link_target mx-5 text-gray-800 text-[1.1rem]" to="/tours">Tour</Link>
                        </li>
                        <li className="relative list-none">
                            <Link className="link_target mx-5 text-gray-800 text-[1.1rem]" to="/blogs">Blog</Link>
                        </li>
                    </ul>
                </div>

                <div className="nav_user flex relative">
                    <ul className="relative flex items-center justify-center gap-2">
                        <li className="relative list-none">
                            <Link className="text-gray-500 font-extrabold">USD</Link>
                        </li>
                        <li className="relative list-none">
                            <Link to="/faq" className="text-gray-500 font-extrabold">FAQ</Link>
                        </li>
                        <li className="relative list-none">
                            <Link className="text-gray-500">
                                <i className="fa-regular fa-bell" title="Notification"></i>
                            </Link>
                        </li>
                        <li className="navbar_icon hidden text-xl cursor-pointer" onClick={handleOpenMenu}>
                            <i className="fa-solid fa-bars"></i>
                        </li>

                        {isLoggedIn ? (
                            <li className="user-menu relative" onClick={handleUserMenu}>
                                <div className="border-l border-gray-300 ml-2 w-[50px] h-[50px] rounded-full overflow-hidden bg-red-300">
                                    <img src={user.avatar} alt="user.png"
                                         className="w-full h-full cursor-pointer object-cover"
                                    />
                                </div>

                                <ul className={`menu absolute w-[170px] top-[55px] right-0 flex flex-col items-start shadow-[0_20px_20px_#555] py-2 px-4 bg-white rounded-xl ${showUserMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                    <li className="list-none leading-10">
                                        <Link to="/account" className="text-sm font-semibold text-gray-500">Accounts</Link>
                                    </li>
                                    <li className="list-none leading-10 border-b border-gray-300">
                                        <Link to="/help" className="text-sm font-semibold text-gray-500">Helps</Link>
                                    </li>
                                    <li className="list-none leading-10 flex items-center gap-2 my-3">
                                        <i className="fa-solid fa-arrow-right-from-bracket text-red-600"></i>
                                        <button onClick={handleLogout} className="text-sm font-semibold text-gray-500">Sign out</button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="relative list-none">
                                <button onClick={handleLogin} className="nav_sign_in px-4 py-2 bg-primary rounded-full text-white text-base">Login now</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={openMenu}
                onRequestClose={handleOpenMenu}
                className="navbar_modal fixed top-0 right-0 w-[300px] h-full bg-white shadow-lg z-[10000]"
                overlayClassName="navbar_overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9998]"
            >
                <div className="navbar_close text-xl cursor-pointer p-5" onClick={handleOpenMenu}>
                    <i className="fa-solid fa-times"></i>
                </div>
                <div className="navbar_content p-5">
                    <ul className="flex flex-col list-none p-12">
                        <li><Link to="/thingstodo" className="text-sm text-gray-800">Things to do</Link></li>
                        <li><Link to="/tours" className="text-sm text-gray-800">Tour</Link></li>
                        <li><Link to="/blogs" className="text-sm text-gray-800">Blog</Link></li>
                    </ul>
                </div>
            </Modal>
        </header>
    );
};

export default Header;