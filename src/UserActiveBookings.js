import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function DriverDashboard() {
  const driverId = localStorage.getItem("userId");
  const [assignedBookings, setAssignedBookings] = useState([]);

  useEffect(() => {
    const fetchAssignedBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/rental/all");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        
        const data = await response.json();
        const filteredData = data.filter(
          (booking) => String(booking.userid) === driverId && booking.bookstatus === 1 && booking.paymentstatus === 0
        );
        setAssignedBookings(filteredData);
      } catch (error) {
        console.error("Error fetching assigned bookings:", error);
      }
    };

    fetchAssignedBookings();
  }, [driverId]);

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200 rounded-b-xl">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-2xl flex items-center">
            🚗 Rent-A-Car
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
              <Nav.Link as={Link} to="/OngoingRentals" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Active Rentals
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
        {/* Header */}
        <div className="text-center mb-5">
          <h4 className="display-6 fw-bold text-primary">
            Driver Dashboard
          </h4>
          <Badge bg="secondary" className="mt-2 px-3 py-2">
            Driver ID: {driverId || "Not Available"}
          </Badge>
        </div>

        {/* Bookings Grid */}
        {assignedBookings.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {assignedBookings.map((booking) => (
              <Col key={booking.id}>
                <Card 
                  className="h-100 shadow-lg border-0"
                  style={{ 
                    borderRadius: "15px",
                    overflow: "hidden",
                    transition: "transform 0.3s",
                  }}
                >
                  <Card.Header 
                    className="bg-primary text-white py-3"
                    style={{ borderBottom: "3px solid #fff" }}
                  >
                    <Card.Title className="mb-0 fw-bold">
                      Booking #{booking.id}
                    </Card.Title>
                    <Card.Subtitle className="mt-1 opacity-75">
                      User ID: {booking.userid}
                    </Card.Subtitle>
                  </Card.Header>

                  <Card.Body className="p-4">
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Car ID:</strong>
                        <span>{booking.carid}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Pickup:</strong>
                        <span>{booking.location}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Time:</strong>
                        <span>{booking.time}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Distance:</strong>
                        <Badge bg={booking.travelDistance > 0 ? "info" : "warning"}>
                          {booking.travelDistance > 0 
                            ? `${booking.travelDistance} km` 
                            : "Not Complete"}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Total Fee:</strong>
                        <span className="fw-bold text-success">
                          ${booking.totalfee ? booking.totalfee.toFixed(2) : "N/A"}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Payment:</strong>
                        <Badge bg="danger" className="px-2 py-1">
                          Unpaid
                        </Badge>
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-success text-white text-center py-3">
                    <p className="mb-0 fw-bold">✓ Driver Accepted</p>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center mt-5">
            <Card className="shadow-sm border-0 mx-auto" style={{ maxWidth: "500px" }}>
              <Card.Body className="py-5">
                <h5 className="text-muted mb-3">No Confirmed Bookings</h5>
                <p className="text-secondary">
                  Currently, there are no bookings assigned to you. Check back later!
                </p>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </>
  );
}

export default DriverDashboard;