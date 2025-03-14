import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function DriverHome() {
  const driverId = localStorage.getItem("userId");
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState({});

  // Fetch bookings
  useEffect(() => {
    fetch("http://localhost:8080/rental/all")
      .then((response) => response.json())
      .then((data) => setBookings(data.filter((booking) => booking.bookstatus === 1)))
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

  // Handle Complete
  const handleComplete = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/rental/update/${bookingId}/status2`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update booking status");

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );

      alert(`Booking ${bookingId} has been completed.`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to complete booking. Try again.");
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => String(booking.driverid) === driverId && booking.bookstatus === 1
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
            <span className="me-2">🚘 Cab Booking System            </span> 
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto d-flex align-items-center gap-4">
              <Nav.Link as={Link} to="/DriverHome" className="text-gray-700 hover-text-blue transition fw-medium">
                Driver Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/DriverInProgressBookings" className="text-gray-700 hover-text-blue transition fw-medium active">
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


        {filteredBookings.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredBookings.map((booking) => (
              <Col key={booking.id}>
                <Card
                  className="shadow-lg border-0 h-100"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    background: "#f8f9fa",
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
                    style={{ borderRadius: "15px 15px 0 0", fontSize: "1.25rem", fontWeight: "bold" }}
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
                      style={{ height: "180px", objectFit: "cover", borderRadius: "0" }}
                    />
                  </div>
                  <Card.Body className="p-4">
                    <Card.Title className="fw-bold text-dark mb-3" style={{ fontSize: "1.5rem" }}>
                      {cars[booking.carid]?.model || "Loading..."}
                    </Card.Title>
                    <Card.Text className="text-muted">
                      <div className="d-flex flex-column gap-2">
                        <span><strong className="text-secondary">User ID:</strong> {booking.userid}</span>
                        <span><strong className="text-secondary">Location:</strong> {booking.location}</span>
                        <span><strong className="text-secondary">Time:</strong> {booking.time}</span>
                        <span><strong className="text-secondary">Status:</strong> <span className="fw-bold text-primary">In Progress</span></span>
                        <span><strong className="text-secondary">Total Fee:</strong> <span className="fw-bold text-success">${booking.totalfee ? booking.totalfee.toFixed(2) : "N/A"}</span></span>
                        <span><strong className="text-secondary">Payment Status:</strong> <span className={`fw-bold ${booking.paymentstatus === 0 ? "text-danger" : "text-success"}`}>
                          {booking.paymentstatus === 0 ? "Payment Pending" : "Paid"}
                        </span></span>
                      </div>
                    </Card.Text>
                    <div className="text-center">
                      <Button
                        variant="success"
                        className="px-4 py-2 fw-semibold rounded-pill shadow-sm"
                        style={{
                          background: "linear-gradient(45deg, #28a745, #38d39f)",
                          border: "none",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        onClick={() => handleComplete(booking.id)}
                      >
                        Complete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center mt-4 text-muted" style={{ fontSize: "1.25rem", fontWeight: "500" }}>
            No bookings found
          </p>
        )}
      </Container>
    </>
  );
}

export default DriverHome;