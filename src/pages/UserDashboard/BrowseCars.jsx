import React, { useState, useEffect } from "react";
import "../../styles/BrowseCars.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const BrowseCars = () => {
    const [cars, setCars] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize the navigate hook for page navigation

    useEffect(() => {
        const fetchCars = async () => {
          try {
            const response = await axios.get("https://localhost:7087/api/Car"); // Replace with your actual API URL
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

  const handleBookNow = (carName) => {
    setMessage(`You have selected ${carName}. Proceed to booking!`);
    navigate("/bookreservation")
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    
    <div className="browse-cars-container">
        <div>
        <nav className="car-nav">
            <a href="/user-dashboard">Previous</a>
          <a href="/profilepage">Profile</a>
          {/* <a href="#reservations">My Reservations</a> */}
          <a href="/login">Logout</a>
        </nav>
        </div>
        
      <h1 className="browse-cars-title">Browse Cars</h1>
      <div className="cars-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            {/* <img src={car.image} alt={car.name} className="car-image" />  */}
            <div className="car-details">
              <h2>{car.carId}.{car.model} </h2>
              <h3>{car.make}</h3>
              <p>{car.description}</p>
              <div className="car-price">{car.price}</div>
              <button
                className="book-now-button"
                onClick={() => handleBookNow(car.name)}> Book Now</button>
            </div>
          </div>
        ))}
      </div>
      {message && <div className="booking-message">{message}</div>}
    </div>
  );
};

export default BrowseCars;
