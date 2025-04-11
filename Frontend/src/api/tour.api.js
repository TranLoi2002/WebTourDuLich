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


// http://localhost:8083/catalog-service/api/catalog/tours/activitytour/Nightlife
export const getTourByActivityType = async (activityType) => {
    try{
        const response = await axios.get(`${apiURL}/activitytour/${activityType}`);
        return response.data;
    }catch (e) {
        console.error("Error fetching tour by activity type:", e);
        throw e;
    }
}

// get review of tour
// http://localhost:8083/catalog-service/api/catalog/tours/1/reviews
export const getReviewOfTour = async (tourId) => {
    try{
        const response = await axios.get(`${apiURL}/${tourId}/reviews`);
        return response.data;
    }catch (e) {
        console.error("Error fetching review of tour:", e);
        throw e;
    }
}

// get tour by location id
// http://localhost:8083/catalog-service/api/catalog/tours/location/1
export const getTourByLocationId = async (locationId) => {
    try{
        const response = await axios.get(`${apiURL}/location/${locationId}`);
        return response.data;
    }catch (e) {
        console.error("Error fetching tour by location id:", e);
        throw e;
    }
}
