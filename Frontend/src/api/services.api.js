import axios from "axios";

const apiURL = process.env.API_BASE_URL; 

export const getAllService = async () => {
    try {
        const response = await axios.get(`${apiURL}/api/services`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error; 
    }
};

export const getServiceById = async (id) => {
    try {
        const response = await axios.get(`${apiURL}/api/services/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with username ${id}:`, error);
        throw error; 
    }
};
