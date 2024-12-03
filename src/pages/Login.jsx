import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../styles/Login.css"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import carImage from "../assets/logincar.png"; 

function Login() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      UserName: username,
      Password: password,
    };

    try {
      const response = await axios.post("https://localhost:7087/api/Authentication/login", loginData);
      localStorage.setItem("token", response.data.token); // Store JWT token

      // Decode the JWT token to get the role and redirect accordingly
      const payload = JSON.parse(atob(response.data.token.split(".")[1])); // Decode the JWT payload
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Get role from the payload

      // Redirect based on the role
      if (role === "Admin") {
        navigate("/admin-dashboard"); // Redirect to Admin Dashboard
      } else {
        navigate("/user-dashboard"); // Redirect to User Dashboard
      }
    } catch (error) {
      setErrorMessage("Invalid credentials, please try again.");
    }
  };

  // Toggle the password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Redirect to Register page
  const redirectToRegister = () => {
    navigate("/Register");
  };

  return (
    
    <div className="login-page">
       <Navbar />
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Login to Your Account</h2>
          <p className="login-subtitle">Welcome back to RoadReady!</p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible ? "text" : "password"} 
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </button>
              </div>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="no-account">
            <p>
              Don't have an account?{" "}
              <span className="register-link" onClick={redirectToRegister}>
                Sign Up
              </span>
            </p>
          </div>
        </div>

        <div className="car-image-container">
          <img src={carImage} alt="Car" className="car-image" />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
