import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar"; 
import Users from "./Users"; 
import Cars from "./Cars"; 
import Reservations from "./Reservations"; 
import Payments from "./Payments"; 
import "../../styles/AdminDashboard.css";
import Footer from "../../components/Footer";
import axios from "axios";

const AdminDashboard = () => {
  const [role, setRole] = useState(null);
  const [stats, setStats] = useState({
    usersCount: 0,
    carsCount: 0,
    reservationsCount: 0,
    reviewsCount: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const navigate = useNavigate();

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setRole(decodedToken.role); 

      // Fetch stats (Total Users, Total Cars, Total Reservations, Total Reviews)
      const fetchStats = async () => {
        try {
          const usersResponse = await axios.get("https://localhost:7087/api/Users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const carsResponse = await axios.get("https://localhost:7087/api/Car", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const reservationsResponse = await axios.get("https://localhost:7087/api/Reservation", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const reviewsResponse = await axios.get("https://localhost:7087/api/Review", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setStats({
            usersCount: usersResponse.data.length,
            carsCount: carsResponse.data.length,
            reservationsCount: reservationsResponse.data.length,
            reviewsCount: reviewsResponse.data.length,
          });

        
          setRecentUsers(usersResponse.data);  
          setRecentReviews(reviewsResponse.data);  
          setRecentReservations(reservationsResponse.data);  

        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };
      fetchStats();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Navbar */}
      <AdminNavbar handleLogout={handleLogout} />

      {/* Main Dashboard Content */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome to the Admin Dashboard</h1>
        </div>

        {/* Stats Section */}
        <div className="stats-container">
          <div className="stat-item">
            <h3>Total Users</h3>
            <p>{stats.usersCount}</p>
          </div>
          <div className="stat-item">
            <h3>Total Cars</h3>
            <p>{stats.carsCount}</p>
          </div>
          <div className="stat-item">
            <h3>Total Reservations</h3>
            <p>{stats.reservationsCount}</p>
          </div>
          <div className="stat-item">
            <h3>Total Reviews</h3>
            <p>{stats.reviewsCount}</p>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="recent-activities">
          <div className="recent-users">
            <h3>Recent Users</h3>
            <div className="scrollable-container">
              {recentUsers.map((user) => (
                <div key={user.userId} className="scrollable-item">
                  <p>{user.firstName} {user.lastName}</p>
                  <span>{user.email}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="recent-reviews">
            <h3>Recent Reviews</h3>
            <div className="scrollable-container">
              {recentReviews.map((review) => (
                <div key={review.reviewId} className="scrollable-item">
                  <p>{review.comments}</p>
                  <span>Rating: {review.rating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="recent-reservations">
            <h3>Recent Reservations</h3>
            <div className="scrollable-container">
              {recentReservations.map((reservation) => (
                <div key={reservation.reservationId} className="scrollable-item">
                  <p>Reservation #{reservation.reservationId}</p>
                  <span>Status: {reservation.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="content-section">
          <Routes>
            <Route path="users/*" element={<Users />} />
            <Route path="cars/*" element={<Cars />} />
            <Route path="reservations/*" element={<Reservations />} />
            <Route path="payments/*" element={<Payments />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
