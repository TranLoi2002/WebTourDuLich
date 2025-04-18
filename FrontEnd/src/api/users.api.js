import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// SIGN UP
export const signup = async (user) => {
    try {
        const response = await axios.post("http://localhost:8080/api/auth/register", user, {
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
