import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ReviewsUser.css";
import { jwtDecode} from "jwt-decode";

const ReviewsPage = () => {
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(""); // Rating field
  const [comments, setComments] = useState(""); // Comments field
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not logged in.");
        }

        // Decode the token to get the username
        const decodedToken = jwtDecode(token);
        const username =
          decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        console.log("Decoded Token:", decodedToken);
        console.log("Username:", username);

        if (!username) {
          throw new Error("Username not found in token.");
        }

        // Fetch the userId using the username
        const userResponse = await axios.get(
          `https://localhost:7087/api/User/user/username/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User Details:", userResponse.data);

        setUserId(userResponse.data.userId); // Store the fetched userId
      } catch (err) {
        console.error("Error fetching userId:", err);
        setError("Failed to fetch user information. Please try again later.");
      }
    };

    fetchUserId();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (!userId || !rating || !comments.trim()) {
        alert("Please provide a rating and comments before submitting.");
        return;
      }

      setLoading(true);

      const reviewData = {
        userId, // Include userId
        carId: 1, // Replace with a selected carId if necessary
        rating: parseInt(rating, 10), // Ensure rating is an integer
        comments,
      };

      console.log("Submitting Review Data:", reviewData);

      const response = await axios.post(
        "https://localhost:7087/api/Review",
        reviewData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Review Submitted Successfully:", response.data);
      setSubmitted(true);
      setRating(""); // Reset rating
      setComments(""); // Reset comments
      setLoading(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit the review. Please try again later.");
      setLoading(false);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="reviews-container">
      <nav className="reviews-nav">
        <a href="/user-dashboard">Home</a>
        <a href="/login">Logout</a>
      </nav>

      <h1 className="reviews-title">Post Your Review</h1>

      {!submitted ? (
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label htmlFor="rating">
              <strong>Rating (1-5):</strong>
            </label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="comments">
              <strong>Comments:</strong>
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share your experience..."
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="thank-you-message">
          <h2>Thank you for your feedback!</h2>
          <p>Your review has been submitted successfully.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
