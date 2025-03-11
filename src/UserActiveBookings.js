import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Card, Button, } from "react-bootstrap";
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
              <Nav.Link as={Link} to="/customer" className="text-gray-700 hover:text-blue-600 transition font-medium">Reserve a Vehicle</Nav.Link>
              <Nav.Link as={Link} to="/ViewBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">My Reservations</Nav.Link>
              <Nav.Link as={Link} to="/OngoingRentals" className="text-gray-700 hover:text-blue-600 transition font-medium">Active Rentals</Nav.Link>
                <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      {/* Dashboard Content */}
      <Container>
        <h4 className="text-center mb-4">Driver ID: {driverId || "Not Available"}</h4>

        {assignedBookings.length > 0 ? (
          <div className="row">
            {assignedBookings.map((booking) => (
              <div key={booking.id} className="col-md-4 mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>Booking ID: {booking.id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">User ID: {booking.userid}</Card.Subtitle>
                    <Card.Text>
                      <strong>Car ID:</strong> {booking.carid} <br />
                      <strong>Pickup Location:</strong> {booking.location} <br />
                      <strong>Scheduled Time:</strong> {booking.time} <br />
                      <strong>Travel Distance:</strong> {booking.travelDistance > 0 ? `${booking.travelDistance} km` : "Not Complete"} <br />
                      <strong>Total Fee:</strong> ${booking.totalfee ? booking.totalfee.toFixed(2) : "N/A"} <br />
                      <strong>Payment Status:</strong> <span className="text-danger">Unpaid</span>
                    </Card.Text>
                    <p className="text-success fw-bold">Driver Accepted Your Booking</p>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-4">No confirmed bookings assigned to you.</p>
        )}
      </Container>
    </>
  );
}

export default DriverDashboard;