import {useEffect} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";


import Header from "./components/header";
import Footer from "./components/footer";

// import './index.css';
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
import Sign_In from "./pages/auth/sign_in";
import Sign_Up from "./pages/auth/sign_up";
import Things_to_do from "./pages/things_to_do";
import Show_tours from "./pages/tour/show";
import Detail_tour from "./pages/tour/detail";
import Show_blogs from "./pages/blog/show";
// import Detail_blog from "./pages/blog/detail";
import Account from "./pages/account";
import FAQ from './pages/FAQ'
import Help from './pages/help'


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
          <main style={{flexGrow: 1,paddingBottom:'50px'}}>
              <Routes>
                  <Route path="/" element={<Home/>}/>
                  {/*auth*/}
                  <Route path="/auth/sign_in" element={<Sign_In/>}/>
                  <Route path="/auth/sign_up" element={<Sign_Up/>}/>
                  {/*option*/}
                  <Route path="/things_to_do" element={<Things_to_do/>}/>
                  {/*option - tours*/}
                  <Route path="/tours" element={<Show_tours/>}/>
                  <Route path="/tours/detail_tour" element={<Detail_tour/>}/>
                    {/*option - blog*/}
                  <Route path="/blogs" element={<Show_blogs/>}/>
                  {/*<Route path="/blogs/detail_blog" element={<Detail_blog/>}/>*/}
                  {/*account*/}
                  <Route path="/account" element={<Account/>}/>
                  {/*FAQ - Help*/}
                  <Route path="/faq" element={<FAQ/>}/>
                  <Route path="/help" element={<Help/>}/>

              </Routes>
          </main>
          {showFooter && <Footer/>}
      </div>
  );
}

export default function AppWithRouter() {
    return (
        <Router>
            <App />
        </Router>
    );
}
