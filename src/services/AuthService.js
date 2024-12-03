import axios from "axios";

// Updated API URL to match your login endpoint
const API_URL = "https://localhost:7087/api/Authentication";

// Axios instance for API requests
const axiosInstance = axios.create({
  baseURL: "https://localhost:7087/api", // Base URL
  headers: {
    "Content-Type": "application/json", // Ensure content type is JSON
  },
});

// Login service to authenticate user and return a token
const login = async (username, password) => {
  try {
    console.log("Service called for login");
    const response = await axiosInstance.post("/Authentication/login", {
      username,
      password,
    });

    const token = response.data.token;
    console.log("Login successful, token received");

    // Store token in localStorage
    localStorage.setItem("token", token);

    return token;
  } catch (error) {
    console.error("Error logging in:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Fetch protected data from the server using JWT token
const getProtectedData = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found, please log in");
    }

    const response = await axiosInstance.get("/protected-endpoint", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching protected data:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch protected data");
  }
};



export { login, getProtectedData };
