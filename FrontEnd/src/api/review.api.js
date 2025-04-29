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

// get review of tour have pagination
// http://localhost:8080/api/reviews/tour/1?page=0&size=5
export const getReviewOfTour = async (tourId, page, size) => {
    try {
        const response = await axios.get(
            `${apiUrl}/reviews/tour/${tourId}?page=${page}&size=${size}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews of tour:", error);
        throw error;
    }
};

export const addReply = async (replyData) => {
    try {
        const response = await axios.post(
            `${apiUrl}/reviews/${replyData.reviewId}/reply`,
            { content: replyData.content },
            {
                headers: {
                    userId: replyData.userId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding reply:", error);
        throw error;
    }
};

export const getRepliesByReviewId = async (reviewId) => {
    try {
        const response = await axios.get(`${apiUrl}/reviews/reply/${reviewId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching replies:", error);
        throw error;
    }
};


// upload images have request param file : http://localhost:8080/api/reviews/1/images
export const uploadImages = async (reviewId, images) => {
    try {
        const formData = new FormData();
        images.forEach((image) => {
            if (image.type.startsWith("image/")) {
                formData.append("images", image);
            } else {
                console.error("Invalid file type:", image.name);
            }
        });

        const response = await axios.post(
            `${apiUrl}/reviews/${reviewId}/images`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading images:", error);
        throw error;
    }
};

// get count replies of review
// http://localhost:8080/api/reviews/1/reply/count
export const getCountReplies = async (reviewId) => {
    try {
        const response = await axios.get(`${apiUrl}/reviews/${reviewId}/reply/count`);
        return response.data;
    } catch (error) {
        console.error("Error fetching count replies:", error);
        throw error;
    }
}