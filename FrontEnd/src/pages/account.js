import React, {useState, useEffect} from 'react';
import Modal from 'react-modal'
import {TextField, MenuItem} from "@mui/material";
import {getUserById, verifyUser} from "../api/auth.api";

const Account = () => {
    const [activeSection, setActiveSection] = useState('account');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [gender, setGender] = useState('');

    const [user, setUser] = useState(null);
    const [errorUser, setErrorUser] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const verifiedUser = await verifyUser();
                if (verifiedUser?.id) {
                    const userDetails = await getUserById(verifiedUser.id);
                    setUser(userDetails);
                    console.log("User details:", userDetails);

                    console.log("user ", user)
                } else {
                    setErrorUser("User not found in cookie");
                }
            } catch (error) {
                setErrorUser(error?.message || "Failed to fetch user details");
            }
        };

        fetchUserDetails();
    }, []); // chỉ chạy 1 lần khi component mount


    const changeSectionSecurity = () => {
        setActiveSection('security');
    }
    const changeSectionFavouritesTour = () => {
        setActiveSection('favourites')
    }

    const changeSectionMyTour = () => {
        setActiveSection('mytour');
    }

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [image, setImage] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            if (selectedFile.size > 3 * 1024 * 1024) {
                setError("❌ File quá lớn! Vui lòng chọn file dưới 3MB.");
                setImage(null);
            } else {
                setError("");
                const fileURL = URL.createObjectURL(selectedFile);
                setImage(fileURL);
            }
        }
    };

    const handleRemoveFile = () => {
        setImage(null);
        setError("");
    };

    return (
        <div className="flex flex-col">
            <div className="flex mt-[100px] pt-[50px] pr-[200px] pb-[100px] pl-[200px] flex-col">

                <div className="flex mt-[20px] gap-[40px]">
                    <div className="relative">
                        <div
                            className="flex flex-col gap-[10px] rounded-lg py-[40px] px-[24px] text-xl shadow-2xl w-[300px]">
                            <label htmlFor=""
                                   className="py-[10px] flex items-center gap-[10px] rounded-lg px-[20px] cursor-pointer"
                                   style={{backgroundColor: activeSection === 'account' ? '#EBF1FF' : ''}}
                                   onClick={() => setActiveSection('account')}>
                                <div
                                    className="w-[30px] h-[30px] rounded-full bg-[#3B71FE] flex items-center justify-center text-white">
                                    <i className="fa-solid fa-user"></i>
                                </div>
                                <span className="font-normal text-[1rem]">Account Setting</span>
                            </label>
                            <label htmlFor=""
                                   className="py-[10px] flex items-center gap-[10px] rounded-lg px-[20px] cursor-pointer"
                                   style={{backgroundColor: activeSection === 'security' ? '#EBF1FF' : ''}}
                                   onClick={changeSectionSecurity}>
                                <div
                                    className="w-[30px] h-[30px] rounded-full bg-[#3B71FE] flex items-center justify-center text-white">
                                    <i className="fa-solid fa-lock"></i>
                                </div>
                                <span className="font-normal text-[1rem]">Privacy & Security</span>
                            </label>
                            <label htmlFor=""
                                   className="py-[10px] flex items-center gap-[10px] rounded-lg px-[20px] cursor-pointer"
                                   style={{backgroundColor: activeSection === 'mytour' ? '#EBF1FF' : ''}}
                                   onClick={changeSectionMyTour}>
                                <div
                                    className="w-[30px] h-[30px] rounded-full bg-[#3B71FE] flex items-center justify-center text-white">
                                    <i className="fa-solid fa-plane"></i>
                                </div>
                                <span className="font-normal text-[1rem]">My tour</span>
                            </label>
                            <label htmlFor=""
                                   className="py-[10px] flex items-center gap-[10px] rounded-lg px-[20px] cursor-pointer"
                                   style={{backgroundColor: activeSection === 'favourites' ? '#EBF1FF' : ''}}
                                   onClick={changeSectionFavouritesTour}>
                                <div
                                    className="w-[30px] h-[30px] rounded-full bg-[#3B71FE] flex items-center justify-center text-white">
                                    <i className="fa-solid fa-heart"></i>
                                </div>

                                <span className="font-normal text-[1rem]">Favourite tour</span>
                            </label>
                        </div>
                    </div>

                    <div className="relative">
                        {activeSection === 'account' && (

                            <div className="flex flex-col gap-[30px]">
                                <div>
                                    <h2 className="text-2xl text-center font-bold">Account Setting</h2>
                                </div>
                                <div className="flex flex-col shadow-xl rounded-lg py-[30px] px-[40px]">
                                    <h3>My profile</h3>
                                    <div className="flex items-center mt-[24px] mb-[24px]">
                                        {/* Ô hiển thị ảnh */}
                                        <div
                                            className="w-[120px] h-[110px] mr-[60px] rounded-lg border-2 overflow-hidden">
                                            {image ? (
                                                <img src={image} alt="Preview" className="w-full h-full object-cover"/>
                                            ) : (
                                                <img src="image/mask-group@2x.png" alt="Default Avatar"
                                                     className="w-full h-full object-cover"/>
                                            )}
                                        </div>

                                        {/* Upload Form */}
                                        <div className="flex flex-col">
                                            <form className="flex items-center gap-[25px]">
                                                <input type="file" id="file" className="hidden" accept="image/*"
                                                       onChange={handleFileChange}/>
                                                <label htmlFor="file"
                                                       className="w-[210px] h-[38px] rounded-lg bg-[#3B71FE] text-white flex items-center justify-center cursor-pointer">
                                                    Upload file
                                                </label>
                                                <button
                                                    className="outline-none border-2 border-[#F65540] text-[#F65540] rounded-lg bg-white py-[5px] px-[30px]"
                                                    type="button"
                                                    onClick={handleRemoveFile}
                                                >
                                                    Remove
                                                </button>
                                            </form>

                                            {error && <p className="text-red-500">{error}</p>}

                                            <h4 className="font-normal text-[#b7b1b1] leading-5">Image formats with max
                                                size of 3MB</h4>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <form action="" method="post">
                                            <div className="flex items-center gap-[2rem] w-full my-5">
                                                <TextField className="w-full" id="txtfname" label="Full Name"
                                                           variant="outlined"/>

                                            </div>

                                            <div className="flex items-center gap-[2rem] w-full my-5">
                                                <TextField className="w-1/2" id="txtlocation" label="Location"
                                                           variant="outlined"/>
                                                <TextField
                                                    className="w-1/2"
                                                    id="date"
                                                    label="Date of Birth"
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </div>

                                            <div className="flex items-center gap-[2rem] w-full my-5">
                                                <TextField className="w-1/2" id="txtemail" label="Email"
                                                           variant="outlined"
                                                           value={user?.email || ''}
                                                />
                                                <TextField
                                                    className="w-1/2"
                                                    id="gender"
                                                    select
                                                    label="Gender"
                                                    value={gender}
                                                    onChange={(e) => setGender(e.target.value)}
                                                >
                                                    <MenuItem value="male">Male</MenuItem>
                                                    <MenuItem value="female">Female</MenuItem>
                                                    <MenuItem value="other">Other</MenuItem>
                                                </TextField>
                                            </div>

                                            <input type="button" value="Save Change"
                                                   className="bg-primary outline-none border-none text-white rounded-lg py-[12px] px-[27px] mt-[20px]"/>
                                        </form>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[10px] shadow-xl rounded-lg py-[30px] px-[40px]">
                                    <div className="mb-[30px]" id="socials_link">
                                        <h3>Social Networks</h3>
                                        <p className="leading-5">Connect your facebook, twitter and linkedin account to
                                            log in quickly.</p>
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        <span className="text-xl text-gray-400">Connect to Facebook</span>
                                        <div
                                            className="flex items-center rounded-lg bg-[#EEF9F2] justify-between border-2 py-[17px] px-[28px]">
                                            <div className="flex items-center w-[490px] gap-[10px]">
                                                <i className="fa-brands fa-square-facebook text-2xl text-primary"></i>
                                                <p className="text-[0.9em] text-[#63646b] pr-[130px]">You are
                                                    successfully connected to facebook. you can easily log in
                                                    using your facebook account.</p>
                                            </div>
                                            <button
                                                className="outline-none border-2 text-[#F65540] bg-[#FFEFF1] rounded-lg py-[9px] px-[39px]">Connect
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        <span className="text-xl text-gray-400">Connect to Twitter</span>
                                        <div
                                            className="flex items-center rounded-lg bg-[#EEF9F2] justify-between border-2 py-[17px] px-[28px]">
                                            <div className="flex items-center w-[490px] gap-[10px]">
                                                <i className="fa-brands fa-square-twitter text-2xl text-primary"></i>
                                                <p className="text-[0.9em] text-[#63646b] pr-[130px]">You are
                                                    successfully connected to twitter. you can easily log in
                                                    using your twitter account.</p>
                                            </div>
                                            <button
                                                className="outline-none border-2 text-[#F65540] bg-[#FFEFF1] rounded-lg py-[9px] px-[39px]">Connect
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[20px]">
                                        <span className="text-xl text-gray-400">Connect to Linkedin</span>
                                        <div
                                            className="flex items-center rounded-lg bg-[#EEF9F2] justify-between border-2 py-[17px] px-[28px]">
                                            <div className="flex items-center w-[490px] gap-[10px]">
                                                <i className="fa-brands fa-linkedin text-2xl text-primary"></i>
                                                <p className="text-[0.9em] text-[#63646b] pr-[130px]">You are
                                                    successfully connected to Linkedin. you can easily log in
                                                    using your account.</p>
                                            </div>
                                            <button
                                                className="outline-none border-2 text-[#F65540] bg-[#FFEFF1] rounded-lg py-[9px] px-[39px]">Connect
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div className="relative">
                                <div className="mb-[30px]">
                                    <h2 className="text-2xl text-center font-bold">Security</h2>
                                </div>
                                <div className="">
                                    <div className="">
                                        <div className="flex flex-col gap-[1rem]">
                                            <div>
                                                <details>
                                                    <summary> Login</summary>
                                                    <div className="flex items-center justify-between my-[10px]">
                                                        <div className="">
                                                            <h3>Password</h3>
                                                            <span className="text-[0.8em] text-gray-400 leading-3">Last updated 1 month ago</span>
                                                        </div>
                                                        <div
                                                            className="border-2 rounded-lg py-[8px] px-[10px] text-[#777E90]"
                                                            id="myBtn"
                                                            onClick={() => setModalIsOpen(true)}>
                                                            <span>Update password</span>
                                                        </div>
                                                    </div>
                                                </details>

                                                <Modal
                                                    isOpen={modalIsOpen}
                                                    onRequestClose={() => setModalIsOpen(false)}
                                                    style={{
                                                        overlay: {backgroundColor: "rgba(0, 0, 0, 0.5)"},
                                                        content: {
                                                            width: "30%",
                                                            margin: "100px auto",
                                                            padding: "20px",
                                                            borderRadius: "10px"
                                                        },
                                                    }}
                                                >
                                                    <div className="modal-content">
                                                        <div className="flex items-center justify-between">
                                                            <h3>Update Password</h3>
                                                            <button onClick={() => setModalIsOpen(false)}
                                                                    className="bg-primary border-none py-[5px] px-[10px] outline-none text-white rounded-lg">&times;</button>
                                                        </div>

                                                        <div className="flex flex-col gap-[30px] mt-[20px]">

                                                            <TextField className="w-[80%]" id="oldpass"
                                                                       label="Current password" type="password"/>
                                                            <TextField className="w-[80%]" id="newpass"
                                                                       label="New password" type="password"/>
                                                            <TextField className="w-[80%]" id="renewpass"
                                                                       label="Confirm password" type="password"/>

                                                            <button className="outline-none p-4 rounded-lg border-none bg-primary mt-[20px] text-white" type="submit">Save Change</button>

                                                        </div>
                                                    </div>

                                                </Modal>
                                            </div>
                                            <div className="">
                                                <details>
                                                    <summary> Device History</summary>
                                                    <p style={{marginTop: '20px'}}>Your access has not been processed
                                                        yet !</p>
                                                </details>
                                            </div>
                                            <div className="">
                                                <details>
                                                    <summary> Where You're Logged in ?</summary>
                                                    <p style={{marginTop: '20px'}}>Your access has not been processed
                                                        yet !</p>
                                                </details>
                                            </div>
                                            <div className="">
                                                <details>
                                                    <summary> Socials accounts</summary>
                                                    <h3>My Data Account</h3>
                                                    <p>You can manage your social media accounts here. Choose the method
                                                        of account you wish to use.</p>
                                                    <div className="data_select">
                                                        <div className="gmail">
                                                            <span>My account data linked to your Google account</span>
                                                            <i className="fa-solid fa-circle-check"></i>
                                                        </div>
                                                        <div className="facebook">
                                                            Facebook : <a
                                                            href="/profile-page/index.html#socials_link">unlinked</a>
                                                        </div>
                                                        <div className="twitter">
                                                            Twitter : <a
                                                            href="/profile-page/index.html#socials_link">unlinked</a>
                                                        </div>
                                                        <div className="linkedin">
                                                            LinkedIn : <a
                                                            href="/profile-page/index.html#socials_link">unlinked</a>
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                            <div className="help_section">
                                                <details>
                                                    <summary> Privacy and Security Information</summary>
                                                    <p>
                                                        1. <a href="#">Information collected:</a> This section should
                                                        clearly state what types of personal information the website
                                                        collects from its users. This may include basic contact
                                                        information like name, address, email address, phone number, and
                                                        payment information. It's important to be transparent about what
                                                        information is being collected and why.
                                                        <br/>
                                                        2. <a href="#">How the information is used:</a> This section
                                                        should explain how the collected information will be used. For
                                                        example, the website may use the information to complete
                                                        reservations, communicate with customers about their bookings,
                                                        and improve the website's functionality. It's important to be
                                                        specific about the purposes for which the information is being
                                                        used.
                                                        <br/>
                                                        3. <a href="#">Sharing of information:</a> This section should
                                                        specify if and when personal information will be shared with
                                                        third-party service providers, such as airlines or hotels. It's
                                                        important to be clear about what information will be shared and
                                                        with whom.
                                                        <br/>
                                                        4. <a href="#">Security measures:</a> This section should
                                                        describe the measures taken to protect users' personal
                                                        information. This may include the use of encryption, secure
                                                        servers, and other security measures. It's important to provide
                                                        users with confidence that their personal information is being
                                                        protected.
                                                        <br/>
                                                        5. <a href="#">Cookies:</a> This section should explain the use
                                                        of cookies and similar technologies. This may include what
                                                        information is collected, how it is used, and how users can
                                                        control or disable the use of cookies on the website.
                                                        <br/>
                                                        6. <a href="#">User rights:</a> This section should outline the
                                                        rights of users with respect to their personal information. This
                                                        may include the right to access, correct, or delete their
                                                        personal information, as well as the right to opt-out of certain
                                                        uses of their information.
                                                        <br/>
                                                        7. <a href="#">Updates to the policy:</a> This section should
                                                        explain how updates and changes to the policy will be
                                                        communicated to users. This may include notification via email
                                                        or on the website itself.
                                                    </p>
                                                </details>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'mytour' && (
                            <div className="" id="tbl">
                                <div className="mb-[30px]">
                                    <h2 className="text-2xl text-center font-bold">My tour</h2>
                                </div>
                                <table className="bg-[#fafafa] border-collapse border-spacing-0 rounded-lg text-center shadow-xl mt-[2rem] w-full">
                                    <thead>
                                    <tr>
                                        <th>Name tour</th>
                                        <th>Tour Code</th>
                                        <th>Departure</th>
                                        <th>Duration</th>
                                        <th>Place of departure</th>
                                    </tr>
                                    </thead>
                                </table>
                                <button id="btnDel" className="mt-[15px] border-none rounded-lg py-[10px] px-[20px] shadow-xl block text-sm bg-red-600 text-white">delete All</button>
                            </div>

                        )}

                        {activeSection === 'favourites' && (
                            <div className="" id="tbl">
                                <div className="mb-[30px]">
                                    <h2 className="text-2xl text-center font-bold">My favourites tour</h2>
                                </div>
                                <table className="bg-[#fafafa] border-collapse border-spacing-0 rounded-lg text-center shadow-xl mt-[2rem] w-full">
                                    <thead>
                                    <tr>
                                        <th>Name tour</th>
                                        <th>Tour Code</th>
                                    </tr>
                                    </thead>
                                </table>
                                <button id="btnDel" className="mt-[15px] border-none rounded-lg py-[10px] px-[20px] shadow-xl block text-sm bg-red-600 text-white">delete All</button>
                            </div>

                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Account;