import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import "../styles/Home.css";
import heroImage from "../assets/hero_banner.jpg";

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("https://localhost:7087/api/Review");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleReservationClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/user-dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <img src={heroImage} alt="Hero" className="hero-image" />
        <div className="hero-overlay">
          <h1 className="hero-title">Welcome to RoadReady</h1>
          <p className="hero-subtitle">
            Your trusted car rental service for every journey.
          </p>
          <button className="book-reservation-btn" onClick={handleReservationClick}>
            Book Your Reservation
          </button>
        </div>
      </div>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Car Rentals</h3>
            <p>Affordable and reliable car rental services tailored to your needs.</p>
          </div>
          <div className="service-card">
            <h3>Flexible Booking</h3>
            <p>Book your car with flexible options for pick-up and drop-off dates.</p>
          </div>
          <div className="service-card">
            <h3>24/7 Support</h3>
            <p>Get assistance anytime with our 24/7 customer support team.</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="section-title">Testimonials By Our Customers</h2>
        <div className="reviews-carousel">
          {reviews.map((review) => (
            <div key={review.reviewId} className="review-card">
              <h4 className="review-title">{review.carModel || "General Review"}</h4>
              <p className="review-body">{review.comments}</p>
              <p className="review-rating">Rating: {review.rating} / 5</p>
              <p className="review-author">- {review.userName || "Anonymous"}</p>
              <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
