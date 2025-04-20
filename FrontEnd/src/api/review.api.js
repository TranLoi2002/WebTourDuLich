import axios from "axios";

const apiUrl = "http://localhost:8080/api"

export const createReview = async (reviewData) => {
    try {
        const response = await axios.post(
            `${apiUrl}/reviews/tour/${reviewData.tourId}/add`,
            reviewData,
            {
                headers: {
                    userId: reviewData.userId, // Thêm header userId
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating review:", error);
        throw error;
    }
};