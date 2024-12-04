import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/UserNav.css";

const UserNav = ({ handleLogout }) => {
  return (
    <nav className="user-nav">
      <div className="nav-brand">RoadReady</div>
      <ul className="nav-links">
        <li>
          <NavLink to="profile">Profile</NavLink>
        </li>
        <li>
          <NavLink to="browse-cars">Browse Cars</NavLink>
        </li>
        <li>
          <NavLink to="book-reservation">Reservations</NavLink>
        </li>
        <li>
          <NavLink to="reviews">Reviews</NavLink>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default UserNav;
