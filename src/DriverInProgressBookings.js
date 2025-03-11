import React, { useState, useEffect } from "react";
import { Container, Card, Button, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function DriverDashboard() {
  const driverID = localStorage.getItem("userId");
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch("http://localhost:8080/rental/all");
        if (!response.ok) throw new Error("Failed to fetch rides");
        const data = await response.json();
        const filteredRides = data.filter(
          (ride) =>
            Number(ride.driverid) === Number(driverID) && ride.bookstatus === 1
        );
        setRides(filteredRides);
      } catch (err) {
        console.error("Error fetching rides:", err);
      }
    };

    fetchRides();
  }, [driverID]);

  const handleArrived = async (rideID) => {
    try {
      const response = await fetch(`http://localhost:8080/rental/update/${rideID}/status2`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to update ride status");
      const updatedRide = await response.json();
      setRides((prev) =>
        prev.map((r) => (r.id === updatedRide.id ? updatedRide : r))
      );
      alert("Ride status updated to Arrived!");
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update ride status. Please try again.");
    }
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-xl flex items-center">
          🚘cab booking system
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto flex items-center gap-4">
              <Nav.Link as={Link} to="/driver" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Reserve a Vehicle
              </Nav.Link>
              <Nav.Link as={Link} to="/driver/active-rentals" className="text-gray-700 hover:text-blue-600 transition font-medium">
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
      <Container>
        <h4 className="text-center mb-4">Driver ID: {driverID || "Unavailable"}</h4>
        {rides.length > 0 ? (
          rides.map((ride) => (
            <Card key={ride.id} className="mb-3 shadow">
              <Card.Body>
                <Card.Title>Ride ID: {ride.id}</Card.Title>
                <Card.Text>
                  <strong>User ID:</strong> {ride.userid} <br />
                  <strong>Car ID:</strong> {ride.carid} <br />
                  <strong>Pickup Location:</strong> {ride.location} <br />
                  <strong>Time:</strong> {ride.time} <br />
                  <strong>Status:</strong> Confirmed
                </Card.Text>
                <Button variant="success" onClick={() => handleArrived(ride.id)}>
                  Arrived
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-center mt-4">No available rides</p>
        )}
      </Container>
    </>
  );
}

export default DriverDashboard;