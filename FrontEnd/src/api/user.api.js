import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user`,{
            withCredentials: true,
        });
        return response;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};
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
export const updateUser = async (userId, userData) => {
    // try {
    //   const response = await axios.patch(`${API_BASE_URL}/user/${userId}`, userData, {
    //     withCredentials: true,
    //   });
    //   return response.data;
    // } catch (error) {
    //   throw error.response?.data || { error: "Something went wrong" };
    // }
  };