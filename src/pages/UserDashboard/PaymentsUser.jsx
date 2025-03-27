import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/PaymentsUser.css";
import { jwtDecode } from "jwt-decode";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { reservationId, car, pickupDate, dropoffDate, totalAmount } = state || {};
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }

      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

        const response = await axios.get(`https://localhost:7087/api/Users/username/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // Store the user details
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePayment = async () => {
    if (!reservationId || !user) {
      alert("Invalid reservation or user details.");
      return;
    }

    const paymentData = {
      reservationId,
      paymentMethod,
      amount: totalAmount,
      status: "Completed",
      userId: user.userId,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token is missing. Please log in.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7087/api/Payment", paymentData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is sent properly
        },
      });
      console.log("Payment response:", response.data);
      alert("Payment successful!");
      navigate("/user-dashboard");
    } catch (err) {
      console.error("Error processing payment:", err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized. Please check your login session.");
      } else {
        alert("Failed to process payment. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="payment-page-container">
      <h1>Payment Details</h1>
      <div className="booking-summary">
        <p>
          <strong>Car:</strong> {car?.model || "Unknown Car"}
        </p>
        <p>
          <strong>Pick-Up Date:</strong> {pickupDate || "N/A"}
        </p>
        <p>
          <strong>Drop-Off Date:</strong> {dropoffDate || "N/A"}
        </p>
        <p>
          <strong>Total Amount:</strong> ${totalAmount || 0}
        </p>
      </div>
      <div className="payment-method">
        <label htmlFor="payment-method">Select Payment Method:</label>
        <select
          id="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>
      <button onClick={handlePayment}>Make Payment</button>
    </div>
  );
};

export default PaymentPage;
