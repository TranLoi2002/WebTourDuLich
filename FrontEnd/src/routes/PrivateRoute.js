import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return <Navigate to="/auth/sign_in"/>;
    if (role && user.role.roleName !== role) return <Navigate to="/" />;

    return children;
};

export default PrivateRoute;
