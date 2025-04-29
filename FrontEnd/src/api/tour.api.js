import axios from "axios";

const apiURL = `${process.env.REACT_APP_API_BASE_URL}/catalog/tours`;

// http://localhost:8080/api/catalog/tours?page=1&size=10&sortBy=id&sortDir=asc
export const getAllTour = async (page, size, sortBy, sortDir) => {
    try {
        const response = await axios.get(
            `${apiURL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all tours:", error);
        throw error;
    }
}

export const getDetailTour = async (id) => {
    try {
        const response = await axios.get(`${apiURL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tour details:", error);
        throw error;
    }
}

// http://localhost:8080/api/catalog/tours/activitytour/Nightlife
export const getTourByActivityType = async (activityType) => {
    try {
        const response = await axios.get(`${apiURL}/activitytour/${activityType}`);
        return response.data;
    } catch (e) {
        console.error("Error fetching tour by activity type:", e);
        throw e;
    }
}

// get review of tour
// http://localhost:8080/api/catalog/tours/1/reviews
export const getReviewOfTour = async (tourId) => {
    try {
        const response = await axios.get(`${apiURL}/${tourId}/reviews`);
        return response.data;
    } catch (e) {
        console.error("Error fetching review of tour:", e);
        throw e;
    }
}

// get tour by location id
// http://localhost:8083/catalog-service/api/catalog/tours/location/1
export const getTourByLocationId = async (locationId) => {
    try {
        const response = await axios.get(`${apiURL}/location/${locationId}`);
        return response.data;
    } catch (e) {
        console.error("Error fetching tour by location id:", e);
        throw e;
    }
}

// get related tour by location id
// http://localhost:8080/api/catalog/tours/related/1?excludeTourId=1&limit=5
export const getRelatedTourByLocationId = async (locationId, excludeTourId, limit) => {
    try {
        const response = await axios.get(`${apiURL}/related/${locationId}?excludeTourId=${excludeTourId}&limit=${limit}`);
        return response.data;
    } catch (e) {
        console.error("Error fetching related tour by location id:", e);
        throw e;
    }
}

// create new tour
export const createTour = async (tourData) => {
    try {
        const response = await axios.post(`${apiURL}`, tourData);
        return response.data;
    } catch (error) {
        console.error("Error creating tour:", error);
        throw error;
    }
}

// update tour
export const updateTour = async (id, tourData) => {
    try {
        const response = await axios.put(`${apiURL}/update/${id}`, tourData);
        return response.data;
    } catch (error) {
        console.error("Error updating tour:", error);
        throw error;
    }
}

// update tour status
export const updateTourStatuses = async () => {
    try {
        const response = await axios.get(`${apiURL}/update-tour-status`);
        return response.data;
    } catch (error) {
        console.error("Error updating tour statuses:", error);
        throw error;
    }
}