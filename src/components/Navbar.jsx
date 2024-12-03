import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(""); // For role-based navigation
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Decode the JWT token to fetch user role (Assuming role is stored in JWT payload)
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    } else {
      setIsAuthenticated(false);
      setUserRole("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole("");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="navbar-brand">RoadReady</span> {/* Text only, non-clickable */}
        </div>

        {/* Links Section */}
        <div className="navbar-links">
          <ul>
            {!isAuthenticated ? (
              <>
              <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/login" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={({ isActive }) => (isActive ? "active-link" : "")}>
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {userRole === "Admin" ? (
                  <li>
                    <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? "active-link" : "")}>
                      Admin Dashboard
                    </NavLink>
                  </li>
                ) : (
                  <li>
                    <NavLink to="/user-dashboard" className={({ isActive }) => (isActive ? "active-link" : "")}>
                      User Dashboard
                    </NavLink>
                  </li>
                )}
                <li>
                  <span className="navbar-link logout" onClick={handleLogout}>
                    Logout
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
