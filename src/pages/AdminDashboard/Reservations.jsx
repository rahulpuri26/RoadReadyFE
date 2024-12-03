import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Reservations.css"; 

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]); 
  const [newReservation, setNewReservation] = useState({
    userId: "",
    carId: "",
    pickupDate: "",
    dropoffDate: "",
    totalAmount: "",
    status: "",
  });
  const [editingReservation, setEditingReservation] = useState(null); 
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); 
  const [reservationsPerPage] = useState(5); 

  // Fetch reservations, cars, and users from the server
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Fetch the token from localStorage
      if (!token) {
        setError("You need to login first.");
        return;
      }

      try {
        const reservationsResponse = await axios.get("https://localhost:7087/api/Reservation", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const carsResponse = await axios.get("https://localhost:7087/api/Car", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersResponse = await axios.get("https://localhost:7087/api/Users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reservationsWithDetails = reservationsResponse.data.map((reservation) => {
          const user = usersResponse.data.find((user) => user.userId === reservation.userId);
          const car = carsResponse.data.find((car) => car.carId === reservation.carId);

          return {
            ...reservation,
            user: user || null,
            car: car || null,
          };
        });

        setReservations(reservationsWithDetails);
        setCars(carsResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        setError("Failed to load reservations.");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Calculate total amount functionality
  const calculateTotalAmount = () => {
    const { pickupDate, dropoffDate, carId } = newReservation;

    if (pickupDate && dropoffDate && carId) {
      const car = cars.find((car) => car.carId === parseInt(carId));
      if (car) {
        const start = new Date(pickupDate);
        const end = new Date(dropoffDate);

        if (start < end) {
          const days = (end - start) / (1000 * 3600 * 24); 
          const totalAmount = days * car.pricePerDay;

          setNewReservation({ ...newReservation, totalAmount });
          return;
        }
      }
    }
    setError("Please fill out Pickup Date, Dropoff Date, and select a valid Car.");
  };

  // Add new reservation functionality
  const handleAddReservation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to login first.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7087/api/Reservation", newReservation, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const addedReservation = {
        ...response.data,
        user: users.find((user) => user.userId === response.data.userId),
        car: cars.find((car) => car.carId === response.data.carId),
      };

      setReservations([...reservations, addedReservation]);
      setShowAddForm(false);
      setNewReservation({
        userId: "",
        carId: "",
        pickupDate: "",
        dropoffDate: "",
        totalAmount: "",
        status: "",
      });
    } catch (err) {
      setError("Failed to add reservation.");
      console.error(err);
    }
  };

  const handleEditReservation = (reservation) => {
    setEditingReservation(reservation);
    setShowAddForm(true);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to login first.");
      return;
    }

    try {
      const response = await axios.put("https://localhost:7087/api/Reservation", editingReservation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(
        reservations.map((reservation) =>
          reservation.reservationId === response.data.reservationId ? response.data : reservation
        )
      );
      setEditingReservation(null);
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to update reservation.");
      console.error(err);
    }
  };

  const handleDelete = async (reservationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to login first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await axios.delete(`https://localhost:7087/api/Reservation/${reservationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(reservations.filter((reservation) => reservation.reservationId !== reservationId));
      } catch (err) {
        setError("Failed to delete reservation.");
        console.error(err);
      }
    }
  };

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const totalPages = Math.ceil(reservations.length / reservationsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="reservations-page">
      <h2>Reservations Management</h2>
      {error && <p className="error-message">{error}</p>}

      <button onClick={() => setShowAddForm(true)} className="add-reservation-btn">
        Add New Reservation
      </button>

      {showAddForm && (
        <div className="add-reservation-form">
          <h3>{editingReservation ? "Edit Reservation" : "Add New Reservation"}</h3>
          <label>User</label>
          <select
            value={newReservation.userId || editingReservation?.userId}
            onChange={(e) =>
              editingReservation
                ? setEditingReservation({ ...editingReservation, userId: e.target.value })
                : setNewReservation({ ...newReservation, userId: e.target.value })
            }
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>

          <label>Car</label>
          <select
            value={newReservation.carId || editingReservation?.carId}
            onChange={(e) =>
              editingReservation
                ? setEditingReservation({ ...editingReservation, carId: e.target.value })
                : setNewReservation({ ...newReservation, carId: e.target.value })
            }
          >
            <option value="">Select Car</option>
            {cars.map((car) => (
              <option key={car.carId} value={car.carId}>
                {car.model}
              </option>
            ))}
          </select>

          <label>Pickup Date</label>
          <input
            type="date"
            value={newReservation.pickupDate || editingReservation?.pickupDate}
            onChange={(e) =>
              editingReservation
                ? setEditingReservation({ ...editingReservation, pickupDate: e.target.value })
                : setNewReservation({ ...newReservation, pickupDate: e.target.value })
            }
          />

          <label>Dropoff Date</label>
          <input
            type="date"
            value={newReservation.dropoffDate || editingReservation?.dropoffDate}
            onChange={(e) =>
              editingReservation
                ? setEditingReservation({ ...editingReservation, dropoffDate: e.target.value })
                : setNewReservation({ ...newReservation, dropoffDate: e.target.value })
            }
          />

          <label>Total Amount</label>
          <input
            type="number"
            value={newReservation.totalAmount || editingReservation?.totalAmount}
            readOnly
          />

          <button onClick={calculateTotalAmount}>Calculate Total Amount</button>

          <label>Status</label>
          <select
            value={newReservation.status || editingReservation?.status}
            onChange={(e) =>
              editingReservation
                ? setEditingReservation({ ...editingReservation, status: e.target.value })
                : setNewReservation({ ...newReservation, status: e.target.value })
            }
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>

          <button onClick={editingReservation ? handleSaveEdit : handleAddReservation}>
            {editingReservation ? "Save Changes" : "Add Reservation"}
          </button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      <table className="reservations-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Car</th>
            <th>Pickup Date</th>
            <th>Dropoff Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentReservations.map((reservation) => (
            <tr key={reservation.reservationId}>
              <td>{reservation.user?.firstName || "N/A"} {reservation.user?.lastName || ""}</td>
              <td>{reservation.car?.model || "N/A"}</td>
              <td>{reservation.pickupDate}</td>
              <td>{reservation.dropoffDate}</td>
              <td>{reservation.totalAmount}</td>
              <td>{reservation.status}</td>
              <td>
                <button onClick={() => handleEditReservation(reservation)}>Edit</button>
                <button onClick={() => handleDelete(reservation.reservationId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Reservations;
