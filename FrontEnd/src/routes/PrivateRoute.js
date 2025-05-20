import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/auth/sign_in" replace />;
    }

    if (!allowedRoles.includes(user.role?.roleName)) {
        // Nếu là ADMIN, chuyển hướng về /admin
        if (user.role?.roleName === "ADMIN") {
            return <Navigate to="/admin" replace />;
        }
        // Nếu là vai trò khác, chuyển hướng về trang chính
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;