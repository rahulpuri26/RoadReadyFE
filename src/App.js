import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import BrowseCars from "./pages/UserDashboard/BrowseCars";
import ProfilePage from "./pages/UserDashboard/ProfilePage";
import BookReservations from "./pages/UserDashboard/BookReservations";
import MakeReviews from "./pages/UserDashboard/ReviewsUser"
import MakePayments from "./pages/UserDashboard/PaymentsUser"
import Home from "./pages/Home";
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin-dashboard/*"
          element={
            <PrivateRoute role="Admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
       <Route
          path="/user-dashboard"
          element={
            <PrivateRoute role="User">
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/browsecar" element={<BrowseCars/>}/>
         <Route path="/profilepage" element={<ProfilePage/>}/>
         <Route path="/bookreservation" element={<BookReservations/>}/>
         <Route path="/reviews" element={<MakeReviews/>}/>
         <Route path="/payment" element={<MakePayments/>}/>
      </Routes>
    </Router>
  );
}

export default App;