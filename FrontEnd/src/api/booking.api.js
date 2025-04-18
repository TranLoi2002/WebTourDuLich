import axios from 'axios';
import { handleApiError, formatSuccessResponse } from '../utils/apiErrorHandler';

const apiUrl =  process.env.REACT_APP_API_BASE_URL;

export const getAllBookings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/booking`);
      return formatSuccessResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
};
// export const getAllBookings = async () => {
//     try {
//         const response = await axios.get(`${apiUrl}/booking`);
//         return formatSuccessResponse(response);
//     } catch (error) {
//         return handleApiError(error);
//     }
// };

// export const getBooking = (id) => {
//     return axios.get(`${API_URL}/${id}`);
// };



export const updateBookingStatus = (id, status) => {
    return axios.patch(`${apiUrl}/${id}/status`, null, {
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