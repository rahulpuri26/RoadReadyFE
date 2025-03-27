import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import "../styles/Register.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import carImage from "../assets/logincar.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    general: ""
  });

  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value.trim()) {
          error = "Username is required";
        } else if (value.trim().length < 3) {
          error = "Username must be at least 3 characters long";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(value)) {
          error = "Password must include at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          error = "Password must include at least one lowercase letter";
        } else if (!/[0-9]/.test(value)) {
          error = "Password must include at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Password must include at least one special character";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case "phoneNumber":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\d{10}$/.test(value.replace(/[-()\s]/g, ''))) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: "",
      general: ""
    }));

    // Validate confirm password when password changes
    if (name === "password" && formData.confirmPassword) {
      const confirmPasswordError = value !== formData.confirmPassword ? "Passwords do not match" : "";
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmPasswordError
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7087/api/Authentication/register", {
        UserName: formData.username,
        Email: formData.email,
        Password: formData.password,
        PhoneNumber: formData.phoneNumber,
        Role: "User"
      });

      // Show success message
      toast.success("Registration successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Redirect after delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      setErrors(prev => ({
        ...prev,
        general: errorMessage
      }));
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      <ToastContainer />
      <div className="register-container">
        <div className="register-form-container">
          <h2 className="register-title">Create Your Account</h2>
          <p className="register-subtitle">Join RoadReady and start your journey today!</p>
          <form className="register-form" onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "error-input" : ""}
              />
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error-input" : ""}
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "error-input" : ""}
              />
              {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
            </div>

            {errors.general && <div className="error-message">{errors.general}</div>}
            
            <button type="submit" className="register-btn">Register</button>
          </form>
        </div>

        <div className="car-image-container">
          <img src={carImage} alt="Car" className="car-image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;