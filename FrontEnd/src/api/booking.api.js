import axios from 'axios';
import { handleApiError, formatSuccessResponse } from '../utils/apiErrorHandler';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

/**
 * Lấy danh sách tất cả các booking từ API
 * @returns {Promise} Promise chứa dữ liệu booking hoặc lỗi được xử lý
 */
export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/booking`);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Tạo một booking mới
 * @param {Object} bookingRequest - Thông tin booking cần tạo
 * @returns {Promise} Promise chứa dữ liệu booking mới hoặc lỗi được xử lý
 */
export const createBooking = async (bookingRequest) => {
  try {
<<<<<<< HEAD
    const response = await axios.post(`${apiUrl}/booking`, bookingRequest);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Lấy thông tin chi tiết của một booking theo ID
 * @param {number} id - ID của booking
 * @returns {Promise} Promise chứa dữ liệu booking hoặc lỗi được xử lý
 */
export const getBooking = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/booking/${id}`);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Cập nhật trạng thái của một booking
 * @param {number} id - ID của booking
 * @param {string} status - Trạng thái mới (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 * @returns {Promise} Promise chứa dữ liệu phản hồi hoặc lỗi được xử lý
 */
export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${apiUrl}/booking/${id}/status`, null, {
      params: { status },
=======
    const response = await axios.post(`${apiUrl}/booking`, bookingRequest, {
      withCredentials: true,
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    });
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
<<<<<<< HEAD
 * Hủy một booking
 * @param {number} id - ID của booking
 * @param {string} [reason] - Lý do hủy (tùy chọn, mặc định là 'No reason provided')
 * @returns {Promise} Promise chứa dữ liệu phản hồi hoặc lỗi được xử lý
 */
export const cancelBooking = async (id, reason = 'No reason provided') => {
  try {
    const response = await axios.post(`${apiUrl}/booking/${id}/cancel`, null, {
      params: { reason },
    });
=======
 * Lấy thông tin chi tiết của một booking theo ID
 * @param {number} id - ID của booking
 * @returns {Promise} Promise chứa dữ liệu booking hoặc lỗi được xử lý
 */
export const getBooking = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}/booking/${id}`);
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
<<<<<<< HEAD
=======
 * Fetch bookings for a user by userId
 * @param {number} userId - User ID
 * @returns {Promise} Promise containing list of bookings or handled error
 */
export const getMyBookings = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/booking/my-bookings?userId=${userId}`);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Cập nhật trạng thái của một booking
 * @param {number} id - ID của booking
 * @param {string} status - Trạng thái mới (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 * @returns {Promise} Promise chứa dữ liệu phản hồi hoặc lỗi được xử lý
 */
export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${apiUrl}/booking/${id}/status?status=${status}`);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Hủy một booking (Admin)
 * @param {number} id - ID của booking
 * @param {Object} reason - Lý do hủy
 * @returns {Promise} Promise chứa dữ liệu phản hồi hoặc lỗi được xử lý
 */
export const cancelBooking = async (id, reason) => {
  try {
    const response = await axios.post(`${apiUrl}/booking/${id}/cancel`, reason);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Hủy một booking (User)
 * @param {number} id - ID của booking
 * @param {Object} reason - Lý do hủy
 * @param {number} userId - ID của user
 * @returns {Promise} Promise chứa dữ liệu phản hồi hoặc lỗi được xử lý
 */
export const userCancelBooking = async (id, reason, userId) => {
  try {
    const response = await axios.post(
      `${apiUrl}/booking/${id}/user-cancel?userId=${userId}`,
      reason
    );
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Lấy danh sách lý do hủy từ API
 * @returns {Promise} Promise chứa danh sách lý do hoặc lỗi được xử lý
 */
export const getCancelReasons = async () => {
  try {
    const response = await axios.get(`${apiUrl}/booking/cancel-reasons`);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

/**
>>>>>>> a8c3d888f5374a7e2756719e0a2707f417ac023f
 * Lấy danh sách booking theo trạng thái
 * @param {string} status - Trạng thái cần lọc (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 * @returns {Promise} Promise chứa danh sách booking hoặc lỗi được xử lý
 */
export const getBookingsByStatus = async (status) => {
  try {
    const response = await axios.get(`${apiUrl}/booking/status/${status}`);
    return formatSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};