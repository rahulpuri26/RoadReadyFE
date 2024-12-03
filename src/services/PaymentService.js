import axios from "axios";

// Use your API URL directly here
const API_URL = "https://localhost:7087/api/Payment";

// Get all payments (Admin only)
const getAllPayments = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for admin authorization
      },
    });
    return response.data; // Return list of payments
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};

// Get a single payment by ID
const getPaymentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Return payment details
  } catch (error) {
    console.error(`Error fetching payment with ID ${id}:`, error);
    throw error;
  }
};

// Get payments by user ID
const getPaymentsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data; // Return list of payments for a user
  } catch (error) {
    console.error(`Error fetching payments for user ID ${userId}:`, error);
    throw error;
  }
};

// Add a new payment
const addPayment = async (paymentData) => {
  try {
    const response = await axios.post(API_URL, paymentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return created payment
  } catch (error) {
    console.error("Error adding payment:", error);
    throw error;
  }
};

// Update a payment (Admin only)
const updatePayment = async (paymentData) => {
  try {
    const response = await axios.put(API_URL, paymentData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return updated payment
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// Delete a payment (Admin only)
const deletePayment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token for authorization
      },
    });
    return response.data; // Return result of delete operation
  } catch (error) {
    console.error(`Error deleting payment with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getAllPayments,
  getPaymentById,
  getPaymentsByUserId,
  addPayment,
  updatePayment,
  deletePayment,
};
