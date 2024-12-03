import axios from "axios";

// Use the correct API URL for the ReviewController
const API_URL = "https://localhost:7087/api/Review";

// Get all reviews (Public access)
const getAllReviews = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return list of reviews
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    throw error; // Throw error to be handled by the calling function
  }
};

// Get a single review by ID
const getReviewById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Return review details
  } catch (error) {
    console.error(`Error fetching review with ID ${id}:`, error);
    throw error; // Throw error to be handled by the calling function
  }
};

// Get reviews by car ID
const getReviewsByCarId = async (carId) => {
  try {
    const response = await axios.get(`${API_URL}/car/${carId}`);
    return response.data; // Return list of reviews for a specific car
  } catch (error) {
    console.error(`Error fetching reviews for car ID ${carId}:`, error);
    throw error;
  }
};

// Add a new review (User only)
const addReview = async (reviewData) => {
  try {
    const response = await axios.post(API_URL, reviewData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return created review
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Update an existing review (User only)
const updateReview = async (reviewData) => {
  try {
    const response = await axios.put(API_URL, reviewData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return updated review
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Delete a review (Admin only)
const deleteReview = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return result of delete operation
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllReviews,
  getReviewById,
  getReviewsByCarId,
  addReview,
  updateReview,
  deleteReview,
};
