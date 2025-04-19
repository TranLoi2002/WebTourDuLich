import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin user từ localStorage

    if (!user || !allowedRoles.includes(user.role?.roleName)) {
        return <Navigate to="/auth/sign_in" replace />; // Chuyển hướng nếu không có quyền
    }

    return children;
};

export default PrivateRoute;