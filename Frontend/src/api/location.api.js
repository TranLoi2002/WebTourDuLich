import axios from "axios"

export const getAllLocation = async () => {
    try {
        const response = await axios.get("http://localhost:8083/catalog-service/api/catalog/locations")
        return response.data;
    } catch (error) {
        console.error("Error fetching all locations:", error)
        throw error
    }
};