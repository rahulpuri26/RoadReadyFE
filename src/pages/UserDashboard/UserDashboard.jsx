import React, { useState, useEffect } from "react";
// import CarService from '../services/CarService.js';
// import ReservationService from '../services/ReservationService.js';
// import ReviewService from '../services/ReviewService.js';
// import PaymentService from '../services/PaymentService.js';
// import UserService from '../services/UserService.js'
import "../../styles/Userdashboard.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    // const [cars, setCars] = useState([]);
    // const [reservations, setReservations] = useState([]);
    // const [reviews, setReviews] = useState([]);
    // const [payments, setPayments] = useState([]);

    

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
                .get(`https://localhost:7087/api/User/user/userName/${username}`, {
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

const handleBrowseCarClick = () => {
    const token = localStorage.getItem("token"); // Check if the user is logged in by checking localStorage for token
    if (token) {
      // If logged in, navigate to the dashboard
      navigate("/browsecar");
    } else {
      // If not logged in, navigate to the login page
      navigate("/login");
    }
    }
  
    const handleProfilePageClick = () => {
        const token = localStorage.getItem("token"); // Check if the user is logged in by checking localStorage for token
        if (token) {
          // If logged in, navigate to the dashboard
          navigate("/profilepage");
        } else {
          // If not logged in, navigate to the login page
          navigate("/login");
        }
        }
        const handleBookReservationClick = () => {
            const token = localStorage.getItem("token"); // Check if the user is logged in by checking localStorage for token
            if (token) {
              // If logged in, navigate to the dashboard
              navigate("/bookreservation");
            } else {
              // If not logged in, navigate to the login page
              navigate("/login");
            }
            }
            const handleReviewsClick = () => {
                const token = localStorage.getItem("token"); // Check if the user is logged in by checking localStorage for token
                if (token) {
                  // If logged in, navigate to the dashboard
                  navigate("/reviews");
                } else {
                  // If not logged in, navigate to the login page
                  navigate("/login");
                }
                }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to RoadReady</h1>
        <nav className="dashboard-nav">
          <a href="/profilepage">Profile</a>
          <a href="/browsecar">Browse Cars</a>
          <a href="/login">Logout</a>
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
          <p>Explore your favourite cars and Rent them at affordable prices !!!!</p>
        </section>
        <section className="actions-section">
          <div className="action-card">
            <h3>Book Reservations</h3>
            <p>Make a booking for you trip.</p>
            <button onClick = {handleBookReservationClick}>Go to Reservations</button>
          </div>
          <div className="action-card">
            <h3>Browse Cars</h3>
            <p>Explore available cars for your next trip.</p>
            <button onClick={handleBrowseCarClick}>Browse Cars</button>
          </div>
          <div className="action-card">
            <h3>Edit Profile</h3>
            <p>Update your personal information and payment methods.</p>
            <button onClick = {handleProfilePageClick}>Edit Profile</button>
          </div>
          <div className="action-card">
            <h3>Provide Reviews</h3>
            <p>Give ratings to our Service.</p>
            <button onClick = {handleReviewsClick}>Reviews</button>
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
