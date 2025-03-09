import imgFeatures_01 from '../assets/images/Features_01.png'
import imgFeatures_02 from '../assets/images/Features_02.png';
import imgFeatures_03 from '../assets/images/Features_03.png';
import imgFeatures_04 from '../assets/images/Features_04.png';

const Discover = () => {
    return (
        <div className="discorver_container">
            <h2 data-aos="fade-up">Discover our Features</h2>
            <div className="discover_content">
                <div className="details_discover" data-aos="fade-right">
                    <div className="share">
                        <img src={imgFeatures_01} alt=""/>
                            <span>Share Your Travel Plan</span>
                    </div>
                    <p>Ticket is an ultra-convenient way to buy your train or bus ticket online in seconds.</p>
                </div>
                <div className="details_discover" data-aos="fade-left">
                    <div className="get">
                        <img src={imgFeatures_02} alt=""/>
                            <span>Get Monthly Tour</span>
                    </div>
                    <p>Our Get Monthly Tours marketing package will help get more clients in your photography business.</p>
                </div>
                <div className="details_discover" data-aos="fade-right">
                    <div className="receive">
                        <img src={imgFeatures_03} alt=""/>
                            <span>Receive Ticket</span>
                    </div>
                    <p>The Receive plan Ticket will allow you to travel freely. You will be able to get in any location.</p>
                </div>
                <div className="details_discover" data-aos="fade-left">
                    <div className="flight">
                        <img src={imgFeatures_04} alt=""/>
                            <span>Flight Booking</span>
                    </div>
                    <p>Flight Booking is an ultra-convenient way to buy your train or bus ticket in seconds.</p>
                </div>
            </div>
        </div>
    );
}

export default Discover;
