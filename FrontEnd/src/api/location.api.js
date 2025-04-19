import axios from "axios"

const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/catalog/locations`;

export const getAllLocation = async () => {
    try {
        const response = await axios.get(apiUrl) // Use the correct API URL
        return response.data;
    } catch (error) {
        console.error("Error fetching all locations:", error)
        throw error
    }
};