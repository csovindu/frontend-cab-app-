import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [carList, setCarList] = useState([]); // Store car data from backend
  const [fetchError, setFetchError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const [carToEdit, setCarToEdit] = useState(null); // Selected car for editing

  // Fetch all cars from backend
  const loadCarData = () => {
    fetch("http://localhost:8080/cars/all")
      .then((response) => response.json())
      .then((data) => setCarList(data))
      .catch(() => setFetchError("Failed to fetch car details"));
  };

  // Fetch cars when the component loads
  useEffect(() => {
    loadCarData();
  }, []);

  // Open Edit Modal
  const openEditModal = (car) => {
    setCarToEdit(car);
    setIsEditModalOpen(true);
  };

  // Handle Edit Input Change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCarToEdit((prevCar) => ({ ...prevCar, [name]: value }));
  };

  // Handle Save Changes
  const saveCarChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/cars/update/${carToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carToEdit),
      });

      if (!response.ok) throw new Error("Failed to update car details");

      setIsEditModalOpen(false);
      loadCarData(); // Refresh car list
    } catch (error) {
      setFetchError("Error updating car details");
    }
  };

  // Handle Delete Car
  const removeCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const response = await fetch(`http://localhost:8080/cars/delete/${carId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete car");

      loadCarData(); // Refresh car list after deletion
    } catch (error) {
      setFetchError("Error deleting car");
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
        <Nav.Link as={Link} to="/AdminHome"className="text-gray-700 hover:text-blue-600 transition font-medium">Add Car</Nav.Link>
        <Nav.Link onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Cars</Nav.Link>
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

      {/* Display Error if Fetch Fails */}
      {fetchError && <p className="text-danger text-center">{fetchError}</p>}

      {/* Car Gallery */}
      <Container>
        <h2 className="text-center mb-4">Available Cars</h2>
        <div className="d-flex flex-wrap justify-content-center">
          {carList.length === 0 ? (
            <p>No cars available.</p>
          ) : (
            carList.map((car, index) => (
              <Card key={index} className="m-2 shadow" style={{ width: "18rem" }}>
                <Card.Img variant="top" src={car.photo} alt="Car" style={{ height: "200px", objectFit: "cover" }} />
                <Card.Body>
                  <Card.Title>{car.model}</Card.Title>
                  <Card.Text>
                    <strong>License Plate:</strong> {car.licensePlate} <br />
                    <strong>Seats:</strong> {car.seats} <br />
                    <strong>Capacity:</strong> {car.capacity} <br />
                    <strong>Price per KM:</strong> ${car.pricePerKm} <br />
                    <strong>Status:</strong> {car.status === "0" ? "Available" : "Not Available"}
                  </Card.Text>
                  <Button variant="warning" className="me-2" onClick={() => openEditModal(car)}>Edit</Button>
                  <Button variant="danger" onClick={() => removeCar(car.id)}>Delete</Button>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </Container>

      {/* Edit Car Modal */}
      <Modal show={isEditModalOpen} onHide={() => setIsEditModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {carToEdit && (
            <Form onSubmit={saveCarChanges}>
              <Form.Group className="mb-3">
                <Form.Label>Model</Form.Label>
                <Form.Control type="text" name="model" value={carToEdit.model} onChange={handleEditInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>License Plate</Form.Label>
                <Form.Control type="text" name="licensePlate" value={carToEdit.licensePlate} onChange={handleEditInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Seats</Form.Label>
                <Form.Control type="number" name="seats" value={carToEdit.seats} onChange={handleEditInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Capacity</Form.Label>
                <Form.Control type="number" name="capacity" value={carToEdit.capacity} onChange={handleEditInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price per KM</Form.Label>
                <Form.Control type="number" step="0.01" name="pricePerKm" value={carToEdit.pricePerKm} onChange={handleEditInputChange} required />
              </Form.Group>

              <Button variant="primary" type="submit">Save Changes</Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminDashboard;
