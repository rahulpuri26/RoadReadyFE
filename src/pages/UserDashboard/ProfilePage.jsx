import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ProfilePage.css";
import { jwtDecode } from "jwt-decode";
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

        if (username) {
          // Fetch user profile data
          const userResponse = await axios.get(
            `https://localhost:7087/api/Users/username/${username}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser({ ...userResponse.data, username }); // Include username
          setUpdatedUser(userResponse.data);

          const USERID = userResponse.data.userId;

          // Fetch reservations
          const reservationsResponse = await axios.get(
            `https://localhost:7087/api/Reservation/user/${USERID}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReservations(reservationsResponse.data.$values || reservationsResponse.data || []);

          // Fetch payments
          const paymentsResponse = await axios.get(
            `https://localhost:7087/api/Payment/user/${USERID}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPayments(paymentsResponse.data.values || []);
          setLoading(false);
        } else {
          navigate("/login");
        }
      } catch (error) {
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
      const token = localStorage.getItem("token");
      if (token) {
        await axios.put("https://localhost:7087/api/Users", updatedUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(updatedUser);
        setEditMode(false);
        alert("Profile updated successfully.");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "Invalid Date";
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
        <a href="/user-dashboard">DashBoard</a>
        <a href="/">Home</a>
      </nav>

      <h1 className="profile-title">My Profile</h1>
      <div className="profile-section">
        <h2>Personal Information</h2>
        {editMode ? (
          <div className="profile-edit-form">
            <p>
              <strong>Username:</strong> {user?.username}
            </p>
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
              <strong>Username:</strong> {user?.username}
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

      {/* Reservation History Section */}
      <div className="profile-section">
        <h2>Reservation History</h2>
        <table className="profile-table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Pickup Date</th>
              <th>Dropoff Date</th>
              <th>Total Amount</th>
              <th>Car Make & Model</th>
              <th>Car Image</th>
            </tr>
          </thead>
          <tbody>
            {reservations && reservations.length > 0 ? (
              reservations.map((reservation) => (
                <tr key={reservation.reservationId}>
                  <td>{reservation.reservationId}</td>
                  <td>{formatDate(reservation.pickupDate)}</td>
                  <td>{formatDate(reservation.dropoffDate)}</td>
                  <td>{reservation.totalAmount}</td>
                  <td>
                    {reservation.car ? `${reservation.car.make} ${reservation.car.model}` : "No Car Info"}
                  </td>
                  <td>
                    <img
                      src={reservation.car?.imageUrl || "defaultImageUrl.png"}
                      alt={`${reservation.car?.make} ${reservation.car?.model}`}
                      style={{ width: "120px", height: "60px" }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No reservations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment History Section */}
      <div className="profile-section">
        <h2>Payment History</h2>
        <table className="profile-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Reservation ID</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={payment.paymentId || index}>
                  <td>{payment.paymentId}</td>
                  <td>{payment.reservationId || "N/A"}</td>
                  <td>{payment.amount}</td>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td>{payment.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No payments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
