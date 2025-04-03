import {useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";


import Header from "./components/header";
import Footer from "./components/footer";
import NotFound from "./pages/404";

import './index.css';
import './assets/styles/header.css'
import './assets/styles/advert.css'
import './assets/styles/book_easy.css'
import './assets/styles/services.css'
import './assets/styles/discover.css'
import './assets/styles/footer.css'
import './assets/styles/body.css'
import './assets/styles/scrollbar.css'
import './assets/styles/sign_in.css'
import './assets/styles/sign_up.css'
import './assets/styles/things_to_do.css'
import './assets/styles/card_detail_tour.css'
import './assets/styles/card_detail_blog.css'
import './assets/styles/account.css'
import './assets/styles/FAQ.css'
import './assets/styles/help.css'

import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from "./pages/home";
import SignIn from "./pages/auth/sign_in";
import SignUp from "./pages/auth/sign_up";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import ThingsToDo from "./pages/things_to_do";
import ResultTour from "./pages/resultTour";
import ConfirmBooking from './pages/confirmBooking';
import ShowTours from "./pages/tour/show";
import DetailTour from "./pages/tour/detail"
import ShowBlogs from "./pages/blog/show";
import Account from "./pages/account";
import FAQ from './pages/FAQ';
import Help from './pages/help';
import BlogDetail from "./pages/blog/detail";


function App() {
    useEffect(() => {
        AOS.init();
    }, []);

    const location = useLocation();
    const hiddenFooterPaths = ['/auth/sign_in', '/auth/sign_up'];
    // Kiểm tra nếu đường dẫn hiện tại không nằm trong mảng hiddenFooterPaths
    const showFooter = !hiddenFooterPaths.includes(location.pathname);

    return (
        <div className="App">
            <Header/>
            <main style={{flexGrow: 1, paddingBottom: '50px'}}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    {/*auth*/}
                    <Route path="/auth/sign_in" element={<SignIn/>}/>
                    <Route path="/auth/sign_up" element={<SignUp/>}/>
                    <Route path="/auth/forgotpassword" element={<ForgotPassword/>}/>
                    <Route path="/auth/resetpassword" element={<ResetPassword/>}/>
                    {/*option*/}
                    <Route path="/thingstodo" element={<ThingsToDo/>}/>
                    <Route path="/resulttour" element={<ResultTour/>}/>
                    <Route path="/confirmbooking" element={<ConfirmBooking/>}/>
                    {/*option - tours*/}
                    <Route path="/tours" element={<ShowTours/>}/>
                    <Route path="/tours/detailtour" element={<DetailTour/>}/>
                    {/*option - blog*/}
                    <Route path="/blogs" element={<ShowBlogs/>}/>
                    <Route path="/blogs/detail_blog" element={<BlogDetail/>}/>
                    {/*account*/}
                    <Route path="/account" element={<Account/>}/>
                    {/*FAQ - Help*/}
                    <Route path="/faq" element={<FAQ/>}/>
                    <Route path="/help" element={<Help/>}/>
                    {/*404*/}
                    <Route path="*" element={<NotFound/>}/>

                </Routes>
            </main>
            {showFooter && <Footer/>}
        </div>
    );
}

export default function AppWithRouter() {
    return (
        <Router>
            <App/>
        </Router>
    );
}
