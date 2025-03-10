import React, { useState, useEffect } from "react";
import { Container, Card, Button, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function DriverDashboard() {
  const driverID = localStorage.getItem("userId");
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/rental/all")
      .then((res) => res.json())
      .then((data) => {
        setRides(
          data.filter(
            (ride) =>
              Number(ride.driverid) === Number(driverID) && ride.bookstatus === 1
          )
        );
      })
      .catch((err) => console.error("Error fetching rides:", err));
  }, [driverID]);

  const handleArrived = (rideID) => {
    fetch(`http://localhost:8080/rental/update/${rideID}/status2`, {
      method: "PUT",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to update")))
      .then((updatedRide) => {
        setRides((prev) =>
          prev.map((r) => (r.id === updatedRide.id ? updatedRide : r))
        );
        alert("Ride status updated to Arrived!");
      })
      .catch((err) => console.error("Error updating booking status:", err));
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200">
  <Container>
    <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-xl flex items-center">
      🚗 Rent-A-Car
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarContent" />
    <Navbar.Collapse id="navbarContent">
      <Nav className="ms-auto flex items-center gap-4">
              <Nav.Link as={Link} to="/driver" className="text-gray-700 hover:text-blue-600 transition font-medium">Reserve a Vehicle</Nav.Link>
              <Nav.Link className="text-gray-700 hover:text-blue-600 transition font-medium">Active Rentals</Nav.Link>
        <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
      <Container>
        <h4 className="text-center">Driver ID: {driverID || "Unavailable"}</h4>
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
