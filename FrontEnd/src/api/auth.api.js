import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// SIGN UP
export const requestOTP = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/request-otp`, user, {

            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};

// Xác thực OTP
export const verifyOTP = async(email,otp)=>{
    try{
        const response = await axios.post(`${API_BASE_URL}/auth/verify-otp?email=${email}&otp=${otp}`, {
            withCredentials: true,
        });
        console.log(response);
    }catch(error){
        throw error.message;
    }
}

// LOGIN
export const login = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};

// LOGOUT
export const logout = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};

// VERIFY USER
export const verifyUser = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/verifyUser`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};

// GET USER BY ID
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};

// Gửi OTP quên mật khẩu
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Không thể gửi OTP" };
    }
};

// Đặt lại mật khẩu mới sau khi xác thực OTP
export const resetPassword = async ({ email, otp, newPassword }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
            email,
            otp,
            newPassword
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Đặt lại mật khẩu thất bại" };
    }
};
// Đổi mật khẩu
export const changePassword = async (data) => {
    return await axios.post(
        `${API_BASE_URL}/auth/change-password`,
        data,
        {
            withCredentials: true, // Bắt buộc để gửi cookie (jwtToken, refreshToken)
        }
    );
};
