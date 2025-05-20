import Advert from "../components/advert";
import BookEasy from "../components/book_easy";
import Discover from "../components/discover";
import Services from "../components/services";
import React, {useState} from "react";
import Chatbot from "../components/Chatbot"

const Home = () => {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsChatbotOpen((prev) => !prev)}
                    className="fixed z-[99999] bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
                >
                    {isChatbotOpen ? <i className="fa-solid fa-xmark"></i> :
                        <i className="fa-solid fa-robot"></i>
                    }
                </button>
                {isChatbotOpen && <Chatbot/>}
            </div>
            <Advert/>
            <BookEasy/>
            <Services/>
            <Discover/>
        </>
    );
}
export default Home;