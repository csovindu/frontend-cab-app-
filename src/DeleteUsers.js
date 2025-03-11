import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Table, Button, Alert, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const RemoveUsers = () => {
  const [userList, setUserList] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: "", email: "", phonenumber: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all users with role 2 (Customers)
  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/users/all");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUserList(data.filter((user) => user.userrole === 2));
      setFetchError("");
    } catch (err) {
      setFetchError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Delete a user
  const deleteUser = async (userId) => {
    const confirmDeletion = window.confirm("Are you sure you want to remove this user?");
    if (!confirmDeletion) return;

    try {
      const response = await fetch(`http://localhost:8080/users/delete/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");

      setUserList(userList.filter((user) => user.id !== userId));
      setDeleteSuccess("User removed successfully!");
      setFetchError("");
    } catch (err) {
      setFetchError("Failed to delete user");
    }
  };

  // Start editing a user
  const handleEditClick = (user) => {
    setEditUserId(user.id);
    setEditFormData({
      username: user.username,
      email: user.email,
      phonenumber: user.phonenumber,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save edited user
  const saveEdit = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/users/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, userrole: 2 }), // Ensure userrole stays 2
      });

      if (!response.ok) throw new Error("Failed to update user");

      setUserList(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, ...editFormData } : user
        )
      );
      setEditUserId(null);
      setDeleteSuccess("User updated successfully!");
      setFetchError("");
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditUserId(null);
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-xl flex items-center">
          🚘cab booking system
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto flex items-center gap-4">
              <Nav.Link as={Link} to="/AdminHome" className="text-gray-700 hover:text-blue-600 transition font-medium">Add Car</Nav.Link>
              <Nav.Link as={Link} to="/ManageCar" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Cars</Nav.Link>
              <Nav.Link as={Link} to="/AddDriver" className="text-gray-700 hover:text-blue-600 transition font-medium">Add Driver</Nav.Link>
              <Nav.Link as={Link} to="/DeleteDrivers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Drivers</Nav.Link>
              <Nav.Link as={Link} to="/DeleteUsers" className="text-gray-700 hover:text-blue-600 transition font-medium active">Delete Users</Nav.Link>
              <Nav.Link as={Link} to="/ManageBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Bookings</Nav.Link>
              <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <h1 className="mb-4 text-center fw-bold text-primary">Manage Users</h1>

        {/* Display Messages */}
        {fetchError && <Alert variant="danger" className="text-center">{fetchError}</Alert>}
        {deleteSuccess && <Alert variant="success" className="text-center" onClose={() => setDeleteSuccess(null)} dismissible>{deleteSuccess}</Alert>}
        {loading && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}

        {/* Users Table */}
        <Table striped bordered hover responsive className="shadow-sm rounded">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3">#</th>
              <th className="py-3">Name</th>
              <th className="py-3">Email</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No users available.</td>
              </tr>
            ) : (
              userList.map((user, index) => (
                <tr key={user.id} className="align-middle">
                  <td>{index + 1}</td>
                  <td>
                    {editUserId === user.id ? (
                      <Form.Control
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleInputChange}
                        className="form-control-sm"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td>
                    {editUserId === user.id ? (
                      <Form.Control
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="form-control-sm"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editUserId === user.id ? (
                      <Form.Control
                        type="text"
                        name="phonenumber"
                        value={editFormData.phonenumber}
                        onChange={handleInputChange}
                        className="form-control-sm"
                      />
                    ) : (
                      user.phonenumber
                    )}
                  </td>
                  <td>
                    {editUserId === user.id ? (
                      <div className="d-flex gap-2">
                        <Button variant="success" size="sm" onClick={() => saveEdit(user.id)}>
                          Save
                        </Button>
                        <Button variant="secondary" size="sm" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleEditClick(user)}
                          style={{ backgroundColor: "#cce5ff", borderColor: "#b8daff", color: "#004085" }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => deleteUser(user.id)}
                          style={{ backgroundColor: "#f8d7da", borderColor: "#f5c6cb", color: "#721c24" }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default RemoveUsers;
