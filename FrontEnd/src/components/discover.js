import imgFeatures_01 from '../assets/images/Features_01.png'
import imgFeatures_02 from '../assets/images/Features_02.png';
import imgFeatures_03 from '../assets/images/Features_03.png';
import imgFeatures_04 from '../assets/images/Features_04.png';

const Discover = () => {
    return (

        <div className="relative py-[50px] px-[100px] bg-cyan-50">
            <h2 data-aos="fade-up" className="text-center text-4xl font-bold ">Discover our Features</h2>

            <div className="grid grid-cols-[repeat(2,_30%)] mt-[50px] justify-center gap-x-[300px] gap-y-[50px]">
                <div
                    className="group details_discover"
                    data-aos="fade-right">
                    <div className="flex items-center gap-[10px] text-xl font-bold">
                        <img src={imgFeatures_01} alt=""/>
                        <span>Share Your Travel Plan</span>
                    </div>
                    <p className="font-normal mr-[10px] leading-[30px]">Ticket is an ultra-convenient way to buy your train or bus ticket online in seconds.</p>
                </div>
                <div className="group details_discover" data-aos="fade-left">
                    <div className="flex items-center gap-[10px] text-xl font-bold">
                        <img src={imgFeatures_02} alt=""/>
                        <span>Get Monthly Tour</span>
                    </div>
                    <p className="font-normal mr-[10px] leading-[30px]">Our Get Monthly Tours marketing package will help get more clients in your photography
                        business.</p>
                </div>
                <div className="group details_discover" data-aos="fade-right">
                    <div className="flex items-center gap-[10px] text-xl font-bold">
                        <img src={imgFeatures_03} alt=""/>
                        <span>Receive Ticket</span>
                    </div>
                    <p className="font-normal mr-[10px] leading-[30px]">The Receive plan Ticket will allow you to travel freely. You will be able to get in any
                        location.</p>
                </div>
                <div className="group details_discover" data-aos="fade-left">
                    <div className="flex items-center gap-[10px] text-xl font-bold">
                        <img src={imgFeatures_04} alt=""/>
                        <span>Flight Booking</span>
                    </div>
                    <p className="font-normal mr-[10px] leading-[30px]">Flight Booking is an ultra-convenient way to buy your train or bus ticket in seconds.</p>
                </div>
            </div>
        </div>
    );
}

export default Discover;
