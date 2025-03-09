import img_service1 from '../assets/images/services_01.png';
import img_service2 from '../assets/images/services_02.png';
import img_service3 from '../assets/images/services_03.png';
import img_service4 from '../assets/images/services_04.png';

const Services = () => {
    return (
        <div className="services_container">
            <div className="services_top">
                <h1 className="services_top_title" data-aos="fade-down">Airtrav Best Services</h1>
                <p className="services_top_slogan" data-aos="fade-up">Similarly, a loan taken out to buy a car may be secured by the car. The duration of the
                    loan.</p>
            </div>

            <div className="services_content">
                <div className="card" data-aos="fade-right">
                    <img src={img_service1} alt=""/>
                    <h2>100,000</h2>
                    <p>Cities all over the world</p>
                </div>
                <div className="card" data-aos="fade-right">
                    <img src={img_service2} alt=""/>
                    <h2>100</h2>
                    <p>Cities all over the</p>
                </div>
                <div className="card" data-aos="fade-left">
                    <img src={img_service3} alt=""/>
                    <h2>1000</h2>
                    <p>Cities all over</p>
                </div>
                <div className="card" data-aos="fade-left">
                    <img src={img_service4} alt=""/>
                    <h2>5 star</h2>
                    <p>Cities all</p>
                </div>
            </div>
        </div>
    )
}

export default Services;