import React, { useState } from "react";
import { Navbar, Nav, Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function AdminHome() {
  const [formData, setFormData] = useState({
    model: "",
    licensePlate: "",
    seats: "",
    capacity: "",
    pricePerKm: "",
    photo: "",
    carType: "",
    fuelType: "",
    transmission: "",
    year: "",
    isAvailable: true,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        body: JSON.stringify({
          ...formData,
          status: formData.isAvailable ? "0" : "1", // 0 for available, 1 for unavailable
          seats: parseInt(formData.seats) || 0,
          capacity: parseInt(formData.capacity) || 0,
          pricePerKm: parseFloat(formData.pricePerKm) || 0,
          year: parseInt(formData.year) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to add car");

      setSuccess("Car added successfully!");
      setFormData({
        model: "",
        licensePlate: "",
        seats: "",
        capacity: "",
        pricePerKm: "",
        photo: "",
        carType: "",
        fuelType: "",
        transmission: "",
        year: "",
        isAvailable: true,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-5 shadow-lg border-b-2 border-gray-200">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-xl flex items-center">
          🚘cab booking system
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto flex items-center gap-4">
              <Nav.Link as={Link} to="/AdminHome" className="text-gray-700 hover:text-blue-600 transition font-medium active">Add Car</Nav.Link>
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
      <Container className="py-5">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#007bff", fontFamily: "'Poppins', sans-serif" }}>
          Add New Car
        </h2>

        <Card className="shadow-lg border-0" style={{ borderRadius: "20px", background: "#f8f9fa" }}>
          <Card.Body className="p-5">
            {error && <Alert variant="danger" className="rounded-pill text-center py-2">{error}</Alert>}
            {success && <Alert variant="success" className="rounded-pill text-center py-2" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Model</Form.Label>
                    <Form.Control
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Toyota Camry"
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">License Plate</Form.Label>
                    <Form.Control
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., ABC-1234"
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Seats</Form.Label>
                    <Form.Control
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="e.g., 5"
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Capacity (kg)</Form.Label>
                    <Form.Control
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="e.g., 500"
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Price per KM ($)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="pricePerKm"
                      value={formData.pricePerKm}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="e.g., 0.50"
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Car Type</Form.Label>
                    <Form.Select
                      name="carType"
                      value={formData.carType}
                      onChange={handleInputChange}
                      required
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    >
                      <option value="">Select Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Fuel Type</Form.Label>
                    <Form.Select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Transmission</Form.Label>
                    <Form.Select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    >
                      <option value="">Select Transmission</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Year</Form.Label>
                    <Form.Control
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="e.g., 2023"
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#ced4da" }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Availability</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      label="Car is Available"
                      className="mt-2"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Photo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="rounded-pill shadow-sm"
                  style={{ borderColor: "#ced4da" }}
                />
                {formData.photo && (
                  <div className="mt-3 text-center">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    />
                  </div>
                )}
              </Form.Group>

              <div className="text-center">
                <Button
                  type="submit"
                  style={{
                    background: "linear-gradient(45deg, #007bff, #00c4cc)",
                    border: "none",
                    padding: "10px 30px",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
                  }}
                >
                  Add Car
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .form-control:focus,
        .form-select:focus {
          border-color: #007bff !important;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
        }
      `}</style>
    </>
  );
}

export default AdminHome;