export const handleApiError = (error) => {
    // Cấu trúc lỗi cơ bản
    const errorResponse = {
      success: false,
      message: 'Unknown error occurred',
      status: null,
      errorType: 'network/unknown',
      data: null
    };
  
    // Phân loại lỗi
    if (error.response) {
      // Lỗi từ phản hồi server (4xx, 5xx)
      errorResponse.status = error.response.status;
      errorResponse.errorType = 'server-response';
      errorResponse.data = error.response.data;
      
      // Custom message theo status code
      switch (error.response.status) {
        case 400:
          errorResponse.message = 'Bad Request';
          break;
        case 401:
          errorResponse.message = 'Unauthorized - Please login again';
          break;
        case 403:
          errorResponse.message = 'Forbidden - You don\'t have permission';
          break;
        case 404:
          errorResponse.message = 'Resource Not Found';
          break;
        case 500:
          errorResponse.message = 'Internal Server Error';
          break;
        default:
          errorResponse.message = error.response.data?.message || error.message;
      }
    } else if (error.request) {
      // Không nhận được phản hồi
      errorResponse.errorType = 'no-response';
      errorResponse.message = 'No response from server - Please check your network';
    } else {
      // Lỗi khi thiết lập request
      errorResponse.errorType = 'request-setup';
      errorResponse.message = error.message;
    }
  
    // Log lỗi để debug (có thể thay bằng logging service)
    console.error('API Error:', errorResponse);
  
    return errorResponse;
  };
  

  export const formatSuccessResponse = (response) => ({
    success: true,
    data: response.data,
    status: response.status
  });