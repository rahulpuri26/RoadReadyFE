import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [newPayment, setNewPayment] = useState({
    paymentId: 0,
    reservationId: "",
    userId: null, // Include userId in the payment state
    amount: "",
    paymentMethod: "Credit Card",
    status: "Pending",
  });
  const [editingPayment, setEditingPayment] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");

  // Fetch payments and reservations data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to login first.");
        return;
      }

      try {
        const paymentsResponse = await axios.get("https://localhost:7087/api/Payment", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reservationsResponse = await axios.get("https://localhost:7087/api/Reservation", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPayments(paymentsResponse.data);
        setReservations(reservationsResponse.data);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Fetch reservation details by ID, including user and car details
  const fetchReservationDetails = async (reservationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to login first.");
      return;
    }

    try {
      // Fetch reservation data
      const reservationResponse = await axios.get(`https://localhost:7087/api/Reservation/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservationData = reservationResponse.data;

      // Fetch user details
      const userResponse = await axios.get(`https://localhost:7087/api/Users/${reservationData.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch car details
      const carResponse = await axios.get(`https://localhost:7087/api/Car/${reservationData.carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update reservation details state with user and car data
      setReservationDetails({
        ...reservationData,
        user: userResponse.data,
        car: carResponse.data,
      });
    } catch (err) {
      setError("Failed to fetch reservation details.");
      console.error(err);
    }
  };

  // Handle reservation change and fetch amount
  const handleReservationChange = (reservationId) => {
    const selectedReservation = reservations.find((res) => res.reservationId === Number(reservationId));
    if (selectedReservation) {
      setNewPayment({
        ...newPayment,
        reservationId,
        userId: selectedReservation.userId, // Set userId from the selected reservation
        amount: selectedReservation.totalAmount || "", // Fetch amount from the reservation
      });
    }
  };

  const handleSavePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to login first.");
      return;
    }
  
    // Retrieve userId from reservation details
    const selectedReservation = reservations.find(
      (res) => res.reservationId === Number(newPayment.reservationId)
    );
  
    if (!selectedReservation) {
      setError("Invalid reservation selected.");
      return;
    }
  
    const paymentPayload = {
      ...newPayment,
      userId: selectedReservation.userId, // Include userId in the payload
    };
  
    try {
      if (newPayment.paymentId === 0) {
        // Add new payment
        await axios.post("https://localhost:7087/api/Payment", paymentPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Update payment
        await axios.put(
          "https://localhost:7087/api/Payment",
          paymentPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      // Fetch updated list of payments
      const paymentsResponse = await axios.get("https://localhost:7087/api/Payment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(paymentsResponse.data); // Update the state with the latest payments list
  
      clearForm();
    } catch (err) {
      setError("Failed to save payment.");
      console.error("Error details:", err.response?.data || err);
    }
  };
  

  // Handle editing of existing payment
  const handleEditPayment = (payment) => {
    const selectedReservation = reservations.find((res) => res.reservationId === payment.reservationId);
    setNewPayment({
      ...payment,
      userId: selectedReservation?.userId || null, // Populate userId when editing
    });
    setEditingPayment(payment);
    setShowAddForm(true);
  };

  // Handle deleting payment
  const handleDeletePayment = async (paymentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to login first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`https://localhost:7087/api/Payment/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPayments(payments.filter((payment) => payment.paymentId !== paymentId));
      } catch (err) {
        setError("Failed to delete payment.");
        console.error(err);
      }
    }
  };

  // Clear form and reset state
  const clearForm = () => {
    setNewPayment({
      paymentId: 0,
      reservationId: "",
      userId: null,
      amount: "",
      paymentMethod: "Credit Card",
      status: "Pending",
    });
    setShowAddForm(false);
    setEditingPayment(null); // Reset editing state
  };

  return (
    <div className="payments-page">
      <h2>Payments Management</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Add Payment Button */}
      <button onClick={() => setShowAddForm(true)} className="add-payment-btn">
        Add New Payment
      </button>

      {/* Add Payment Form */}
      {showAddForm && (
        <div className="add-payment-form">
          <h3>{editingPayment ? "Edit Payment" : "Add New Payment"}</h3>

          {/* Reservation Select */}
          <label>Reservation</label>
          <select
            value={newPayment.reservationId}
            onChange={(e) => handleReservationChange(e.target.value)}
          >
            <option value="">Select Reservation</option>
            {reservations.map((reservation) => (
              <option key={reservation.reservationId} value={reservation.reservationId}>
                Reservation {reservation.reservationId}
              </option>
            ))}
          </select>

          {/* Amount */}
          <label>Amount</label>
          <input
            type="number"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
          />

          {/* Payment Method */}
          <label>Payment Method</label>
          <select
            value={newPayment.paymentMethod}
            onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          {/* Payment Status */}
          <label>Status</label>
          <select
            value={newPayment.status}
            onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Save or Add Payment */}
          <button onClick={handleSavePayment}>
            {editingPayment ? "Save Changes" : "Add Payment"}
          </button>
          <button onClick={clearForm}>Cancel</button>
        </div>
      )}

      {/* Payments Table */}
      <table className="payments-table">
        <thead>
          <tr>
            <th>Reservation</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.paymentId}>
              <td>
                <button onClick={() => fetchReservationDetails(payment.reservationId)}>
                  Reservation {payment.reservationId}
                </button>
              </td>
              <td>₹{payment.amount}</td>
              <td>{payment.paymentMethod}</td>
              <td>{payment.status}</td>
              <td>
                <button onClick={() => handleEditPayment(payment)}>Edit</button>
                <button onClick={() => handleDeletePayment(payment.paymentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reservation Details */}
      {reservationDetails && (
        <div className="reservation-details">
          <h3>Reservation Details</h3>
          <p><strong>User:</strong> {reservationDetails.user?.firstName} {reservationDetails.user?.lastName}</p>
          <p><strong>Car:</strong> {reservationDetails.car?.make} {reservationDetails.car?.model}</p>
          <p><strong>Pickup Date:</strong> {reservationDetails.pickupDate}</p>
          <p><strong>Dropoff Date:</strong> {reservationDetails.dropoffDate}</p>
          <p><strong>Status:</strong> {reservationDetails.status}</p>
        </div>
      )}
    </div>
  );
};

export default Payments;
