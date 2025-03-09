import {Link} from "react-router-dom";

import logo from '../../assets/images/logo.png';

import imageMain from '../../assets/images/bgc_main_01.jpg';
import imageSignin from '../../assets/images/image_signin.jpg';

const Sign_Up = () => {
    return (
        <>
            <div className="image_main_signup">
                {/*<img src={imageMain} alt=""/>*/}
            </div>
            <div className="card_sign_up">
                <div className="sign-up-left">
                    <div className="logo_header">
                        <a href="../Main_Page/webMain.html" title="Back Home">
                            <img src={logo} alt=""/>
                            <span>Airtrav</span>
                        </a>
                    </div>
                    <h2>Get Started</h2>
                    <div className="forget">
                        <p>Don't have an account ? <Link to='/auth/sign_in'>Sign in</Link></p>
                    </div>
                    {/*<div class="select_socials">*/}
                    {/*    <div class="socials">*/}
                    {/*        <i class="fa-brands fa-google" ></i>*/}
                    {/*        <i class="fa-brands fa-facebook" ></i>*/}
                    {/*        <i class="fa-brands fa-twitter"></i>*/}
                    {/*    </div>*/}
                    {/*    <div class="sign-up-or"><span>or login with email</span></div>*/}
                    {/*</div>*/}


                    <form action="" className="infor">
                        <label for="" className="details">
                            <span>First Name   <span className="error" id="errfname" style={{color: 'red'}}>(*)</span></span>
                            <input type="text" placeholder="Enter your first name" id="fname"/>
                        </label>
                        <label for=""className="details">
                            <span>Last Name    <span className="error" id="errlname" style={{color: 'red'}}>(*)</span></span>
                            <input type="text" placeholder="Enter your last name" id="lname"/>
                        </label>
                        <label for=""className="details">
                            <span>Email        <span className="error" id="erremail" style={{color: 'red'}}>(*)</span></span>
                            <input type="email" placeholder="Email Address" id="email"/>
                        </label>
                        <label for=""className="details">
                            <span>Password     <span className="error" id="errpass" style={{color: 'red'}}>(*)</span></span>
                            <input type="password" placeholder="Password" id="pass"/>
                        </label>
                        <label for=""className="details">
                            <span>Confirm Password     <span className="error" id="errrepass" style={{color: 'red'}}>(*)</span></span>
                            <input type="password" placeholder="Password" id="repass"/>
                        </label>
                        <button type="submit" onclick="chk_regex()">Sign up</button>
                    </form>
                </div>


            </div>
        </>

    );
}

export default Sign_Up;