import {Link} from "react-router-dom";

import logo from '../../assets/images/logo.png';

import imageMain from '../../assets/images/bgc_main_01.jpg';
import imageSignin from '../../assets/images/image_signin.jpg';

import {Box, Button, TextField} from '@mui/material';

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

                    <Box className="infor">
                        <TextField id="fname" label="First Name" variant="outlined" fullWidth/>
                        <TextField id="lname" label="Last Name" variant="outlined" fullWidth/>
                        <TextField id="email" label="Email" variant="outlined" fullWidth/>
                        <TextField id="phone" label="Phone Number" variant="outlined" fullWidth/>
                        <TextField id="password" label="Password" variant="outlined" fullWidth/>

                        <button type="submit" onclick="chk_regex()">Sign up</button>
                    </Box>
                </div>


            </div>
        </>

    );
}

export default Sign_Up;