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


// Create a new blog
export const createBlog = async (formData, userId) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'User-Id': userId,
    },
  };
  const response = await axios.post(`${apiUrl}/blog`, formData, config);
  return response.data;
};

// Update an existing blog
export const updateBlog = async (id, formData, userId) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'User-Id': userId,
    },
  };
  const response = await axios.put(`${apiUrl}/blog/${id}`, formData, config);
  return response.data;
};

export const deleteBlog = async (id) => {
    try {
        const response = await axios.delete(`${apiUrl}/blog/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw error;
    }
}

// get blogs by category id
// http://localhost:8080/api/blog/category/1?page=0&size=10&sortBy=id&sortDir=asc
export const getBlogsByCategoryId = async (categoryId, page, size, sortBy, sortDir) => {
  try {
    const response = await axios.get(
      `${apiUrl}/blog/category/${categoryId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs by category ID:", error);
    throw error;
  }
};

// get detail blog by id
// http://localhost:8080/api/blog/11
export const getDetailBlog = async (id) => {
    try {
        const response = await axios.get(`${apiUrl}/blog/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching blog details:", error);
        throw error;
    }

}

// get all categories
// http://localhost:8080/api/category?page=0&size=10&sortBy=id&sortDir=asc
export const getCategories = async (page, size, sortBy, sortDir) => {
  try {
    const response = await axios.get(
      `${apiUrl}/category?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    const response = await axios.post(`${apiUrl}/category`, category);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export const updateCategory = async (categoryId, category) => {
  try{
    const response = await axios.put(`${apiUrl}/category/update/${categoryId}`, category);
    return response.data;
  }catch(error){
    console.error("Error updating category:", error);
    throw error;
  }
}

export const toggleCategoryStatus = async (categoryId) => {
  try{
    const response = await axios.delete(`${apiUrl}/category/${categoryId}`);
    return response.data;
  }catch(error){
    console.error("Error toggling category status:", error);
    throw error;
  }
}


// create like : http://localhost:8080/api/blog/{blogId}/like that header is User-Id and request body is content
export const createLike = async (blogId, userId) => {
  try {
    const response = await axios.post(`${apiUrl}/blog/${blogId}/like`, {}, {
      headers: {
        "User-Id": userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating like:", error);
    throw error;
  }
};

// delete like : http://localhost:8080/api/blog/{blogId}/like that header is User-Id
export const deleteLike = async (blogId, userId) => {
  try {
    const response = await axios.delete(`${apiUrl}/blog/${blogId}/like`, {
      headers: {
        "User-Id": userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting like:", error);
    throw error;
  }
};

// create comment : http://localhost:8080/api/blog/{blogId}/comment that header is User-Id
export const createComment = async (blogId, userId, comment, parentId = null) => {
  try {
    const response = await axios.post(
        `${apiUrl}/blog/${blogId}/comments`,
        {
          content: comment,
          parentId: parentId // Gửi parentId nếu có
        },
        {
          headers: {
            "User-Id": userId, // Đảm bảo User-Id được gửi trong header
          },
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};