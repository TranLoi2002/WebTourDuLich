import axios from "axios";

const API_BASE_URL = "http://localhost:8085";

// SIGN UP
export const signup = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, user, {
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
// LOGIN
export const logout = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};