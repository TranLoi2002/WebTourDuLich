import axios from "axios";

export const getAllTourType = async () => {
    try{
        const response = await axios.get("http://localhost:8083/catalog-service/api/catalog/tour-types");
        return response.data;
    }catch(error){
        console.error("Error fetching all tour types:", error);
        throw error;
    }
};