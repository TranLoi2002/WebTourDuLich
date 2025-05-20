import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { TextField, MenuItem } from '@mui/material';
import { getUserById, verifyUser } from '../api/auth.api';
import { getFavouriteTourByUserId, removeFavouriteTourByUserId, updateUserProfile } from '../api/user.api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MyTour from '../components/MyTour';
import ChangePasswordModal from "../pages/auth/ChangePasswordModal";


const formatDateToYMD = (isoDate) => {
    if (!isoDate) return '';
    return isoDate.split('T')[0]; // Extracts yyyy-MM-dd from 2025-04-02T17:00:00.000+00:00
};
const Account = () => {
    const [activeSection, setActiveSection] = useState('account');
    const [user, setUser] = useState(null);
    const [errorUser, setErrorUser] = useState('');
    const [favouritesTour, setFavouritesTour] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [file, setFile] = useState(null);

    // Initialize gender with user's gender or default to 'MALE'
    const [gender, setGender] = useState('MALE');

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const verifiedUser = await verifyUser();
                if (verifiedUser?.id) {
                    const userDetails = await getUserById(verifiedUser.id);
                    if (userDetails) {
                        setUser({
                            ...userDetails,
                            dateOfBirth: formatDateToYMD(userDetails.dateOfBirth),
                        });
                        setGender(userDetails.gender || 'MALE'); // Set gender from user details
                    } else {
                        setErrorUser('User details not found');
                    }
                } else {
                    setErrorUser('User not found in cookie');
                }
            } catch (error) {
                setErrorUser(error?.message || 'Failed to fetch user details');
            }
        };

        fetchUserDetails();
    }, []);

    // Fetch favorite tours
    useEffect(() => {
        const fetchFavouritesTour = async () => {
            if (user?.id) {
                try {
                    const response = await getFavouriteTourByUserId(user.id);
                    setFavouritesTour(response || []);
                } catch (error) {
                    console.error('Failed to fetch favourite tours:', error);
                }
            }
        };

        fetchFavouritesTour();
    }, [user]);

    // Handle file change for image upload
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 3 * 1024 * 1024) {
                setError('❌ File too large! Please select a file under 3MB.');
                setImage(null);
                setFile(null);
            } else {
                setError('');
                setImage(URL.createObjectURL(selectedFile));
                setFile(selectedFile);
            }
        }
    };

    // Handle remove file
    const handleRemoveFile = () => {
        setImage(null);
        setFile(null);
        setError('');
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        if (!user) return;

        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('fullName', user.fullName || '');
        formData.append('address', user.address || '');
        formData.append('dateOfBirth', user.dateOfBirth || '');
        formData.append('gender', gender); // Use gender state

        try {
            const updatedUser = await updateUserProfile(user.id, formData);
            setUser(updatedUser);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile: ' + (error?.message || 'Something went wrong'));
        }
    };

    // Handle remove favourite tour
    const handleRemoveFavouriteTour = async (tourId) => {
        try {
            await removeFavouriteTourByUserId(user.id, tourId);
            setFavouritesTour((prev) => prev.filter((tour) => tour.id !== tourId));
            toast.success('Tour removed from favourites');
        } catch (error) {
            toast.error('Failed to remove favourite tour');
        }
    };

    // Section change handlers
    const changeSection = (section) => setActiveSection(section);

    // Conditional rendering for avatar
    const renderAvatar = () => {
        if (image) return <img src={image} alt='Preview' className='w-full h-full object-cover' />;
        if (user?.avatar) return <img src={user.avatar} alt='Avatar' className='w-full h-full object-cover' />;
        return <img src='/default-avatar.png' alt='Default Avatar' className='w-full h-full object-cover' />;
    };

    if (errorUser) {
        return <div className='text-red-500 text-center mt-20'>{errorUser}</div>;
    }

    if (!user) {
        return <div className='text-center mt-20'>Loading...</div>;
    }

    return (
        <div className='flex flex-col items-center justify-center py-44'>
            <div className='flex flex-col'>
                <div className='flex gap-[40px]'>
                    {/* Sidebar */}
                    <div className='relative ' >
                        <div className='flex flex-col gap-[10px] rounded-lg py-[40px] px-[24px] text-xl shadow-2xl w-[300px]'>
                            {[
                                { id: 'account', icon: 'user', label: 'Account Setting' },
                                { id: 'security', icon: 'lock', label: 'Privacy & Security' },
                                { id: 'mytour', icon: 'plane', label: 'My tour' },
                                { id: 'favourites', icon: 'heart', label: 'Favourite tour' },
                            ].map((section) => (
                                <label
                                    key={section.id}
                                    className='py-[10px] flex items-center gap-[10px] rounded-lg px-[20px] cursor-pointer'
                                    style={{ backgroundColor: activeSection === section.id ? '#EBF1FF' : '' }}
                                    onClick={() => changeSection(section.id)}
                                >
                                    <div className='w-[30px] h-[30px] rounded-full bg-[#3B71FE] flex items-center justify-center text-white'>
                                        <i className={`fa-solid fa-${section.icon}`}></i>
                                    </div>
                                    <span className='font-normal text-[1rem]'>{section.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='relative' style={{width:1100}}>
                        {activeSection === 'account' && (
                            <div className='flex flex-col gap-[30px]'>
                                <h2 className='text-2xl text-center font-bold'>Account Setting</h2>
                                <div className='flex flex-col shadow-xl rounded-lg py-[30px] px-[40px]'>
                                    <h3>My profile</h3>
                                    <div className='flex items-center mt-[24px] mb-[24px]'>
                                        <div className='w-[120px] h-[110px] mr-[60px] rounded-lg border-2 overflow-hidden'>
                                            {renderAvatar()}
                                        </div>
                                        <div className='flex flex-col'>
                                            <form className='flex items-center gap-[25px]'>
                                                <input
                                                    type='file'
                                                    id='file'
                                                    className='hidden'
                                                    accept='image/*'
                                                    onChange={handleFileChange}
                                                />
                                                <label
                                                    htmlFor='file'
                                                    className='w-[210px] h-[38px] rounded-lg bg-[#3B71FE] text-white flex items-center justify-center cursor-pointer'
                                                >
                                                    Upload file
                                                </label>
                                            </form>
                                            {error && <p className='text-red-500'>{error}</p>}
                                            <h4 className='font-normal text-[#b7b1b1] leading-5'>
                                                Image formats with max size of 3MB
                                            </h4>
                                        </div>
                                    </div>
                                    <form>
                                        <div className='flex items-center gap-[2rem] w-full my-5'>
                                            <TextField
                                                className='w-full'
                                                label='Full Name'
                                                variant='outlined'
                                                value={user.fullName || ''}
                                                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className='flex items-center gap-[2rem] w-full my-5'>
                                            <TextField
                                                className='w-1/2'
                                                label='Address'
                                                value={user.address || ''}
                                                variant='outlined'
                                                onChange={(e) => setUser({ ...user, address: e.target.value })}
                                            />
                                            <TextField
                                                className='w-1/2'
                                                label='Date of Birth'
                                                type='date'
                                                value={user.dateOfBirth || ''}
                                                onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </div>
                                        <div className='flex items-center gap-[2rem] w-full my-5'>
                                            <TextField className='w-1/2' label='Email' variant='outlined' value={user.email || ''} disabled />
                                            <TextField
                                                className='w-1/2'
                                                select
                                                label='Gender'
                                                value={gender}
                                                onChange={(e) => {
                                                    setGender(e.target.value);
                                                    setUser({ ...user, gender: e.target.value });
                                                }}
                                            >
                                                <MenuItem value='MALE'>Male</MenuItem>
                                                <MenuItem value='FEMALE'>Female</MenuItem>
                                            </TextField>
                                        </div>
                                        <button
                                            type='button'
                                            className='bg-primary outline-none border-none text-white rounded-lg py-[12px] px-[27px] mt-[20px]'
                                            onClick={handleSaveChanges}
                                        >
                                            Save Change
                                        </button>
                                    </form>
                                </div>
                                {/* Social Networks Section */}
                                <div className='flex flex-col gap-[10px] shadow-xl rounded-lg py-[30px] px-[40px]'>
                                    <div className='mb-[30px]' id='socials_link'>
                                        <h3>Social Networks</h3>
                                        <p className='leading-5'>
                                            Connect your Facebook, Twitter, and LinkedIn account to log in quickly.
                                        </p>
                                    </div>
                                    {[
                                        { name: 'Facebook', icon: 'square-facebook' },
                                        { name: 'Twitter', icon: 'square-twitter' },
                                        { name: 'LinkedIn', icon: 'linkedin' },
                                    ].map((social) => (
                                        <div key={social.name} className='flex flex-col gap-[20px]'>
                                            <span className='text-xl text-gray-400'>Connect to {social.name}</span>
                                            <div className='flex items-center rounded-lg bg-[#EEF9F2] justify-between border-2 py-[17px] px-[28px]'>
                                                <div className='flex items-center w-[490px] gap-[10px]'>
                                                    <i className={`fa-brands fa-${social.icon} text-2xl text-primary`}></i>
                                                    <p className='text-[0.9em] text-[#63646b] pr-[130px]'>
                                                        You are successfully connected to {social.name.toLowerCase()}. You can easily log in using your {social.name.toLowerCase()} account.
                                                    </p>
                                                </div>
                                                <button className='outline-none border-2 text-[#F65540] bg-[#FFEFF1] rounded-lg py-[9px] px-[39px]'>
                                                    Connect
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className='relative'>
                                <h2 className='text-2xl text-center font-bold mb-[30px]'>Security</h2>
                                <div className='flex flex-col gap-[1rem]'>
                                    <div>
                                        <details>
                                            <summary>Login</summary>
                                            <div className='flex items-center justify-between my-[10px]'>
                                                <div>
                                                    <h3>Password</h3>
                                                    <span className='text-[0.8em] text-gray-400 leading-3'>Last updated 1 month ago</span>
                                                </div>
                                                <button
                                                    className='border-2 rounded-lg py-[8px] px-[10px] text-[#777E90]'
                                                    onClick={() => setModalIsOpen(true)}
                                                >
                                                    Update password
                                                </button>
                                            </div>
                                        </details>
                                    
                                        {/* Modal tách riêng */}
                                        <ChangePasswordModal
                                            isOpen={modalIsOpen}
                                            onClose={() => setModalIsOpen(false)}
                                        /> 
                                    </div>
                                    <details>
                                        <summary>Device History</summary>
                                        <p className='mt-5'>Your access has not been processed yet!</p>
                                    </details>
                                    <details>
                                        <summary>Where You're Logged in?</summary>
                                        <p className='mt-5'>Your access has not been processed yet!</p>
                                    </details>
                                    <details>
                                        <summary>Socials accounts</summary>
                                        <h3>My Data Account</h3>
                                        <p>You can manage your social media accounts here. Choose the method of account you wish to use.</p>
                                        <div className='data_select'>
                                            <div className='gmail'>
                                                <span>My account data linked to your Google account</span>
                                                <i className='fa-solid fa-circle-check'></i>
                                            </div>
                                            {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                                                <div key={social} className={social.toLowerCase()}>
                                                    {social}: <a href='/profile-page/index.html#socials_link'>unlinked</a>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                    <details>
                                        <summary>Privacy and Security Information</summary>
                                        <p>
                                            {/* Privacy policy content remains unchanged */}
                                        </p>
                                    </details>
                                </div>
                            </div>
                        )}

                        {activeSection === 'mytour' && (
                            <MyTour/>
                        )}

                        {activeSection === 'favourites' && (
                            <div id='tbl'>
                                <h2 className='text-2xl text-center font-bold mb-[30px]'>My favourite tours</h2>
                                <table className='bg-[#fafafa] border-collapse border-spacing-0 rounded-lg text-center shadow-xl mt-[2rem] w-full'>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Tour Code</th>
                                        <th>Place of Departure</th>
                                        <th>Price</th>
                                        <th>Detail</th>
                                        <th>Remove</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {favouritesTour.map((tour) => (
                                        <tr key={tour.id}>
                                            <td>{tour.title}</td>
                                            <td>{tour.tourCode}</td>
                                            <td>{tour.placeOfDeparture}</td>
                                            <td>{tour.price}</td>
                                            <td>
                                                <Link to={`/tours/detailtour/${tour.id}`} className='text-primary underline'>
                                                    More
                                                </Link>
                                            </td>
                                            <td>
                                                <i
                                                    className='fa-solid fa-trash-can text-red-600 cursor-pointer'
                                                    onClick={() => handleRemoveFavouriteTour(tour.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <button className='mt-[15px] border-none rounded-lg py-[10px] px-[20px] shadow-xl block text-sm bg-red-600 text-white'>
                                    Delete All
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;