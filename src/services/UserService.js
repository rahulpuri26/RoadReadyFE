import axios from "axios";

// API URL for the UsersController
const API_URL = "https://localhost:7087/api/Users";

// Get all users (Admin only)
const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for admin authorization
      },
    });
    return response.data; // Return list of users
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// Get a single user by ID
const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Return user details
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Add a new user (Admin or public, depending on your auth)
const addUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data; // Return created user
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Update an existing user (Admin only)
const updateUser = async (userData) => {
  try {
    const response = await axios.put(API_URL, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return updated user
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete a user (Admin only)
const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return result of delete operation
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};
