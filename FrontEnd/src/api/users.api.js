// user.api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// SIGNUP
export const signup = async (user) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, user, {
        withCredentials: true,
    });
    return response.data;
};
//LOGIN
export const loginUser = (loginData) => {
    return axios.post(`${API_BASE_URL}/api/auth/login`, loginData, {
      withCredentials: true, // Nếu dùng cookie
    });
  };
