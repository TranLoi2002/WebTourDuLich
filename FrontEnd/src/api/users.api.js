import axios from "axios";

const apiURL = process.env.API_BASE_URL; 

export const getAllUser = async () => {
    try {
        const response = await axios.get(`${apiURL}/api/users`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error; 
    }
};

export const getUserByUserName = async (username) => {
    try {
        const response = await axios.get(`${apiURL}/api/users/${username}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with username ${username}:`, error);
        throw error; 
    }
};
export const getBookingByUserName = async (username) => {
    try {
        const response = await axios.get(`${apiURL}/api/bookings`, {
            params: { username }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching bookings for username ${username}:`, error);
        throw error; 
    }
};