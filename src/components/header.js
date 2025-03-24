import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import logo from '../assets/images/logo.png';
import user_avt from '../assets/images/user_header.png';

const Header = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Xử lý cuộn trang
    const controlHeader = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowHeader(false);
        } else {
            setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', controlHeader);
        // Dọn dẹp khi component unmount
        return () => {
            window.removeEventListener('scroll', controlHeader);
        };
    }, [lastScrollY]);

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
    };

    const handleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowUserMenu(false);
    };

    return (
        <header>
            <div
                className={`header_nav fixed top-0 w-full bg-white z-[99999] transition-transform duration-300 ease-in-out shadow-[0_20px_30px_-10px_rgba(38,57,77,0.8)] flex justify-around py-4 text-lg ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                <Link to="/" className="nav_logo flex items-center cursor-pointer no-underline">
                    <img src={logo} alt="logo"/>
                    <span className="font-extrabold text-[20px] leading-[25px] ml-2 text-primary">Airtrav</span>
                </Link>

                <div className="nav_select flex">
                    <ul className="relative flex justify-center items-center">
                        <li className="relative list-none">
                            <Link
                                className="link_target flex justify-between items-center mx-5 text-gray-800 relative text-[1.1rem]"
                                to="/thingstodo" title="click to details page">Things to do</Link>
                        </li>
                        <li className="relative list-none">
                            <Link
                                className="link_target flex justify-between items-center mx-5 text-gray-800 relative text-[1.1.rem]"
                                to="/tours" title="click to details page">Tour</Link>
                        </li>
                        <li className="relative list-none">
                            <Link
                                className="link_target flex justify-between items-center mx-5 text-gray-800 relative text-[1.1.rem]"
                                to="/blogs" title="click to details page">Blog</Link>
                        </li>
                    </ul>
                </div>

                <div className="nav_user flex relative">
                    <ul className="relative flex items-center justify-center gap-2">
                        <li className="relative list-none">
                            <Link className="text-gray-500 font-extrabold font-sans"
                                  title="Currency conversion">USD</Link>
                        </li>
                        <li className="relative list-none">
                            <Link to="/faq" className="text-gray-500 font-extrabold">FAQ</Link>
                        </li>
                        <li className="relative list-none">
                            <Link className="text-gray-500"><i className="fa-regular fa-bell" title="Notification"></i></Link>
                        </li>
                        <li className="navbar_icon hidden text-xl cursor-pointer" onClick={handleOpenMenu}>
                            <i className="fa-solid fa-bars"></i>
                        </li>

                        {isLoggedIn ? (
                            <li className="user-menu relative" onClick={handleUserMenu}>
                                {/* avatar */}
                                <img src={user_avt} alt="user.png"
                                     className="border-l border-gray-300 flex items-center px-5 ml-2"/>
                                {/* user menu */}
                                <ul className={`menu absolute w-[170px] min-h-[100px] top-[55px] right-0 flex flex-col items-start shadow-[0_20px_20px_#555] py-2 px-4 bg-white rounded-xl  ${showUserMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                    <li className="list-none leading-10">
                                        <Link to="/account"
                                              className="text-sm font-semibold text-gray-500 transition-all duration-250 ease-in-out hover:px-1 hover:rounded-md">Accounts</Link>
                                    </li>
                                    <li className="list-none leading-10 border-b border-gray-300">
                                        <Link to="/help"
                                              className="text-sm font-semibold text-gray-500 transition-all duration-250 ease-in-out hover:px-1 hover:rounded-md">Helps</Link>
                                    </li>
                                    <li className="list-none leading-10 flex items-center gap-2 my-3">
                                        <i className="fa-solid fa-arrow-right-from-bracket text-red-600"></i>
                                        <Link onClick={handleLogout}
                                              className="text-sm font-semibold text-gray-500 transition-all duration-250 ease-in-out hover:px-1 hover:rounded-md">Sign
                                            out</Link>
                                    </li>
                                    <li className="list-none leading-10 flex items-center justify-between w-full">
                                        <Link
                                            className="text-sm font-semibold text-gray-500 transition-all duration-250 ease-in-out hover:px-1 hover:rounded-md">Interface</Link>
                                        <div
                                            className="status bg-gray-200 flex items-center justify-center gap-2 px-2 py-1 rounded-full text-xs">
                                            <i className="fa-regular fa-sun bg-white p-2 rounded-full"></i>
                                            <i className="fa-solid fa-moon"></i>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="relative list-none">
                                <Link to="/auth/sign_in" onClick={handleLogin}
                                      className="nav_sign_in flex px-4 py-2 bg-primary rounded-full text-white text-base">Login
                                    now</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <Modal
                isOpen={openMenu}
                onRequestClose={handleOpenMenu}
                className="navbar_modal fixed top-0 right-0 w-[300px] h-full bg-white shadow-lg transform translate-x-0 transition-transform duration-1000 ease-in z-[10000]"
                overlayClassName="navbar_overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-[9998]"
                contentLabel="Navbar Modal"
            >
                <div className="navbar_close text-xl cursor-pointer p-5 float-right" onClick={handleOpenMenu}>
                    <i className="fa-solid fa-times"></i>
                </div>
                <div className="navbar_content p-5">
                    <div className="nav_select">
                        <ul className="flex flex-col list-none p-12">
                            <li className="relative list-none">
                                <Link
                                    className="link_target flex justify-between items-center mx-5 text-gray-800 relative text-sm"
                                    to="/thingstodo" title="click to details page">Things to do</Link>
                            </li>
                            <li className="relative list-none">
                                <Link
                                    className="link_target flex justify-between items-center mx-5 text-gray-800 relative text-sm"
                                    to="/tours" title="click to details page">Tour</Link>
                            </li>
                            <li className="relative list-none">
                                <Link
                                    className="link_target flex justify-between items-center mx-5 text-gray-800 relative text-sm"
                                    to="/blogs" title="click to details page">Blog</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>
        </header>
    );
};

export default Header;