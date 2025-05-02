import axios from 'axios';
import { handleApiError, formatSuccessResponse } from '../utils/apiErrorHandler';

const apiUrl = process.env.REACT_APP_API_BASE_URL;



/**
 * Lấy danh sách tất cả các paymentMethod từ API
 * @returns {Promise} Promise chứa dữ liệu paymentMethod hoặc lỗi được xử lý
 */
export const getAllPaymentMethod = async () => {
    try {
      const response = await axios.get(`${apiUrl}/payment/payment-methods`);
      return formatSuccessResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  };
  