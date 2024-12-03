import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import carImage from "../assets/logincar.png";
import { toast } from "react-toastify"; // Import Toastify

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phoneNumber: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Perform validation checks
    if (name === "email") {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          email: "",
        }));
      }
    }

    if (name === "password") {
      if (value.length < 8) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be at least 8 characters long.",
        }));
      } else if (!/[A-Z]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must include at least one uppercase letter.",
        }));
      } else if (!/[a-z]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must include at least one lowercase letter.",
        }));
      } else if (!/[0-9]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must include at least one number.",
        }));
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must include at least one special character.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          password: "",
        }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match.",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "",
        }));
      }
    }

    if (name === "username" && value.trim() === "") {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username is required.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        username: "",
      }));
    }

    if (name === "phoneNumber" && value.trim() === "") {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number is required.",
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "",
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if all fields are filled before submitting
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Check for validation errors
    if (validationErrors.email || validationErrors.password || validationErrors.confirmPassword || validationErrors.username || validationErrors.phoneNumber) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7087/api/Authentication/register", {
        UserName: formData.username,
        Email: formData.email,
        Password: formData.password,
        PhoneNumber: formData.phoneNumber,
        Role: "User", // Default role is "User"
      });

      setSuccessMessage("Registration successful! Redirecting to login...");
      setErrorMessage("");
      toast.success("Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to register. Please try again."
      );
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      <div className="register-container">
        {/* Registration Form */}
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
                required
              />
              {validationErrors.username && <p className="validation-error">{validationErrors.username}</p>}
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
                required
              />
              {validationErrors.email && <p className="validation-error">{validationErrors.email}</p>}
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
                required
              />
              {validationErrors.password && <p className="validation-error">{validationErrors.password}</p>}
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
                required
              />
              {validationErrors.confirmPassword && (
                <p className="validation-error">{validationErrors.confirmPassword}</p>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              {validationErrors.phoneNumber && <p className="validation-error">{validationErrors.phoneNumber}</p>}
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
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
