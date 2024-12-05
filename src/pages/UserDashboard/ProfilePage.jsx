import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ProfilePage.css";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const username =
          decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        console.log("Decoded Token:", decodedToken);

        if (username) {
          const userResponse = await axios.get(
            `https://localhost:7087/api/User/user/userName/${username}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("User Details Fetched:", userResponse.data);
          setUser(userResponse.data);
          setUpdatedUser(userResponse.data);

          const USERID = userResponse.data.userId;

          // Fetch reservations
          const reservationsResponse = await axios.get(
            `https://localhost:7087/api/Reservation/user/${USERID}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Reservations:", reservationsResponse.data);
          setReservations(reservationsResponse.data.$values || []);

          // Fetch payments
          const paymentsResponse = await axios.get(
            `https://localhost:7087/api/Payment/user/${USERID}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("Payments:", paymentsResponse.data);
          setPayments(paymentsResponse.data.$values || []);

          setLoading(false);
        } else {
          console.error("Username is missing in the token payload.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put("https://localhost:7087/api/User", updatedUser);
      setUser(updatedUser);
      setEditMode(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "N/A"; // Handle missing dates
    const date = new Date(dateTimeString);
    if (isNaN(date)) return "Invalid Date"; // Handle invalid date parsing
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <a href="/user-dashboard">Previous</a>
        <a href="/login">Logout</a>
      </nav>

      <h1 className="profile-title">My Profile</h1>
      <div className="profile-section">
        <h2>Personal Information</h2>
        {editMode ? (
          <div className="profile-edit-form">
            <input
              type="text"
              name="firstName"
              value={updatedUser.firstName || ""}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <input
              type="email"
              name="email"
              value={updatedUser.email || ""}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phoneNumber"
              value={updatedUser.phoneNumber || ""}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <div className="profile-info">
            <p>
              <strong>First Name:</strong> {user?.firstName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phoneNumber}
            </p>
            <button onClick={() => setEditMode(true)}>Edit Information</button>
          </div>
        )}
      </div>
      <div className="profile-section">
        <h2>Reservation History</h2>
        <table className="profile-table">
          <thead>
            <tr>
              <th>Pickup Date</th>
              <th>Dropoff Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <tr key={reservation.ReservationId}>
                  <td>{formatDate(reservation.PickupDate)}</td>
                  <td>{formatDate(reservation.DropoffDate)}</td>
                  <td>{reservation.TotalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No reservations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="profile-section">
        <h2>Payment History</h2>
        <table className="profile-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.PaymentId}>
                  <td>{payment.Amount}</td>
                  <td>{formatDate(payment.PaymentDate)}</td>
                  <td>{payment.PaymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
