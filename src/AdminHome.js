import React, { useState } from "react";
import { Navbar, Nav, Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function AdminHome() {
  const [formData, setFormData] = useState({
    model: "",
    licensePlate: "",
    seats: "",
    capacity: "",
    pricePerKm: "",
    photo: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Resize and encode image to Base64
  const resizeImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const maxSize = 500;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > width && height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        callback(canvas.toDataURL("image/jpeg"));
      };
    };
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, (resizedBase64) => {
        setFormData((prev) => ({ ...prev, photo: resizedBase64 }));
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:8080/cars/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "0" }),
      });

      if (!response.ok) throw new Error("Failed to add car");

      setSuccess("Car added successfully!");
      setFormData({ model: "", licensePlate: "", seats: "", capacity: "", pricePerKm: "", photo: "" });
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
      🚗 Rent-A-Car
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarContent" />
    <Navbar.Collapse id="navbarContent">
      <Nav className="ms-auto flex items-center gap-4">
        <Nav.Link onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition font-medium">Add Car</Nav.Link>
        <Nav.Link as={Link} to="/ManageCar" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Cars</Nav.Link>
        <Nav.Link as={Link} to="/AddDriver" className="text-gray-700 hover:text-blue-600 transition font-medium">Add Driver</Nav.Link>
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


      {/* Add Car Form */}
      <Container>
        <h2 className="mb-4">Add New Car</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control type="text" name="model" value={formData.model} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>License Plate</Form.Label>
            <Form.Control type="text" name="Number Plate" value={formData.licensePlate} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Seats</Form.Label>
            <Form.Control type="number" name="seats" value={formData.seats} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capacity</Form.Label>
            <Form.Control type="number" name="licensePlate" value={formData.capacity} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price per KM</Form.Label>
            <Form.Control type="number" step="0.01" name="pricePerKm" value={formData.pricePerKm} onChange={handleInputChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Photo</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Car
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default AdminHome;
