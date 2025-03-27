import React, { useState, useEffect } from "react";
import "../../styles/BookReservations.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const BookReservations = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view this page.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://localhost:7087/api/Car", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load car data. Please try again later.");
        setLoading(false);
      }
    };

    fetchCars();
  }, [navigate]);

  const calculateTotal = () => {
    if (!selectedCar || !pickupDate || !dropoffDate) return 0;
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * selectedCar.pricePerDay : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to make a reservation.");
      navigate("/login");
      return;
    }

    if (!pickupDate || !dropoffDate || !selectedCar) {
      setError("Please fill all fields before submitting.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const username =
        decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      const userResponse = await axios.get(
        `https://localhost:7087/api/Users/username/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userId = userResponse.data.userId;

      const totalAmount = calculateTotal();

      if (totalAmount <= 0) {
        setError("Pickup date must be before the dropoff date.");
        return;
      }

      const reservationData = {
        userId,
        carId: selectedCar.carId,
        pickupDate,
        dropoffDate,
        totalAmount,
        status: "Confirmed",
      };

      const reservationResponse = await axios.post(
        "https://localhost:7087/api/Reservation",
        reservationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/payment", {
        state: {
          reservationId: reservationResponse.data.reservationId,
          car: selectedCar,
          pickupDate,
          dropoffDate,
          totalAmount,
        },
      });

      alert("Booking confirmed! Redirecting to payment page.");
      setSelectedCar(null);
      setPickupDate("");
      setDropoffDate("");
    } catch (err) {
      console.error("Error creating reservation:", err);
      setError("Failed to create reservation. Please try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="book-reservations-container">
      <nav className="bookreser-nav">
        <a href="/user-dashboard">Dashboard</a>
        <a href="/">Home</a>
      </nav>

      <h1 className="book-reservations-title">Book Your Favorite Car</h1>
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.carId} className="car-card">
            <img src={car.imageUrl} alt={car.model} className="car-image" />
            <div className="car-details">
              <h2>
                {car.carId}. {car.model}
              </h2>
              <p>Price: ₹{car.pricePerDay}/day</p>
              <button onClick={() => setSelectedCar(car)}>Book Now</button>
            </div>
          </div>
        ))}
      </div>

      {selectedCar && (
        <div className="booking-form">
          <h2>Booking Details</h2>
          <form onSubmit={handleSubmit}>
            <p>
              <strong>Selected Car:</strong> {selectedCar.model}
            </p>
            <p>
              <strong>Price per Day:</strong> ₹{selectedCar.pricePerDay}
            </p>
            <div className="form-group">
              <label htmlFor="pickup-date">Pickup Date:</label>
              <input
                type="date"
                id="pickup-date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dropoff-date">Dropoff Date:</label>
              <input
                type="date"
                id="dropoff-date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                required
              />
            </div>
            <p>
              <strong>Total Price:</strong> ₹{calculateTotal()}
            </p>
            <button type="submit">Confirm Booking</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookReservations;
