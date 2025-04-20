import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        throw error.response?.data || {error: "Something went wrong"};
    }
};
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {error: "Something went wrong"};
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

// get favourite tour by user id
export const getFavouriteTourByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}/favourites`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || {error: "Something went wrong"};
    }
}

// add favourite tour by user
export const addFavouriteTourByUserId = async (userId, tourId) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/user/${userId}/favourites/add?tourId=${tourId}`,
            null, // Không cần body
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {error: "Something went wrong"};
    }
};

// remove favourite tour by user
export const removeFavouriteTourByUserId = async (userId, tourId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/user/${userId}/favourites/delete?tourId=${tourId}`,
            null, // Không cần body
            {
                withCredentials: true,
            });
        return response.data;
    } catch (error) {
        throw error.response?.data || {error: "Something went wrong"};
    }
}