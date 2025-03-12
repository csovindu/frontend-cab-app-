import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUser, FaCar, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

function DriverHome() {
  const driverId = localStorage.getItem("userId");
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState({});

  // Fetch bookings
  useEffect(() => {
    fetch("http://localhost:8080/rental/all")
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (bookings.length === 0) return;
      const carIds = [...new Set(bookings.map((b) => b.carid))];
      const newCarIds = carIds.filter((id) => !cars[id]);
      if (newCarIds.length === 0) return;

      const carData = {};
      await Promise.all(
        newCarIds.map(async (carid) => {
          try {
            const response = await fetch(`http://localhost:8080/cars/${carid}`);
            if (!response.ok) throw new Error("Failed to fetch car data");
            const data = await response.json();
            carData[carid] = data;
          } catch (error) {
            console.error(`Error fetching car details for carid ${carid}:`, error);
          }
        })
      );
      setCars((prevCars) => ({ ...prevCars, ...carData }));
    };
    fetchCarDetails();
  }, [bookings]);

  // Handle Cancel
  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/rental/update/${bookingId}/status2`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update booking status");
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, bookstatus: 2 } : booking
        )
      );
      alert(`Booking ${bookingId} has been cancelled.`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to cancel booking. Try again.");
    }
  };

  // Handle Confirm
  const handleConfirm = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/rental/update/${bookingId}/status1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to update booking status: ${response.statusText}`);
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, bookstatus: 1 } : booking
        )
      );
      alert(`Booking ${bookingId} is now In Progress.`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to confirm booking. Try again.");
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => String(booking.driverid) === driverId && booking.bookstatus !== 2
  );

  return (
    <>
      {/* Navigation Bar */}
      <Navbar
        bg="white"
        expand="lg"
        className="mb-5 shadow-lg"
        style={{ borderBottom: "2px solid #e9ecef", borderRadius: "0 0 20px 20px" }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 fw-bold text-xl d-flex align-items-center">
            <span className="me-2">🚘</span> Rent-A-Car
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto d-flex align-items-center gap-4">
              <Nav.Link as={Link} to="/DriverHome" className="text-gray-700 hover-text-blue transition fw-medium active">
                Driver Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/DriverInProgressBookings" className="text-gray-700 hover-text-blue transition fw-medium">
                Active Rentals
              </Nav.Link>
              <Nav.Link as={Link} to="/DriverHelp" className="text-gray-700 hover-text-blue transition fw-medium">
                Help
              </Nav.Link>
              <Button
                as={Link}
                to="/"
                variant="outline-danger"
                className="rounded-pill px-4 py-1 fw-semibold text-red-500 border-red-500 hover-bg-red-500 hover-text-white transition"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <h4
          className="text-center mb-5 fw-bold"
          style={{ color: "#007bff", fontSize: "1.75rem", letterSpacing: "1px" }}
        >
          Your Driver ID: {driverId || "Not Available"}
        </h4>

        {filteredBookings.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredBookings.map((booking) => (
              <Col key={booking.id}>
                <Card
                  className="shadow-lg border-0 h-100"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <Card.Header
                    className="bg-dark text-white text-center p-3"
                    style={{ borderRadius: "20px 20px 0 0", fontSize: "1.25rem", fontWeight: "bold" }}
                  >
                    Booking #{booking.id}
                  </Card.Header>
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={
                        cars[booking.carid]?.photo?.startsWith("data:image")
                          ? cars[booking.carid].photo
                          : `data:image/jpeg;base64,${cars[booking.carid]?.photo}`
                      }
                      alt={`Car ${cars[booking.carid]?.model}`}
                      style={{ height: "200px", objectFit: "cover", borderRadius: "0" }}
                    />
                  </div>
                  <Card.Body className="p-4" style={{ background: "#f8f9fa", borderRadius: "0 0 20px 20px" }}>
                    <Card.Title className="fw-bold text-dark mb-3" style={{ fontSize: "1.5rem" }}>
                      {cars[booking.carid]?.model || "Loading..."}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      <div className="d-flex flex-column gap-2">
                        <span><FaUser className="me-2 text-dark" /> User: {booking.userid}</span>
                        <span><FaMapMarkerAlt className="me-2 text-dark" /> Location: {booking.location}</span>
                        <span><FaClock className="me-2 text-dark" /> Time: {booking.time}</span>
                        <span><FaMoneyBillWave className="me-2 text-dark" /> Fee: <span className="text-success fw-bold">${booking.totalfee ? booking.totalfee.toFixed(2) : "N/A"}</span></span>
                        <span><FaCheckCircle className="me-2 text-dark" /> Payment: <span style={{ color: booking.paymentstatus === 0 ? "#dc3545" : "#28a745", fontWeight: "500" }}>{booking.paymentstatus === 0 ? "Pending" : "Paid"}</span></span>
                        <span>Status: <span style={{ color: booking.bookstatus === 1 ? "#28a745" : "#ffcc00", fontWeight: "500" }}>{booking.bookstatus === 1 ? "In Progress" : "Pending"}</span></span>
                      </div>
                    </Card.Text>
                    <div className="text-center d-flex gap-3 justify-content-center">
                      <Button
                        variant="success"
                        className="px-3 py-2 fw-semibold rounded-pill shadow-sm"
                        style={{
                          background: "linear-gradient(45deg, #28a745, #38d39f)",
                          border: "none",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onClick={() => handleConfirm(booking.id)}
                      >
                        ✅ Confirm
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-3 py-2 fw-semibold rounded-pill shadow-sm"
                        style={{
                          background: "linear-gradient(45deg, #6c757d, #adb5bd)",
                          border: "none",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onClick={() => handleCancel(booking.id)}
                      >
                        ❌ Cancel
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p
            className="text-center mt-4 text-muted"
            style={{ fontSize: "1.25rem", fontWeight: "500" }}
          >
            No bookings found
          </p>
        )}
      </Container>
    </>
  );
}

export default DriverHome;