import axios from "axios";

const apiURL = "http://localhost:8083/catalog-service/api/catalog/tours";

export const getAllTour = async () => {
    try{
        const response = await axios.get(apiURL);
        return response.data;
    }catch(error){
        console.error("Error fetching all tours:", error);
        throw error;
    }
};

export const getDetailTour = async (id) => {
    try{
        const response = await axios.get(`${apiURL}/${id}`);
        return response.data;
    }catch(error){
        console.error("Error fetching tour details:", error);
        throw error;
    }
}


