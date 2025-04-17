import axios from 'axios';
import { handleApiError, formatSuccessResponse } from '../utils/apiErrorHandler';
const API_BASE_URL =  "http://localhost:8083/api";

export const getAllBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/booking`);
      return formatSuccessResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
};

// export const createBooking = (bookingRequest) => {
//     return axios.post(API_URL, bookingRequest);
// };

// export const getBooking = (id) => {
//     return axios.get(`${API_URL}/${id}`);
// };



export const updateBookingStatus = (id, status) => {
    return axios.patch(`${API_BASE_URL}/${id}/status`, null, {
        params: { status }
    });
};

// export const cancelBooking = (id, reason) => {
//     return axios.post(`${API_URL}/${id}/cancel`, null, {
//         params: { reason: reason || 'No reason provided' }
//     });
// };

// export const getBookingsByStatus = (status) => {
//     return axios.get(`${API_URL}/status/${status}`);
// };