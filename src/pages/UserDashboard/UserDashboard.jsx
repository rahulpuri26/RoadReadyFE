import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Correct import for jwt-decode
import { useNavigate } from "react-router-dom";
import "../../styles/Userdashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login page if the token is missing
      navigate("/login");
    } else {
      try {
        // Decode the token to extract the username
        const decodedToken = jwtDecode(token);
        const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

        if (username) {
          // Fetch user details by username
          axios
            .get(`https://localhost:7087/api/Users/username/${username}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              setUser(response.data); // Store the full user details
            })
            .catch((error) => {
              navigate("/login");
            });
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from localStorage
    navigate("/login"); // Redirect to login page
  };

  const handleNavigation = (path) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to RoadReady</h1>
        <nav className="dashboard-nav">
          <button onClick={() => handleNavigation("/ProfilePage")}>Profile</button>
          <button onClick={() => handleNavigation("/browsecar")}>Browse Cars</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main className="dashboard-main">
        <section className="welcome-section">
          {user ? (
            <h2>
              Hello, {user.firstName}! <br />
              <span className="user-id-display">Your User ID: {user.userId}</span>
            </h2>
          ) : (
            <h2>Loading...</h2>
          )}
          <p>Explore your favorite cars and rent them at affordable prices!</p>
        </section>
        <section className="actions-section">
          <div className="action-card">
            <h3>Book Reservations</h3>
            <p>Make a booking for your trip.</p>
            <button onClick={() => handleNavigation("/bookreservation")}>Go to Reservations</button>
          </div>
          <div className="action-card">
            <h3>Browse Cars</h3>
            <p>Explore available cars for your next trip.</p>
            <button onClick={() => handleNavigation("/browsecar")}>Browse Cars</button>
          </div>
          <div className="action-card">
            <h3>Edit Profile</h3>
            <p>Update your personal information and payment methods.</p>
            <button onClick={() => handleNavigation("/profilepage")}>Edit Profile</button>
          </div>
          <div className="action-card">
            <h3>Provide Reviews</h3>
            <p>Give ratings to our service.</p>
            <button onClick={() => handleNavigation("/reviews")}>Reviews</button>
          </div>
        </section>
      </main>
      <footer className="dashboard-footer">
        <p>© 2024 RoadReady. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
