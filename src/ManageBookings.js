import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Navbar, Nav, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function BookingManagement() {
  const [reservations, setReservations] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [editReservationId, setEditReservationId] = useState(null);
  const [editFormData, setEditFormData] = useState({ location: "", time: "", totalfee: "" });
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch all reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:8080/rental/all");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, []);

  // Fetch vehicle details for relevant car IDs
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (reservations.length === 0) return;
      const carIdList = [...new Set(reservations.map((r) => r.carid))];
      const newCarIds = carIdList.filter((id) => !vehicleDetails[id]);
      if (newCarIds.length === 0) return;

      setLoadingVehicles(true);
      const carData = {};
      await Promise.all(
        newCarIds.map(async (carid) => {
          try {
            const response = await fetch(`http://localhost:8080/cars/${carid}`);
            if (!response.ok) throw new Error("Failed to fetch car data");
            const data = await response.json();
            carData[carid] = data;
          } catch (error) {
            console.error(`Error fetching vehicle details for car ID ${carid}:`, error);
          }
        })
      );
      setVehicleDetails((prevData) => ({ ...prevData, ...carData }));
      setLoadingVehicles(false);
    };
    fetchVehicleDetails();
  }, [reservations]);

  // Cancel a reservation
  const cancelReservation = async (reservationId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const response = await fetch(`http://localhost:8080/rental/delete/${reservationId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to cancel booking");
      alert("Booking canceled successfully!");
      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
    } catch (error) {
      console.error("Error canceling reservation:", error);
      alert("Failed to cancel booking.");
    }
  };

  // Start editing a reservation
  const handleEditClick = (reservation) => {
    setEditReservationId(reservation.id);
    setEditFormData({
      location: reservation.location,
      time: reservation.time,
      totalfee: reservation.totalfee || "",
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save edited reservation
  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/rental/update/${editReservationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reservations.find(r => r.id === editReservationId),
          ...editFormData,
          totalfee: parseFloat(editFormData.totalfee) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to update reservation");

      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === editReservationId
            ? { ...reservation, ...editFormData, totalfee: parseFloat(editFormData.totalfee) || 0 }
            : reservation
        )
      );
      setEditReservationId(null);
      setShowEditModal(false);
      alert("Reservation updated successfully!");
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Failed to update reservation.");
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
              <Nav.Link as={Link} to="/AdminHome" className="text-gray-700 hover:text-blue-600 transition font-medium">Add Car</Nav.Link>
              <Nav.Link as={Link} to="/ManageCar" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Cars</Nav.Link>
              <Nav.Link as={Link} to="/AddDriver" className="text-gray-700 hover:text-blue-600 transition font-medium">Add Driver</Nav.Link>
              <Nav.Link as={Link} to="/DeleteDrivers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Drivers</Nav.Link>
              <Nav.Link as={Link} to="/DeleteUsers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Users</Nav.Link>
              <Nav.Link as={Link} to="/ManageBookings" className="text-gray-700 hover:text-blue-600 transition font-medium active">Manage Bookings</Nav.Link>
              <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2 className="text-center mb-4">Admin - All Reservations</h2>
        {reservations.length > 0 ? (
          <Row>
            {reservations.map((reservation) => {
              const vehicle = vehicleDetails[reservation.carid];
              return (
                <Col key={reservation.id} md={4} sm={6} xs={12} className="mb-4">
                  <Card className="shadow-sm">
                    {vehicle?.photo ? (
                      <Card.Img 
                        variant="top" 
                        src={vehicle.photo.startsWith("data:image") ? vehicle.photo : `data:image/jpeg;base64,${vehicle.photo}`}
                        alt={vehicle.model} 
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="text-center py-5 bg-light">No Image Available</div>
                    )}
                    <Card.Body>
                      <Card.Title>{vehicle ? vehicle.model : "Vehicle Details Loading..."}</Card.Title>
                      <Card.Text>
                        <strong>Reservation ID:</strong> {reservation.id} <br />
                        <strong>User ID:</strong> {reservation.userid} <br />
                        <strong>Pickup Location:</strong> {reservation.location} <br />
                        <strong>Pickup Time:</strong> {reservation.time} <br />
                        <strong>Total Cost:</strong> ${reservation.totalfee?.toFixed(2) || "N/A"} <br />
                        <strong>Payment Status:</strong> 
                        <span className={reservation.paymentstatus === 0 ? "text-danger" : "text-success"}>
                          {reservation.paymentstatus === 0 ? "Unpaid" : "Paid"}
                        </span>
                      </Card.Text>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleEditClick(reservation)}
                          style={{ backgroundColor: "#cce5ff", borderColor: "#b8daff", color: "#004085" }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => cancelReservation(reservation.id)}
                          style={{ backgroundColor: "#f8d7da", borderColor: "#f5c6cb", color: "#721c24" }}
                        >
                          Cancel Reservation
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className="text-center">No reservations found</p>
        )}
      </Container>

      {/* Edit Reservation Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Reservation #{editReservationId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={editFormData.location}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pickup Time</Form.Label>
              <Form.Control
                type="text"
                name="time"
                value={editFormData.time}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Cost</Form.Label>
              <Form.Control
                type="number"
                name="totalfee"
                value={editFormData.totalfee}
                onChange={handleInputChange}
                step="0.01"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BookingManagement;