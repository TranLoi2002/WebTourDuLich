import axios from "axios";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}/catalog/tour-types`;


// http://localhost:8080/api/catalog/tour-types?page=0&size=10&sortBy=id&sortDir=asc
export const getAllTourType = async (page, size, sortBy, sortDir) => {
    try {
        const response = await axios.get(
            `${apiURL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all tour types:", error);
        throw error;
    }

}


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