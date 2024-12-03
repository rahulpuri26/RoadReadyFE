import React, { useEffect, useState } from "react";
import UserService from "../../services/UserService"; 
import "../../styles/Users.css"; 

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); 
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // Delete user functionality
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(userId);
        setUsers(users.filter((user) => user.userId !== userId));
      } catch (err) {
        setError("Failed to delete user.");
        console.error(err);
      }
    }
  };

  // Save user after editing
  const handleSaveEdit = async (editedUser) => {
    try {
      await UserService.updateUser(editedUser);
      setUsers(
        users.map((user) =>
          user.userId === editedUser.userId ? editedUser : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user.");
      console.error(err);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

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
    <div className="users-page">
      <h2>User Management</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) =>
            editingUser?.userId === user.userId ? (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        lastName: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingUser.phoneNumber}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                  >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleSaveEdit(editingUser)}>
                    Save
                  </button>
                  <button onClick={() => setEditingUser(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.userId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
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

export default Users;
