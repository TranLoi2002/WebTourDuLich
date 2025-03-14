import {Link} from "react-router-dom";
import Checkbox from "@mui/material/Checkbox"

import imageMain from '../../assets/images/bgc_main.jpg';
import logo from '../../assets/images/logo.png'
import imageWomen from '../../assets/images/women.jpg'

import {TextField, Box, Button} from "@mui/material";


const Sign_In = () => {
    return (
        <>
            <div className="image_main_login">
                {/*<img src={imageMain} alt=""/>*/}
            </div>
            <div className="card-sign-in">
                <div className="sign-in-left">
                    <div className="sign-in-brand">
                        <a href="../Main_Page/webMain.html" title="Back Home">
                            <img src={logo} alt="" className="logo"/>
                            <span>Airtrav</span>
                        </a>

                    </div>
                    <h2>Welcome Back</h2>
                    <h3 style={{fontSize:'1rem',fontWeight:'normal',color:'lightgray'}}>Please enter your details.</h3>
                    <Box className="form_sign_in">
                        <TextField id="email" label="Email" variant="outlined" fullWidth/>
                        <TextField id="password" label="Password" variant="outlined" fullWidth/>
                        <div className="section_remem_forgot">
                            <label style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                <Checkbox />
                                <span>Remember me</span>
                            </label>
                            <Link to="/auth/forgotpassword" style={{fontSize:'0.8rem',color:'#3B71FE',textDecoration:'none'}}>Forgot your password ?</Link>
                        </div>

                        <button className="sign-in-login" type="button" onClick="chk_user()">LOGIN</button>
                    </Box>
                    <div className="sign-in-or open" id="choiceSocials">
                    <span title="Click to choose method about your login">OR</span>
                    </div>
                    <div className="sign-in-choice">
                        <div className="sign-in-btn">
                            <button type="button" className="sign-in-button">
                                <i className="fa-brands fa-google" style={{color: 'red'}}></i>
                                {/*<a href="">Continue with Google</a>*/}
                            </button>
                        </div>
                        <div className="sign-in-btn">
                            <button type="button" className="sign-in-button">
                                <i className="fa-brands fa-facebook" style={{color: 'rgb(38, 94, 216)'}}></i>
                                {/*<a href="">Continue with Facebook</a>*/}
                            </button>
                        </div>
                        <div className="sign-in-btn">
                            <button className="sign-in-button">
                                <i className="fa-brands fa-twitter" style={{color: 'rgb(22, 206, 216)'}}></i>
                                {/*<a href="">Continue with Twitter</a>*/}
                            </button>
                        </div>
                    </div>

                    <div className="sign-in-ques">
                        <div className="ques_senten">
                            <span> Don't have an account?</span>
                            <Link to='/auth/sign_up'> Sign up</Link>
                        </div>
                        {/*<a style={{fontWeight:'normal',color:'red', fontSize:'14px'}}>Forgot your password</a>*/}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sign_In;