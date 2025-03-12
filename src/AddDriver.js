import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function AdminHome() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    userrole: 1,
    status: 0
  });

  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Fetch driver list
  const fetchDrivers = async () => {
    try {
      const response = await fetch("http://localhost:8080/users/drivers");
      if (!response.ok) throw new Error("Failed to fetch drivers");
      const data = await response.json();
      setDrivers(data);
    } catch (err) {
      setError("Error fetching driver list.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (Add Driver)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate input fields
    if (!formData.username || !formData.email || !formData.phonenumber || !formData.password) {
      setError("All fields are required.");
      return;
    }

    // Check for duplicate email (case-insensitive)
    if (drivers.some(driver => driver.email.toLowerCase() === formData.email.toLowerCase())) {
      setError("Email already exists.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users/staffregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add driver");

      setSuccess("Driver added successfully!");
      setFormData({ username: "", email: "", phonenumber: "", password: "", userrole: 1, status: 0 });
      fetchDrivers(); // Refresh driver list
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200">
  <Container>
    <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-xl flex items-center">
    🚘 Cab Booking System
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarContent" />
    <Navbar.Collapse id="navbarContent">
      <Nav className="ms-auto flex items-center gap-4">
        <Nav.Link as={Link} to="/AdminHome"className="text-gray-700 hover:text-blue-600 transition font-medium">Add Car</Nav.Link>
        <Nav.Link as={Link} to="/ManageCar" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Cars</Nav.Link>
        <Nav.Link onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition font-medium">Add Driver</Nav.Link>
        <Nav.Link as={Link} to="/DeleteDrivers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Drivers</Nav.Link>
        <Nav.Link as={Link} to="/DeleteUsers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Users</Nav.Link>
        <Nav.Link as={Link} to="/ManageBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Bookings</Nav.Link>
        <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      <Container>
        <h2 className="text-center mb-4">Manage Drivers</h2>

        {/* Display Error or Success Messages */}
       {/* {error && <Alert variant="danger" className="text-center">{error}</Alert>}*/}
        {success && <Alert variant="success" className="text-center">{success}</Alert>}

        {/* Add Driver Form */}
        <Form onSubmit={handleSubmit} className="mb-4">
          <h4>Add New Driver</h4>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="phonenumber" value={formData.phonenumber} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          </Form.Group>

          <Button variant="primary" type="submit">Add Driver</Button>
        </Form>
      </Container>
    </>
  );
}

export default AdminHome;
