import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Button, Form, FormControl, Card, Row, Col, Modal } from "react-bootstrap";

function MyBookings() {
  const userId = localStorage.getItem("userId");
  const [bookingsList, setBookingsList] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [carDetails, setCarDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    time: "",
    travelDistance: "",
    totalFee: 0,
  });

  // Fetch bookings and car details
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/rental/all");
        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        const userBookings = data.filter((booking) => booking.userid === userId);
        setBookingsList(userBookings);
        setFilteredBookings(userBookings);

        const uniqueCarIds = [...new Set(userBookings.map((b) => b.carid))];
        const carData = {};
        await Promise.all(
          uniqueCarIds.map(async (carId) => {
            try {
              const carResponse = await fetch(`http://localhost:8080/cars/${carId}`);
              if (!carResponse.ok) throw new Error("Failed to fetch car data");
              const carInfo = await carResponse.json();
              carData[carId] = carInfo;
            } catch (error) {
              console.error(`Error fetching car details for carId ${carId}:`, error);
            }
          })
        );
        setCarDetails(carData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchUserBookings();
  }, [userId]);

  // Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = bookingsList.filter((booking) => {
      const car = carDetails[booking.carid];
      return car && car.model.toLowerCase().includes(query);
    });
    setFilteredBookings(filtered);
  };

  // Delete booking
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8080/rental/delete/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookingsList(bookingsList.filter((booking) => booking.id !== bookingId));
      setFilteredBookings(filteredBookings.filter((booking) => booking.id !== bookingId));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  // Open edit modal
  const handleOpenEditModal = (booking) => {
    const car = carDetails[booking.carid];
    setSelectedBooking(booking);
    setEditForm({
      location: booking.location,
      time: booking.time.slice(0, 16), // For datetime-local input compatibility
      travelDistance: booking.travelDistance,
      totalFee: car ? car.pricePerKm * parseFloat(booking.travelDistance || 0) : booking.totalfee,
    });
    setShowEditModal(true);
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "travelDistance" && selectedBooking) {
        const car = carDetails[selectedBooking.carid];
        updatedForm.totalFee = car ? car.pricePerKm * parseFloat(value || 0) : prev.totalFee;
      }
      return updatedForm;
    });
  };

  // Save edited booking
  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editForm.location || !editForm.time || !editForm.travelDistance) {
      alert("Please complete all required fields.");
      return;
    }

    const updatedBooking = {
      ...selectedBooking,
      location: editForm.location,
      time: editForm.time,
      travelDistance: editForm.travelDistance,
      totalfee: editForm.totalFee,
    };

    try {
      const response = await fetch(`http://localhost:8080/rental/update/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      setBookingsList(bookingsList.map((b) => (b.id === selectedBooking.id ? updatedBooking : b)));
      setFilteredBookings(filteredBookings.map((b) => (b.id === selectedBooking.id ? updatedBooking : b)));
      setShowEditModal(false);
      alert("Booking updated successfully!");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking.");
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200 rounded-b-xl">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-2xl flex items-center">
          🚘 Cab Booking System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto flex items-center gap-5">
              <Nav.Link as={Link} to="/customer" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Reserve a Vehicle
              </Nav.Link>
              <Nav.Link as={Link} to="/ViewBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">
                My Reservations
              </Nav.Link>
              <Nav.Link as={Link} to="/UserActiveBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Active Rentals
              </Nav.Link>
              <Nav.Link as={Link} to="/About" className="text-gray-700 hover:text-blue-600 transition font-medium">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/Help" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Help
              </Nav.Link>
              <Button
                as={Link}
                to="/"
                variant="outline-danger"
                className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark">My Bookings</h1>
          <p className="text-muted">User ID: {userId || "N/A"}</p>
          {/* Search Bar */}
          <Form className="mt-4 d-flex justify-content-center">
            <FormControl
              type="text"
              placeholder="Search by car model..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="shadow-sm"
              style={{
                maxWidth: "500px",
                borderRadius: "25px",
                padding: "12px 20px",
                border: "1px solid #007bff",
              }}
            />
          </Form>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <Row xs={1} md={3} className="g-4">
            {filteredBookings.map((booking) => {
              const car = carDetails[booking.carid];
              return (
                <Col key={booking.id}>
                  <Card className="shadow-sm border-0 h-100" style={{ borderRadius: "15px" }}>
                    {car && car.photo ? (
                      <Card.Img
                        variant="top"
                        src={car.photo.startsWith("data:image") ? car.photo : `data:image/jpeg;base64,${car.photo}`}
                        alt={car.model}
                        style={{ height: "180px", objectFit: "cover", borderRadius: "15px 15px 0 0" }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "180px", borderRadius: "15px 15px 0 0" }}
                      >
                        <span className="text-muted">No Image</span>
                      </div>
                    )}
                    <Card.Body className="p-4">
                      <Card.Title className="fw-bold text-dark">
                        {car ? car.model : "Unknown Car"}
                      </Card.Title>
                      <Card.Text className="text-muted">
                        <div className="d-flex flex-column gap-2">
                          <span>
                            <strong>Location:</strong> {booking.location}
                          </span>
                          <span>
                            <strong>Time:</strong> {new Date(booking.time).toLocaleString()}
                          </span>
                          <span>
                            <strong>Status:</strong>{" "}
                            <span
                              className={
                                booking.bookstatus === 0 ? "text-warning" : "text-success"
                              }
                            >
                              {booking.bookstatus === 0 ? "Pending" : "Confirmed"}
                            </span>
                          </span>
                          <span>
                            <strong>Total Fee:</strong> ${booking.totalfee.toFixed(2)}
                          </span>
                          <span>
                            <strong>Payment:</strong>{" "}
                            <span
                              className={
                                booking.paymentstatus === 0 ? "text-danger" : "text-success"
                              }
                            >
                              {booking.paymentstatus === 0 ? "Unpaid" : "Paid"}
                            </span>
                          </span>
                        </div>
                      </Card.Text>
                      <div className="d-flex gap-2 mt-3">
                        <Button
                          variant="primary"
                          className="w-50 rounded-pill"
                          onClick={() => handleOpenEditModal(booking)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="primary" // Changed from "danger" to "primary"
                          className="w-50 rounded-pill"
                          onClick={() => handleDeleteBooking(booking.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className="text-center text-muted mt-5">
            No bookings match your search or you have no bookings yet.
          </p>
        )}

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              Edit Booking - {selectedBooking && carDetails[selectedBooking.carid]?.model}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleSaveEdit}>
              <Form.Group className="mb-3">
                <Form.Label>Pickup Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleEditInputChange}
                  placeholder="e.g., Downtown"
                  required
                  className="rounded-pill"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pickup Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="time"
                  value={editForm.time}
                  onChange={handleEditInputChange}
                  required
                  className="rounded-pill"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Travel Distance (km)</Form.Label>
                <Form.Control
                  type="number"
                  name="travelDistance"
                  value={editForm.travelDistance}
                  onChange={handleEditInputChange}
                  placeholder="e.g., 10"
                  required
                  className="rounded-pill"
                />
              </Form.Group>

              <div className="text-center mb-3">
                <h5>Total: ${editForm.totalFee.toFixed(2)}</h5>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <Button variant="success" type="submit" className="rounded-pill px-4">
                  Save Changes
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-pill px-4"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

export default MyBookings;