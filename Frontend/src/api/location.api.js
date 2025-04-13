import axios from "axios"

const API_URL = "http://localhost:8083/api/catalog/locations";

export const getAllLocation = async () => {
    try {
        const response = await axios.get(`${API_URL}`) // Use the correct API URL
        return response.data;
    } catch (error) {
        console.error("Error fetching all locations:", error)
        throw error
    }
};