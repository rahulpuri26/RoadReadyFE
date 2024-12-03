import axios from "axios";

// Use your API URL directly here
const API_URL = "https://localhost:7087/api/Car";

// Get all cars
const getAllCars = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Return list of cars
  } catch (error) {
    console.error("Error fetching all cars:", error);
    throw error; // Throw error to be handled by calling function
  }
};

// Get a single car by ID
const getCarById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Return car details
  } catch (error) {
    console.error(`Error fetching car with ID ${id}:`, error);
    throw error; // Throw error to be handled by calling function
  }
};

// Add a new car (Admin only)
const addCar = async (carData) => {
  try {
    const response = await axios.post(API_URL, carData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return created car
  } catch (error) {
    console.error("Error adding car:", error);
    throw error; // Throw error to be handled by calling function
  }
};

// Update a car (Admin only)
const updateCar = async (carData) => {
  try {
    const response = await axios.put(API_URL, carData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return updated car
  } catch (error) {
    console.error("Error updating car:", error);
    throw error; // Throw error to be handled by calling function
  }
};

// Delete a car (Admin only)
const deleteCar = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return result of delete operation
  } catch (error) {
    console.error(`Error deleting car with ID ${id}:`, error);
    throw error; // Throw error to be handled by calling function
  }
};

export default {
  getAllCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar,
};
