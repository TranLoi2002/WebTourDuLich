import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user`,{
            withCredentials: true,
        });
        return response;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: "Something went wrong" };
    }
};
export const updateUser = async (userId, userData) => {
    // try {
    //   const response = await axios.patch(`${API_BASE_URL}/user/${userId}`, userData, {
    //     withCredentials: true,
    //   });
    //   return response.data;
    // } catch (error) {
    //   throw error.response?.data || { error: "Something went wrong" };
    // }
  };
const handleError = (error) => {
  throw error.response?.data || { error: "Something went wrong" };
};

// Get favourite tours by user ID
export const getFavouriteTourByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/favourites`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Add favourite tour
export const addFavouriteTourByUserId = async (userId, tourId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/${userId}/favourites/add?tourId=${tourId}`,
      null,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Remove favourite tour
export const removeFavouriteTourByUserId = async (userId, tourId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/user/${userId}/favourites/delete?tourId=${tourId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update user profile
export const updateUserProfile = async (userId, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/${userId}/update-profile`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
