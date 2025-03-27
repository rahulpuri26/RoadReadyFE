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
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: ""
  }); 
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const navigate = useNavigate(); 

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
      general: ""
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous general error
    setErrors(prev => ({ ...prev, general: "" }));

    // Validate form
    if (!validateForm()) {
      return;
    }

    const loginData = {
      UserName: username,
      Password: password,
    };

    try {
      const response = await axios.post("https://localhost:7087/api/Authentication/login", loginData);
      localStorage.setItem("token", response.data.token);

      const payload = JSON.parse(atob(response.data.token.split(".")[1]));
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Admin") {
        navigate("/admin-dashboard"); 
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: "Invalid credentials, please try again."
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

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
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors(prev => ({ ...prev, username: "" }));
                  }
                }}
                className={errors.username ? "error-input" : ""}
              />
              {errors.username && <div className="error-message">{errors.username}</div>}
            </div>

            <div className="input-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={passwordVisible ? "text" : "password"} 
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: "" }));
                    }
                  }}
                  className={errors.password ? "error-input" : ""}
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
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {errors.general && <div className="error-message">{errors.general}</div>}

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