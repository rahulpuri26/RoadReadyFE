import React, { useState, useEffect } from "react";
import "../../styles/BookReservations.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReservationService from "../../services/ReservationService";
import {jwtDecode} from "jwt-decode";
import { computeHeadingLevel } from "@testing-library/react";

const BookReservations = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [pickupDate, setPickupDate] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user,setUser] = useState([]);
    const [updatedUser,setUpdatedUser] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            const token = localStorage.getItem("token"); // Check if the user is logged in by checking localStorage for token
    
          try {
            const response = await axios.get("https://localhost:7087/api/Car"); // Replace with your API endpoint
            setCars(response.data); // Assuming the API returns an array of car objects
            setLoading(false);
          } catch (err) {
            console.error("Error fetching cars:", err);
            setError("Failed to load car data. Please try again later.");
            setLoading(false);
          }
        };
    
        fetchCars();
      }, []);
    
  const handleBookNow = (car) => {
    setSelectedCar(car);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token); // Decode the token
    const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    await axios
            .get(`https://localhost:7087/api/User/user/userName/${username}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then(async (response) => {
                console.log("User Details Fetched:", response.data);
                setUser(response.data); // Store the full user details
  
                setUpdatedUser(response.data);
                if (response.data){
                  setLoading(false);
                }
                console.log("updateduser=========",response.data);
  
  
                console.log("data=========",response.data);
                console.log("userid==+++++++++",response.data.userId);


                const totalAmount = calculateTotal();
                const reservationData = {
                  carId: selectedCar.carId,
                  userId: response.data.userId, // Replace with the logged-in user's ID
                  pickupDate,
                  dropoffDate,
                  //paymentMethod,
                  totalAmount,
                  status: "Booked"
                };
                try {
                    console.log("data +++++++++",reservationData);
                  const response = await axios.post(
                    "https://localhost:7087/api/Reservation", 
                    reservationData
                  );
                
                  console.log("Response data ===+++++",response.data);
            
                  //const response1 = ReservationService.addReservation(reservationData);
                  navigate("/payment", {
                    state: {
                      reservationId: response.data.reservationId, // Assuming the backend returns reservation ID
                      car: selectedCar,
                      pickupDate,
                      dropoffDate,
                      totalAmount,
                    },
                  });
                  alert(`Booking confirmed!!!! Now You will be directed to Payments Page`);
                } catch (err) {
                  console.error("Error creating reservation:", err);
                  alert("Failed to create reservation. Please try again later.");
                }
                // Reset form
                setSelectedCar(null);
                setPickupDate("");
                setDropoffDate("");
  })  };

  const calculateTotal = () => {
    if (!selectedCar || !pickupDate || !dropoffDate) return 0;
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * selectedCar.pricePerDay : 0;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="book-reservations-container">
      <nav className="bookreser-nav">
        <a href="/user-dashboard">Home</a>
        <a href="/login">Logout</a>
      </nav>
      
      <h1 className="book-reservations-title">Book Your Favorite Car</h1>
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            {/* <img src={car.image} alt={car.name} className="car-image" /> */}
            <div className="car-details">
              <h2>{car.carId}.{car.model}</h2>
              <p>Price: ${car.pricePerDay}/day</p>
              <button onClick={() => handleBookNow(car)}>Book Now</button>
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
              <strong>Price per Day:</strong> ${selectedCar.pricePerDay}
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
            {/* <div className="form-group">
              <label htmlFor="payment-method">Payment Method:</label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div> */}
            <p>
              <strong>Total Price:</strong> ${calculateTotal()}
            </p>
            <button type="submit">Confirm Booking</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookReservations;
