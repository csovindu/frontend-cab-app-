import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";


function DriverDashboard() {
  const driverId = localStorage.getItem("userId");
  const [rides, setRides] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/rental/all")
      .then((response) => response.json())
      .then((data) => setRides(data))
      .catch((error) => console.error("Error fetching rides:", error));
  }, []);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (rides.length === 0) return;
      const vehicleIds = [...new Set(rides.map((r) => r.carid))];
      const newVehicleIds = vehicleIds.filter((id) => !vehicles[id]);
      if (newVehicleIds.length === 0) return;
      setLoadingVehicles(true);
      const vehicleData = {};

      await Promise.all(
        newVehicleIds.map(async (carid) => {
          try {
            const response = await fetch(`http://localhost:8080/cars/${carid}`);
            if (!response.ok) throw new Error("Failed to fetch vehicle data");
            const data = await response.json();
            vehicleData[carid] = data;
          } catch (error) {
            console.error(`Error fetching vehicle details for carid ${carid}:`, error);
          }
        })
      );

      setVehicles((prevVehicles) => ({ ...prevVehicles, ...vehicleData }));
      setLoadingVehicles(false);
    };

    fetchVehicleDetails();
  }, [rides]);

  const handleCancelRide = async (rideId) => {
    try {
      const response = await fetch(`http://localhost:8080/rental/update/${rideId}/status2`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update ride status");
      setRides((prevRides) =>
        prevRides.map((ride) => (ride.id === rideId ? { ...ride, bookstatus: 2 } : ride))
      );
      alert(`Ride ${rideId} has been cancelled.`);
    } catch (error) {
      console.error("Error updating ride status:", error);
      alert("Failed to cancel ride. Try again.");
    }
  };

  const handleConfirmRide = async (rideId) => {
    try {
      const response = await fetch(`http://localhost:8080/rental/update/${rideId}/status1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update ride status");
      setRides((prevRides) =>
        prevRides.map((ride) => (ride.id === rideId ? { ...ride, bookstatus: 1 } : ride))
      );
      alert(`Ride ${rideId} is now In Progress.`);
    } catch (error) {
      console.error("Error updating ride status:", error);
      alert("Failed to confirm ride. Try again.");
    }
  };

  const filteredRides = rides.filter(
    (ride) => String(ride.driverid) === driverId && ride.bookstatus !== 2
  );

  return (
    <>
    <Container>
      <h4 className="text-center mb-4">Your Driver ID: {driverId || "Not Available"}</h4>
      <Row>
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => {
            const vehicle = vehicles[ride.carid];
            return (
              <Col key={ride.id} md={4} className="mb-4">
                <Card className="shadow-sm border-0">
                  {vehicle && vehicle.photo ? (
                    <Card.Img
                      variant="top"
                      src={
                        vehicle.photo.startsWith("data:image")
                          ? vehicle.photo
                          : `data:image/jpeg;base64,${vehicle.photo}`
                      }
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <Spinner animation="border" className="mx-auto my-4" />
                  )}
                  <Card.Body>
                    <Card.Title>Ride ID: {ride.id}</Card.Title>
                    <Card.Text>
                      <strong>Car:</strong> {vehicle ? vehicle.model : "Loading..."} <br />
                      <strong>Location:</strong> {ride.location} <br />
                      <strong>Time:</strong> {ride.time} <br />
                      <strong>Status:</strong> {" "}
                      <span
                        className={
                          ride.bookstatus === 0
                            ? "text-warning"
                            : ride.bookstatus === 1
                            ? "text-primary"
                            : "text-danger"
                        }
                      >
                        {ride.bookstatus === 0
                          ? "Pending"
                          : ride.bookstatus === 1
                          ? "In Progress"
                          : "Cancelled"}
                      </span>
                      <br />
                      <strong>Total Fee:</strong> ${ride.totalfee ? ride.totalfee.toFixed(2) : "N/A"} <br />
                      <strong>Payment Status:</strong>{" "}
                      <span className={ride.paymentstatus === 0 ? "text-danger" : "text-success"}>
                        {ride.paymentstatus === 0 ? "Unpaid" : "Paid"}
                      </span>
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="success" onClick={() => handleConfirmRide(ride.id)}>
                        Confirm
                      </Button>
                      <Button variant="danger" onClick={() => handleCancelRide(ride.id)}>
                        Cancel
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <p className="text-center">No rides found</p>
        )}
      </Row>
    </Container>
    </>
  );
}

export default DriverDashboard;