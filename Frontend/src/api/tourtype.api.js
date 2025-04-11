import axios from "axios";

const apiURL = "http://localhost:8083/catalog-service/api/catalog/tour-types";

export const getAllTourType = async () => {
    try{
        const response = await axios.get(apiURL);
        return response.data;
    }catch(error){
        console.error("Error fetching all tour types:", error);
        throw error;
    }
};

// get all tour by tour type id
export const getTourByTourTypeId = async (tourTypeId) => {
    try{
        const response = await axios.get(`${apiURL}/${tourTypeId}/tours`);
        return response.data;
    }catch(error){
        console.error("Error fetching tours by tour type ID:", error);
        throw error;
    }
};