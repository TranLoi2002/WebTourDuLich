import axios from "axios"

const apiUrl = process.env.REACT_APP_API_BASE_URL;

// get all blogs
// http://localhost:8080/api/blog?page=0&size=10&sortBy=id&sortDir=asc
export const getBlogs = async (page, size, sortBy, sortDir) => {
  try {
    const response = await axios.get(
      `${apiUrl}/blog?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

