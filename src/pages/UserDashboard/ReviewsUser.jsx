import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/ReviewsUser.css";
import { jwtDecode } from "jwt-decode";

const ReviewsPage = () => {
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState("");
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

        const decodedToken = jwtDecode(token);
        const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

        if (!username) {
          throw new Error("Username not found in token.");
        }

        const userResponse = await axios.get(
          `https://localhost:7087/api/Users/username/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserId(userResponse.data.userId);
      } catch (err) {
        console.error("Error fetching userId:", err);
        toast.error("Failed to fetch user information. Please try again later.");
        setError("Failed to fetch user information. Please try again later.");
      }
    };

    fetchUserId();
  }, []);

  const validateReview = () => {
    let isValid = true;
    
    if (rating === 0) {
      toast.error("Please select a rating");
      isValid = false;
    }

    if (!comments.trim()) {
      toast.error("Please provide some comments");
      isValid = false;
    } else if (comments.trim().length < 10) {
      toast.error("Comments should be at least 10 characters long");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!validateReview()) {
      return;
    }

    try {
      setLoading(true);

      const reviewData = {
        userId,
        carId: 1,
        rating: rating,
        comments: comments.trim(),
      };

      await axios.post(
        "https://localhost:7087/api/Review",
        reviewData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Review submitted successfully!");
      setSubmitted(true);
      setRating(0);
      setComments("");
      setLoading(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit the review. Please try again later.");
      setLoading(false);
    }
  };

  const StarRating = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-button ${
              (hoveredRating || rating) >= star ? "active" : ""
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            <i 
              className={`fas fa-star ${
                (hoveredRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
            ></i>
          </button>
        ))}
      </div>
    );
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="reviews-container">
      <ToastContainer position="top-right" />
      <nav className="reviews-nav">
        <a href="/user-dashboard">Dashboard</a>
        <a href="/">Home</a>
      </nav>

      <h1 className="reviews-title">Post Your Review</h1>

      {!submitted ? (
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label htmlFor="rating" className="rating-label">
              <strong>Your Rating:</strong>
            </label>
            <StarRating />
            <div className="rating-text">
              {rating > 0 ? `You rated: ${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="comments">
              <strong>Comments:</strong>
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share your experience... (minimum 10 characters)"
              className="review-textarea"
              minLength={10}
              required
            />
            <div className="character-count">
              {comments.length} / 10 minimum characters
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="thank-you-message">
          <h2>Thank you for your feedback!</h2>
          <p>Your review has been submitted successfully.</p>
          <button 
            onClick={() => setSubmitted(false)} 
            className="write-another-review"
          >
            Write Another Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;