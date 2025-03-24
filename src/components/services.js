import img_service1 from '../assets/images/services_01.png';
import img_service2 from '../assets/images/services_02.png';
import img_service3 from '../assets/images/services_03.png';
import img_service4 from '../assets/images/services_04.png';

const Services = () => {
    return (
        <div className="bg-primary flex flex-col items-center gap-[2rem] py-[3rem] px-[15rem]">
            <div className="flex flex-col items-center justify-center gap-[1rem]">
                <h1 className="text-white text-4xl font-bold" data-aos="fade-down">Airtrav Best Services</h1>
                <p className="text-white" data-aos="fade-up">Similarly, a loan taken out to buy a car may be secured by the car. The duration of the
                    loan.</p>
            </div>

            <div className="flex items-center gap-[2rem] w-full">
                <div className="bg-white w-[calc(25%-2rem)] h-[10rem] flex flex-col items-center justify-center rounded-lg" data-aos="fade-right">
                    <img src={img_service1} alt="" className="mb-[1rem]"/>
                    <h2>100,000</h2>
                    <p>Cities all over the world</p>
                </div>
                <div className="bg-white w-[calc(25%-2rem)] h-[10rem] flex flex-col items-center justify-center rounded-lg" data-aos="fade-right">
                    <img src={img_service2} alt="" className="mb-[1rem]"/>
                    <h2>100</h2>
                    <p>Cities all over the</p>
                </div>
                <div className="bg-white w-[calc(25%-2rem)] h-[10rem] flex flex-col items-center justify-center rounded-lg" data-aos="fade-left">
                    <img src={img_service3} alt="" className="mb-[1rem]"/>
                    <h2>1000</h2>
                    <p>Cities all over</p>
                </div>
                <div className="bg-white w-[calc(25%-2rem)] h-[10rem] flex flex-col items-center justify-center rounded-lg" data-aos="fade-left">
                    <img src={img_service4} alt="" className="mb-[1rem]"/>
                    <h2>5 star</h2>
                    <p>Cities all</p>
                </div>
            </div>
        </div>
    )
}

export default Services;