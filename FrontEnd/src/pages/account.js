import React , {useState} from 'react';
import Modal from 'react-modal'

const Account = () => {
    const [activeSection, setActiveSection] = useState('account');

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


    return (
        <div className="account_container">
            <div className="account-setting">

                <div className="acc_content">
                    <div className="acc_left">
                        <div className="card_select">
                            <label htmlFor="" className="choice_acc"
                                   style={{backgroundColor: activeSection === 'account' ? '#EBF1FF' : ''}}
                                   onClick={() => setActiveSection('account')}>
                                <i className="fa-regular fa-user"></i>
                                <span>Account Setting</span>
                            </label>
                            <label htmlFor="" className="choice_pri"
                                   style={{backgroundColor: activeSection === 'security' ? '#EBF1FF' : ''}}
                                   onClick={changeSectionSecurity}>
                                <i className="fa-solid fa-lock"></i>
                                <span>Privacy & Security</span>
                            </label>
                            <label htmlFor="" className="choice_tr"
                                   style={{backgroundColor: activeSection === 'mytour' ? '#EBF1FF' : ''}}
                                   onClick={changeSectionMyTour}>
                                <i className="fa-solid fa-plane tour"></i>
                                <span>My tour</span>
                            </label>
                            <label htmlFor="" className="choice_favourite"
                                   style={{backgroundColor: activeSection === 'favourites' ? '#EBF1FF' : ''}}
                                   onClick={changeSectionFavouritesTour}>
                                <i className="fa-solid fa-heart tour"></i>
                                <span>Favourite tour</span>
                            </label>
                        </div>
                    </div>

                    <div className="acc_right">
                        {activeSection === 'account' && (

                            <div className="card_profile">
                                <div className="acc_title">
                                    <h2>Account Setting</h2>
                                </div>
                                <div className="infor">
                                    <h3>My profile</h3>
                                    <div className="details">
                                        <div className="image_user">
                                            <img src="image/mask-group@2x.png" alt="" id="avt"/>
                                        </div>
                                        <div className="load_infor">
                                            <form action="" method="post" className="details_load">
                                                <input type="file" name="" id="file"/>
                                                <label htmlFor="file">Upload file</label>
                                                <button type="reset">Remove</button>
                                            </form>
                                            <h4>Image formats with max size of 3mb</h4>
                                        </div>
                                    </div>
                                    <div className="infor_acc">
                                        <form action="" method="post">
                                            <div className="name">
                                                <label htmlFor="">
                                                    <span>First Name</span>
                                                    <input type="text" placeholder="Alex" id="txtfname"/>
                                                </label>
                                                <label htmlFor="">
                                                    <span>Last Name</span>
                                                    <input type="text" placeholder="Mecheal" id="txtlname"/>
                                                </label>
                                            </div>

                                            <div className="locate">
                                                <label htmlFor="">
                                                    <span>Location</span>
                                                    <input type="text" placeholder="Alex" id="txtLocation"/>
                                                </label>
                                                <label htmlFor="">
                                                    <span>Date Of Birth</span>
                                                    <input type="date" placeholder="12/12/2012" id="txtDOB"/>
                                                </label>
                                            </div>

                                            <div className="email">
                                                <label htmlFor="">
                                                    <span>Email Address</span>
                                                    <input type="text" placeholder="Alex" id="txtemail"/>
                                                </label>
                                                <label htmlFor="">
                                                    <span>Gender ( M / F )</span>
                                                    <input type="text" placeholder="Male" id="txtGender"/>
                                                </label>
                                            </div>

                                            <input type="button" value="Save Change" onClick="saveInfor()"/>
                                        </form>
                                    </div>
                                </div>
                                <div className="social">
                                    <div className="social_title" id="socials_link">
                                        <h3>Social Networks</h3>
                                        <p>Connect your facebook, twitter and linkedin account to log in quickly.</p>
                                    </div>
                                    <div className="face_book">
                                        <span>Connect to Facebook</span>
                                        <label htmlFor="">
                                            <div className="fb_connect">
                                                <i className="fa-brands fa-square-facebook"></i>
                                                <p>You are successfully connected to facebook. you can easily log in
                                                    using your facebook account.</p>
                                            </div>
                                            <button>Connect</button>
                                        </label>
                                    </div>
                                    <div className="twitter">
                                        <span>Connect to Twitter</span>
                                        <label htmlFor="">
                                            <div className="fb_connect">
                                                <i className="fa-brands fa-square-twitter"></i>
                                                <p>You are successfully connected to twitter. you can easily log in
                                                    using your twitter account.</p>
                                            </div>
                                            <button>Connect</button>
                                        </label>
                                    </div>
                                    <div className="linkedin">
                                        <span>Connect to Linkedin</span>
                                        <label htmlFor="">
                                            <div className="fb_connect">
                                                <i className="fa-brands fa-linkedin"></i>
                                                <p>You are successfully connected to Linkedin. you can easily log in
                                                    using your account.</p>
                                            </div>
                                            <button>Connect</button>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'security' && (
                            <div class="privacy-container">
                                <div class="acc_title">
                                    <h2>Security</h2>
                                </div>
                                <div class="acc_content">
                                    <div class="acc_right">
                                        <div class="sec_content" style={{display: 'flex',flexDirection:'column',gap:'1rem'}}>
                                            <div class="login_section">
                                                <details>
                                                    <summary> Login </summary>
                                                    <div class="pass_title">
                                                        <div class="pass_left">
                                                            <h3>Password</h3>
                                                            <span>Last updated 1 month ago</span>
                                                        </div>
                                                        <div class="pass_right" id="myBtn" onClick={() => setModalIsOpen(true)}>
                                                            <span >Update password</span>
                                                        </div>
                                                    </div>
                                                </details>

                                                <Modal
                                                    isOpen={modalIsOpen}
                                                    onRequestClose={() => setModalIsOpen(false)}
                                                    style={{
                                                        overlay: {backgroundColor: "rgba(0, 0, 0, 0.5)"},
                                                        content: {
                                                            width: "50%",
                                                            margin: "100px auto",
                                                            padding: "20px",
                                                            borderRadius: "10px"
                                                        },
                                                    }}
                                                >
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h3>Update Password</h3>
                                                            <button onClick={() => setModalIsOpen(false)}
                                                                    className="close">&times;</button>
                                                        </div>

                                                        <div className="pass">
                                                            <form action="">
                                                                <label htmlFor="">
                                                                    <span>Current password</span>
                                                                    <input type="email" value="ulto@22" id="oldpass"/>
                                                                </label>
                                                                <label htmlFor="">
                                                                    <span>New password</span>
                                                                    <input type="password" value="ulto@22"
                                                                           id="newpass"/>
                                                                </label>
                                                                <label htmlFor="">
                                                                    <span>Confirm password</span>
                                                                    <input type="password" value="ulto@22"
                                                                           id="renewpass"/>
                                                                </label>
                                                                <button type="submit">Save Change</button>
                                                            </form>
                                                        </div>
                                                    </div>

                                                </Modal>
                                            </div>
                                            <div class="his_section">
                                                <details>
                                                    <summary> Device History</summary>
                                                    <p style={{marginTop: '20px'}}>Your access has not been processed
                                                        yet !</p>
                                                </details>
                                            </div>
                                            <div class="logged_section">
                                                <details>
                                                    <summary> Where You're Logged in ?</summary>
                                                    <p style={{marginTop: '20px'}}>Your access has not been processed
                                                        yet !</p>
                                                </details>
                                            </div>
                                            <div class="socials_section">
                                                <details>
                                                    <summary> Socials accounts</summary>
                                                    <h3>My Data Account</h3>
                                                    <p>You can manage your social media accounts here. Choose the method of account you wish to use.</p>
                                                    <div class="data_select">
                                                        <div class="gmail">
                                                            <span>My account data linked to your Google account</span>
                                                            <i class="fa-solid fa-circle-check"></i>
                                                        </div>
                                                        <div class="facebook">
                                                            Facebook : <a href="/profile-page/index.html#socials_link">unlinked</a>
                                                        </div>
                                                        <div class="twitter">
                                                            Twitter : <a href="/profile-page/index.html#socials_link">unlinked</a>
                                                        </div>
                                                        <div class="linkedin">
                                                            LinkedIn : <a href="/profile-page/index.html#socials_link">unlinked</a>
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                            <div class="help_section">
                                                <details>
                                                    <summary> Privacy and Security Information</summary>
                                                    <p>
                                                        1. <a href="#">Information collected:</a> This section should clearly state what types of personal information the website collects from its users. This may include basic contact information like name, address, email address, phone number, and payment information. It's important to be transparent about what information is being collected and why.
                                                        <br/>
                                                            2. <a href="#">How the information is used:</a> This section should explain how the collected information will be used. For example, the website may use the information to complete reservations, communicate with customers about their bookings, and improve the website's functionality. It's important to be specific about the purposes for which the information is being used.
                                                            <br/>
                                                                3. <a href="#">Sharing of information:</a> This section should specify if and when personal information will be shared with third-party service providers, such as airlines or hotels. It's important to be clear about what information will be shared and with whom.
                                                                <br/>
                                                                    4. <a href="#">Security measures:</a> This section should describe the measures taken to protect users' personal information. This may include the use of encryption, secure servers, and other security measures. It's important to provide users with confidence that their personal information is being protected.
                                                                    <br/>
                                                                        5. <a href="#">Cookies:</a> This section should explain the use of cookies and similar technologies. This may include what information is collected, how it is used, and how users can control or disable the use of cookies on the website.
                                                                        <br/>
                                                                            6. <a href="#">User rights:</a> This section should outline the rights of users with respect to their personal information. This may include the right to access, correct, or delete their personal information, as well as the right to opt-out of certain uses of their information.
                                                                            <br/>
                                                                                7. <a href="#">Updates to the policy:</a> This section should explain how updates and changes to the policy will be communicated to users. This may include notification via email or on the website itself.
                                                    </p>
                                                </details>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'mytour' && (
                            <div className="tbl-trip" id="tbl">
                                <div className="acc_title">
                                    <h2>My tour</h2>
                                </div>
                                <table id="tbl-tour">
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
                                <button id="btnDel">delete All</button>
                            </div>

                        )}

                        {activeSection === 'favourites' && (
                            <div className="tbl-trip" id="tbl">
                                <div className="acc_title">
                                    <h2>My tour</h2>
                                </div>
                                <table id="tbl-tour">
                                    <thead>
                                    <tr>
                                        <th>Name tour</th>
                                        <th>Tour Code</th>
                                    </tr>
                                    </thead>
                                </table>
                                <button id="btnDel">delete All</button>
                            </div>

                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Account;