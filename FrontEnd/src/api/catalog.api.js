import axios from "axios";

const apiURL = process.env.API_BASE_URL || "http://localhost:8080/api"; 

export const getAllTour = async () => {
    try {
        const response = await axios.get(`${apiURL}/catalog/tours`);
        // console.log(response.data)
        return response.data; 
    } catch (error) {
        console.error("Error fetching all tour:", error);
        throw error; 
    }
};

// export const getServiceById = async (id) => {
//     try {
//         const response = await axios.get(`${apiURL}/api/services/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error(`Error fetching user with username ${id}:`, error);
//         throw error; 
//     }
// };
