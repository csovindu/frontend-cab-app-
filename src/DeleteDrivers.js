import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Table, Button, Alert, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const RemoveDrivers = () => {
  const [driverList, setDriverList] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [editDriverId, setEditDriverId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: "", email: "", phonenumber: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all drivers
  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/users/all");
      if (!response.ok) throw new Error("Failed to load drivers");
      const data = await response.json();
      setDriverList(data.filter(user => user.userrole === 1));
      setFetchError(null);
    } catch (err) {
      setFetchError("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  // Delete a driver
  const deleteDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to remove this driver?")) return;

    try {
      const response = await fetch(`http://localhost:8080/users/delete/${driverId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove driver");

      setDeleteSuccess("Driver removed successfully!");
      setFetchError(null);
      loadDrivers();
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // Start editing a driver
  const handleEditClick = (driver) => {
    setEditDriverId(driver.id);
    setEditFormData({
      username: driver.username,
      email: driver.email,
      phonenumber: driver.phonenumber,
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save edited driver
  const saveEdit = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:8080/users/update/${driverId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editFormData, userrole: 1 }),
      });

      if (!response.ok) throw new Error("Failed to update driver");

      setDriverList(prev =>
        prev.map(driver =>
          driver.id === driverId ? { ...driver, ...editFormData } : driver
        )
      );
      setEditDriverId(null);
      setDeleteSuccess("Driver updated successfully!");
      setFetchError(null);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditDriverId(null);
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
              <Nav.Link as={Link} to="/DeleteDrivers" className="text-gray-700 hover:text-blue-600 transition font-medium active">Delete Drivers</Nav.Link>
              <Nav.Link as={Link} to="/DeleteUsers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Users</Nav.Link>
              <Nav.Link as={Link} to="/ManageBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Bookings</Nav.Link>
              <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <h1 className="mb-4 text-center fw-bold text-primary">Manage Drivers</h1>

        {/* Display Messages */}
        {fetchError && <Alert variant="danger" className="text-center">{fetchError}</Alert>}
        {deleteSuccess && <Alert variant="success" className="text-center" onClose={() => setDeleteSuccess(null)} dismissible>{deleteSuccess}</Alert>}
        {loading && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}

        {/* Drivers Table */}
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
            {driverList.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No drivers available.</td>
              </tr>
            ) : (
              driverList.map((driver, index) => (
                <tr key={driver.id} className="align-middle">
                  <td>{index + 1}</td>
                  <td>
                    {editDriverId === driver.id ? (
                      <Form.Control
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleInputChange}
                        className="form-control-sm"
                      />
                    ) : (
                      driver.username
                    )}
                  </td>
                  <td>
                    {editDriverId === driver.id ? (
                      <Form.Control
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="form-control-sm"
                      />
                    ) : (
                      driver.email
                    )}
                  </td>
                  <td>
                    {editDriverId === driver.id ? (
                      <Form.Control
                        type="text"
                        name="phonenumber"
                        value={editFormData.phonenumber}
                        onChange={handleInputChange}
                        className="form-control-sm"
                      />
                    ) : (
                      driver.phonenumber
                    )}
                  </td>
                  <td>
                    {editDriverId === driver.id ? (
                      <div className="d-flex gap-2">
                        <Button variant="success" size="sm" onClick={() => saveEdit(driver.id)}>
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
                          onClick={() => handleEditClick(driver)}
                          style={{ backgroundColor: "#cce5ff", borderColor: "#b8daff", color: "#004085" }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => deleteDriver(driver.id)}
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

export default RemoveDrivers;