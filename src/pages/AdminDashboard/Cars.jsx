import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Cars.css";  

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(5); 
  const [editingCar, setEditingCar] = useState(null);
  const [newCar, setNewCar] = useState({
    carId: 0,
    make: "",
    model: "",
    year: "",
    color: "",
    pricePerDay: "",
    availabilityStatus: "Available",
    description: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch cars from the server
  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem("token"); // Fetch the token from localStorage
      if (!token) {
        setError("You need to login first.");
        return;
      }

      try {
        const response = await axios.get("https://localhost:7087/api/Car", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });
        setCars(response.data);
      } catch (err) {
        setError("Failed to load cars.");
        console.error(err);
      }
    };

    fetchCars();
  }, []); // Fetch the cars when the component mounts

  // Add new car functionality
  const handleAddCar = async () => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      setError("You need to login first.");
      return;
    }

    try {
      const response = await axios.post("https://localhost:7087/api/Car", newCar, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      setCars([...cars, response.data]); 
      setShowAddForm(false); 
      setNewCar({
        carId: 0, 
        make: "",
        model: "",
        year: "",
        color: "",
        pricePerDay: "",
        availabilityStatus: "Available",
        description: "",
        imageUrl: "",
      }); // Clear form
    } catch (err) {
      setError("Failed to add car.");
      console.error(err);
    }
  };

  // Delete car functionality
  const handleDelete = async (carId) => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      setError("You need to login first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`https://localhost:7087/api/Car/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });
        setCars(cars.filter((car) => car.carId !== carId));
      } catch (err) {
        setError("Failed to delete car.");
        console.error(err);
      }
    }
  };

  // Save car after editing
  const handleSaveEdit = async (editedCar) => {
    const token = localStorage.getItem("token"); // Fetch the token from localStorage
    if (!token) {
      setError("You need to login first.");
      return;
    }

    try {
      await axios.put("https://localhost:7087/api/Car", editedCar, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      });
      setCars(cars.map((car) => (car.carId === editedCar.carId ? editedCar : car)));
      setEditingCar(null);
    } catch (err) {
      setError("Failed to update car.");
      console.error(err);
    }
  };

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const totalPages = Math.ceil(cars.length / carsPerPage);

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
    <div className="cars-page">
      <h2>Car Management</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Button to show add car form */}
      <button onClick={() => setShowAddForm(true)} className="add-car-btn">
        Add New Car
      </button>

      {/* Add Car Form */}
      {showAddForm && (
        <div className="add-car-form">
          <h3>Add New Car</h3>
          <input
            type="text"
            placeholder="Car Make"
            value={newCar.make}
            onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
          />
          <input
            type="text"
            placeholder="Car Model"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          />
          <input
            type="number"
            placeholder="Year"
            value={newCar.year}
            onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
          />
          <input
            type="text"
            placeholder="Car Color"
            value={newCar.color}
            onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price Per Day"
            value={newCar.pricePerDay}
            onChange={(e) => setNewCar({ ...newCar, pricePerDay: e.target.value })}
          />
          <select
            value={newCar.availabilityStatus}
            onChange={(e) => setNewCar({ ...newCar, availabilityStatus: e.target.value })}
          >
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
          <textarea
            placeholder="Description"
            value={newCar.description}
            onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newCar.imageUrl}
            onChange={(e) => setNewCar({ ...newCar, imageUrl: e.target.value })}
          />
          <button onClick={handleAddCar}>Add Car</button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      )}

      {/* Cars Table */}
      <table className="cars-table">
        <thead>
          <tr>
            <th>Car Make</th>
            <th>Car Model</th>
            <th>Year</th>
            <th>Color</th>
            <th>Price Per Day</th>
            <th>Availability</th>
            <th>Description</th>
            <th>Car Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCars.map((car) =>
            editingCar?.carId === car.carId ? (
              <tr key={car.carId}>
                <td>
                  <input
                    type="text"
                    value={editingCar.make}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, make: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingCar.model}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, model: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editingCar.year}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, year: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingCar.color}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, color: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={editingCar.pricePerDay}
                    onChange={(e) =>
                      setEditingCar({
                        ...editingCar,
                        pricePerDay: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={editingCar.availabilityStatus}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, availabilityStatus: e.target.value })
                    }
                  >
                    <option value="Available">Available</option>
                    <option value="Rented">Rented</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </td>
                <td>
                  <textarea
                    value={editingCar.description}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, description: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingCar.imageUrl}
                    onChange={(e) =>
                      setEditingCar({ ...editingCar, imageUrl: e.target.value })
                    }
                    placeholder="Image URL"
                  />
                </td>
                <td>
                  <button onClick={() => handleSaveEdit(editingCar)}>Save</button>
                  <button onClick={() => setEditingCar(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={car.carId}>
                <td>{car.make}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td>{car.color}</td>
                <td>{car.pricePerDay}</td>
                <td>{car.availabilityStatus}</td>
                <td>{car.description}</td>
                <td>
                  <img
                    src={car.imageUrl}
                    alt={car.model}
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingCar(car)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(car.carId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
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

export default Cars;
