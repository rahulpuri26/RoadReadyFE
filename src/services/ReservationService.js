import axios from "axios";

// Use the API URL directly here
const API_URL = "https://localhost:7087/api/Reservation";

// Get all reservations (Admin only)
const getAllReservations = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    throw error; 
  }
};

// Get a single reservation by ID (Admin and User)
const getReservationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Return reservation details
  } catch (error) {
    console.error(`Error fetching reservation with ID ${id}:`, error);
    throw error;
  }
};

// Get reservations by car ID
const getReservationsByCarId = async (carId) => {
  try {
    const response = await axios.get(`${API_URL}/car/${carId}`);
    return response.data; // Return list of reservations for a specific car
  } catch (error) {
    console.error(`Error fetching reservations for car ID ${carId}:`, error);
    throw error;
  }
};

// Add a new reservation
const addReservation = async (reservationData) => {
  try {
    const response = await axios.post(API_URL, reservationData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return created reservation
  } catch (error) {
    console.error("Error adding reservation:", error);
    throw error;
  }
};

// Update an existing reservation
const updateReservation = async (reservationData) => {
  try {
    const response = await axios.put(API_URL, reservationData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return updated reservation
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};

// Delete a reservation (Admin only)
const deleteReservation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return result of delete operation
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllReservations,
  getReservationById,
  getReservationsByCarId,
  addReservation,
  updateReservation,
  deleteReservation,
};
