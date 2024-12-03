import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>RoadReady Admin</h2>
      </div>
      <ul className="sidebar-links">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/cars">Cars</Link></li>
        <li><Link to="/admin/reservations">Reservations</Link></li>
        <li><Link to="/admin/reviews">Reviews</Link></li>
        <li><Link to="/login">Logout</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
