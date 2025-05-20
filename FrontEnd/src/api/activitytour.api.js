import axios from "axios";
import { handleApiError, formatSuccessResponse } from '../utils/apiErrorHandler';
const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/catalog/activity-types`;


// get tour have activity tour and activity type
// http://localhost:8080/api/catalog/activity-types?page=0&size=10&sortBy=id&sortDir=asc
export const getActivityType = async (page, size, sortBy, sortDir) => {
    try {
        const response = await axios.get(
            `${apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}
export const createActivityTypee = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}`, data);
        return formatSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};
export const updateActivityType = async (id,newData) => {
    try {
        const response = await axios.put(`${apiUrl}/update/${id}`, newData);
        return formatSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};
export const toggleActivityType = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/${id}`);
        return formatSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};