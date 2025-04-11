const Footer = () => {
    return (
        <footer>
            <div className="relative h-[400px] pt-[40px]">
                <div className="flex justify-evenly gap-[100px] mb-[60px]">
                    <div className="flex flex-col w-[250px]">
                        <div className="flex items-center gap-[10px]">
                            <img src="image/logo.png" alt=""/>
                            <span className="text-xl font-bold">Airtrav</span>
                        </div>
                        <p className="mt-[25px] leading-[30px]">Similarly, a loan taken out to buy a car may be secured by the car. The duration of the
                            loan.</p>
                        <div className="flex">
                            <label htmlFor="">
                                <input type="text" placeholder="Enter your email" className="p-[12px] rounded-2xl outline-none w-[250px] mt-[35px] relative pr-[50px] border-2 border-[#c7c5c5]"/>
                                {/*<i className="fa-solid fa-arrow-right absolute text-primary"></i>*/}
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl">Services</h3>
                        <ul className="mt-[20px] flex flex-col gap-[20px] text-[#777E90]">
                            <li><a href="#">Trip Planner</a></li>
                            <li><a href="#">Tour Planning</a></li>
                            <li><a href="#">Tour Guide</a></li>
                            <li><a href="#">Tour Package</a></li>
                            <li><a href="#">Tour Advice</a></li>
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl">Support</h3>
                        <ul className="mt-[20px] flex flex-col gap-[20px] text-[#777E90]">
                            <li><a href="#">Account</a></li>
                            <li><a href="#">Legal</a></li>
                            <li><a href="#">Contact</a></li>
                            <li><a href="#">Terms & Condition</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl">Business</h3>
                        <ul className="mt-[20px] flex flex-col gap-[20px] text-[#777E90]">
                            <li><a href="#">Success</a></li>
                            <li><a href="#">About Locate</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Information</a></li>
                            <li><a href="#">Travel Guide</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t-2 border-t-[#cbc9c9] p-[10px] my-0 mx-[120px]">
                    <div>
                        <p className="text-[#777E90] text-sm">Copyright© 2021 Airtrav LLC. All rights reserved</p>
                    </div>
                    <div className="flex items-center gap-[10px] text-[#777E90]">
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