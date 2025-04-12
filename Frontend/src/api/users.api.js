import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// SIGN UP
export const signup = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, user, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};

// LOGIN
export const login = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};
