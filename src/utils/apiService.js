import axios from 'axios';

const API_URL = 'https://localhost:7087/api';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/Users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getCars = async () => {
  try {
    const response = await axios.get(`${API_URL}/Car`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};

export const getReservations = async () => {
  try {
    const response = await axios.get(`${API_URL}/Reservation`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
};

export const getReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/Review`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};
