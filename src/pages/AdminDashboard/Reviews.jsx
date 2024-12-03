import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('https://localhost:7087/api/Review');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="reviews">
      <AdminNavbar />
      <h2>Manage Reviews</h2>
      <table>
        <thead>
          <tr>
            <th>Review ID</th>
            <th>User</th>
            <th>Car</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.reviewId}>
              <td>{review.reviewId}</td>
              <td>{review.userName}</td>
              <td>{review.carModel}</td>
              <td>{review.rating}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviews;
