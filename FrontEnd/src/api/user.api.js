import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const handleError = (error) => {
  throw error.response?.data || { error: "Something went wrong" };
};

// Get all users
export const getAllUsers = async (page = 0, size = 1000, sortBy = 'id', sortDir = 'asc') => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    handleError(error);
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/${userId}`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
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