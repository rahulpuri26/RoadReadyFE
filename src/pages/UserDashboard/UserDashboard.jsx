import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode }from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../../styles/UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null); // Stores user details fetched from the backend
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        console.log("Decoded Token:", decodedToken);

        if (username) {
          // Fetch user details by username
          axios
            .get(`https://localhost:7087/api/Users/username/${username}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              console.log("User Details Fetched:", response.data);
              setUser(response.data); // Store the full user details
            })
            .catch((error) => {
              console.error("Failed to fetch user:", error);
              navigate("/login");
            });
        } else {
          console.error("Username is missing in the token payload.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to RoadReady</h1>
        {user ? (
          <h2>
            Hello, {user.firstName}! <br />
            <span className="user-id-display">Your User ID: {user.userId}</span>
          </h2>
        ) : (
          <h2>Loading...</h2>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>
      {/* Additional content */}
    </div>
  );
};

export default UserDashboard;
