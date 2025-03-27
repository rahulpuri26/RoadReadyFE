import React, { useState, useEffect } from "react";
import "../../styles/BrowseCars.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BrowseCars = () => {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("https://localhost:7087/api/Car"); // Ensure this is the correct API URL
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

  const handleBookNow = (carModel) => {
    setMessage(`You have selected ${carModel}. Proceed to booking!`);
    navigate("/bookreservation");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="browse-cars-container">
      <div>
        <nav className="car-nav">
          <a href="/user-dashboard">Dashboard</a>
          <a href="/profilepage">Profile</a>
          <a href="/login">Logout</a>
        </nav>
      </div>

      <h1 className="browse-cars-title">Browse Cars</h1>
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.carId} className="car-card">
            <img src={car.imageUrl} alt={car.model} className="car-image" />
            <div className="car-details">
              <h2>{car.carId}. {car.model}</h2>
              <h3>{car.make}</h3>
              <p>{car.description}</p>
              <div className="car-price">₹{car.pricePerDay} per day</div>
              <button
                className="book-now-button"
                onClick={() => handleBookNow(car.model)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && <div className="booking-message">{message}</div>}
    </div>
  );
};

export default BrowseCars;
