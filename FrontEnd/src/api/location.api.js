import axios from "axios"

const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/catalog/locations`;

// http://localhost:8080/api/catalog/locations?page=0&size=10&sortBy=id&sortDir=asc
export const getAllLocation = async (page, size, sortBy, sortDir) => {
    try {
<<<<<<< HEAD
        const response = await axios.get(apiUrl) // Use the correct API URL
=======
        const response = await axios.get(
            `${apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
        return response.data;
    } catch (error) {
        console.error("Error fetching all locations:", error);
        throw error;
    }
}