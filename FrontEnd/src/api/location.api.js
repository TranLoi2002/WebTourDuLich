import axios from "axios";
import { handleApiError, formatSuccessResponse } from '../utils/apiErrorHandler';
const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/catalog/locations`;

// http://localhost:8080/api/catalog/locations?page=0&size=10&sortBy=id&sortDir=asc
export const getAllLocation = async (page, size, sortBy, sortDir) => {
    try {
        const response = await axios.get(
            `${apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all locations:", error);
        throw error;
    }
}

export const createLocation = async (locationData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("location", JSON.stringify(locationData));

        const response = await axios.post(apiUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return formatSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};

export const updateLocation = async (id, newData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("location", JSON.stringify(newData));

        const response = await axios.put(`${apiUrl}/update/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return formatSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};

export const toggleLocationStatus = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/${id}`);
        return formatSuccessResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
};