import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminNavbar.css";

const AdminNavbar = ({ handleLogout }) => {
  return (
    <div className="admin-navbar">
      <div className="navbar-title">🚘RoadReady</div>
      <div className="navbar-nav">
        <ul>
          <li>
            <NavLink to="/admin-dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/users" className={({ isActive }) => isActive ? "active-link" : ""}>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/cars" className={({ isActive }) => isActive ? "active-link" : ""}>
              Cars
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/reservations" className={({ isActive }) => isActive ? "active-link" : ""}>
              Reservations
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin-dashboard/payments" className={({ isActive }) => isActive ? "active-link" : ""}>
              Payments
            </NavLink>
          </li>
        </ul>
      </div>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminNavbar;
