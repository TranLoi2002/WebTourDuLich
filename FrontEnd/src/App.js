import {useEffect} from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import {LoadingProvider, useLoading} from "./utils/LoadingContext";
import LoadingOverlay from "./components/LoadingOverlay";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/header";
import Footer from "./components/footer";
import NotFound from "./pages/404";

import "./index.css";
import "./assets/styles/header.css";
import "./assets/styles/advert.css";
import "./assets/styles/book_easy.css";
import "./assets/styles/services.css";
import "./assets/styles/discover.css";
import "./assets/styles/footer.css";
import "./assets/styles/body.css";
import "./assets/styles/scrollbar.css";
import "./assets/styles/sign_in.css";
import "./assets/styles/sign_up.css";
import "./assets/styles/things_to_do.css";
import "./assets/styles/card_detail_tour.css";
import "./assets/styles/card_detail_blog.css";
import "./assets/styles/account.css";
import "./assets/styles/FAQ.css";
import "./assets/styles/help.css";
import "./assets/styles/LoadingOverlay.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

import Home from "./pages/home";
import SignIn from "./pages/auth/sign_in";
import SignUp from "./pages/auth/sign_up";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import ThingsToDo from "./pages/things_to_do";
import ResultTour from "./pages/resultTour";
import ConfirmBooking from "./pages/confirmBooking";
import ShowTours from "./pages/tour/show";
import DetailTour from "./pages/tour/detail";
import ViewAllLocations from "./pages/tour/Locations";
import LocationTours from "./components/LocationTours";
import ShowBlogs from "./pages/blog/show";
import BlogsByCategory from "./pages/blog/BlogsByCategory";
import Account from "./pages/account";
import FAQ from "./pages/FAQ";
import Help from "./pages/help";
import BlogDetail from "./pages/blog/detail";
import Dashboard from "./pages/admin/dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import VerifyOTP from "./pages/auth/verifyOTP";
import ChangePasswordModal from "./pages/auth/ChangePasswordModal";
import Payment from "./pages/Payment";

function App() {
    useEffect(() => {
        AOS.init();
    }, []);

    const location = useLocation();
    const {isLoading, setIsLoading} = useLoading();

    const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin user
    const isLoggedIn = !!user;
    const isAdmin = user?.role?.roleName === "ADMIN"; // Sửa: Kiểm tra roleName

    const hiddenFooterPaths = ["/auth/sign_in", "/auth/sign_up"];
    const showFooter = !hiddenFooterPaths.includes(location.pathname);
    const isAdminRoute = location.pathname.includes("admin");
    const showHeader = !isAdminRoute;
    const showFooterOnAdmin = !isAdminRoute && showFooter;

    useEffect(() => {
        setIsLoading(true);
        const handleLoad = () => {
            setIsLoading(false);
        };
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }, [setIsLoading]);

    // Nếu là ADMIN và truy cập trang không phải /admin, chuyển hướng về /admin
    // if (isAdmin && !location.pathname.includes("admin")) {
    //     return <Navigate to="/admin" replace/>;
    // }

    return (
        <div className="App">
            <LoadingOverlay isLoading={isLoading}/>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                containerStyle={{top: "100px"}}
            />

            {showHeader && <Header/>}


            <main style={{flexGrow: 1, paddingBottom: "50px"}}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute allowedRoles={["ADMIN"]}>
                                <Dashboard/>
                            </PrivateRoute>
                        }
                    />
                    {/* Các route auth */}
                    <Route path="/auth/sign_in" element={<SignIn/>}/>
                    <Route path="/auth/sign_up" element={<SignUp/>}/>
                    <Route path="/auth/forgotpassword" element={<ForgotPassword/>}/>
                    <Route path="/auth/resetpassword" element={<ResetPassword/>}/>
                    <Route path="/auth/verifyOTP" element={<VerifyOTP/>}/>
                    <Route
                        path="/auth/ChangePasswordModal"
                        element={
                            isLoggedIn ? (
                                <ChangePasswordModal/>
                            ) : (
                                <Navigate to="/auth/sign_in"/>
                            )

                        }
                    />
                    {/* Các route option */}
                    <Route path="/thingstodo" element={<ThingsToDo/>}/>
                    <Route path="/resulttour" element={<ResultTour/>}/>
                    <Route path="/confirmbooking" element={<ConfirmBooking/>}/>
                    <Route path="/payment/:id" element={<Payment/>}/>

                    {/* Tours */}
                    <Route path="/tours" element={<ShowTours/>}/>
                    <Route path="/tours/detailtour/:id" element={<DetailTour/>}/>
                    <Route path="/tours/location-tours" element={<LocationTours/>}/>
                    <Route
                        path="/tours/locations/viewall"
                        element={<ViewAllLocations/>}
                    />
                    {/* Blogs */}
                    <Route path="/blogs" element={<ShowBlogs/>}/>
                    <Route path="/blogs/detailblog/:id" element={<BlogDetail/>}/>
                    <Route
                        path="/blogs/category/:categoryId"
                        element={<BlogsByCategory/>}
                    />

                    <Route
                        path="/account"
                        element={
                            // Kiểm tra nếu người dùng đã đăng nhập
                            isLoggedIn ? (

                                <Account/>

                            ) : (
                                <Navigate to="/auth/sign_in"/>
                            )
                        }
                    />
                    {/* FAQ - Help */}
                    <Route path="/faq" element={<FAQ/>}/>
                    <Route path="/help" element={<Help/>}/>
                    {/* 404 */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </main>
            {showFooterOnAdmin && <Footer/>}
        </div>
    );
}

export default function AppWithRouter() {
    return (
        <LoadingProvider>
            <Router>
                <App/>
            </Router>
        </LoadingProvider>
    );
}