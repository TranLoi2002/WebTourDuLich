const Footer = () => {
    return (
        <footer>
            <div className="footer_container">
                <div className="footer_content">
                    <div className="footer_infor">
                        <div className="logo_infor">
                            <img src="image/logo.png" alt=""/>
                            <span>Airtrav</span>
                        </div>
                        <p>Similarly, a loan taken out to buy a car may be secured by the car. The duration of the
                            loan.</p>
                        <div className="input_footer">
                            <label htmlFor="" className="input_email">
                                <input type="text" placeholder="Enter your email"/>
                                <i className="fa-solid fa-arrow-right"></i>
                            </label>
                        </div>
                    </div>
                    <div className="footer_service">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="#">Trip Planner</a></li>
                            <li><a href="#">Tour Planning</a></li>
                            <li><a href="#">Tour Guide</a></li>
                            <li><a href="#">Tour Package</a></li>
                            <li><a href="#">Tour Advice</a></li>
                        </ul>
                    </div>
                    <div className="footer_support">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">Account</a></li>
                            <li><a href="#">Legal</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Terms & Condition</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="footer_business">
                        <h3>Business</h3>
                        <ul>
                            <li><a href="#">Success</a></li>
                            <li><a href="#">About Locate</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Information</a></li>
                            <li><a href="#">Travel Guide</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer_socials">
                    <div className="adds_social">
                        <p>Copyright© 2021 Airtrav LLC. All rights reserved</p>
                    </div>
                    <div className="list_socials">
                        <i className="fa-brands fa-square-facebook"></i>
                        <i className="fa-brands fa-linkedin"></i>
                        <i className="fa-brands fa-square-twitter"></i>
                        <i className="fa-brands fa-square-instagram"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;