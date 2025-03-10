import React, { useEffect, useState } from "react";

import { Container, Card, Dropdown, Button, Modal, Form } from "react-bootstrap";

import "./App.css";

const CarReservation = () => {
  const [availableCars, setAvailableCars] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [driverList, setDriverList] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    location: "",
    time: "",
    travelDistance: "",
    pricePerKm: 0, // Store price per km
    totalfee: 0, // Store calculated total fee
  });
  
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [userIdentifier, setUserIdentifier] = useState("");

  useEffect(() => {
    setUserIdentifier(localStorage.getItem("userId") || "N/A");
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:8080/cars/all");
        const data = await response.json();
        setAvailableCars(data);
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:8080/users/staff");
        if (!response.ok) throw new Error("Could not retrieve driver information.");
        const result = await response.json();
        setDriverList(result);
      } catch (error) {
        console.error("Error fetching driver details:", error);
      }
    };
    fetchDrivers();
  }, []);

  const [pricePerKm, setPricePerKm] = useState(0);

const handleOpenModal = async (carId) => {
  setSelectedCarId(carId);
  
  // Fetch pricePerKm from API
  try {
    const response = await fetch(`http://localhost:8080/cars/${carId}`);
    if (!response.ok) throw new Error("Failed to fetch car details");
    const carData = await response.json();
    setPricePerKm(carData.pricePerKm);
  } catch (error) {
    console.error("Error fetching car price:", error);
  }

  setShowBookingModal(true);
};

  

const handleInputChange = (e) => {
  const { name, value } = e.target;

  setBookingInfo((prev) => {
    const updatedInfo = { ...prev, [name]: value };

    // Auto calculate total fee when travelDistance is updated
    if (name === "travelDistance") {
      updatedInfo.totalfee = pricePerKm * parseFloat(value || 0);
    }

    return updatedInfo;
  });
};

  
  

  const selectDriver = (driverId, driverName) => {
    setAssignedDriver({ id: driverId, name: driverName });
  };

  

  const processBooking = async (e) => {
    e.preventDefault();
  
    if (!bookingInfo.location.trim() || !bookingInfo.time.trim() || !assignedDriver) {
      alert("Please fill all required fields.");
      return;
    }
  
    const bookingData = {
      userid: userIdentifier,
      carid: selectedCarId,
      location: bookingInfo.location,
      time: bookingInfo.time,
      driverid: assignedDriver.id,
      travelDistance: bookingInfo.travelDistance,
      totalfee: bookingInfo.totalfee,  // Send total fee
      bookstatus: 0,
      paymentstatus: 0,
    };
  
    try {
      const response = await fetch("http://localhost:8080/rental/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
  
      if (!response.ok) throw new Error("Failed to confirm the booking.");
  
      alert("Your booking has been successfully placed!");
      setShowBookingModal(false);
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  

  return (
    <>
    

      {/* Car Listings */}
      <Container>
        <h2 className="text-center my-4">Available Vehicles</h2>
        <h5 className="text-center text-info">User ID: {userIdentifier}</h5>
        <div className="row">
          {availableCars.map((car) => (
            <div key={car.id} className="col-md-4 mb-4">
              <Card className="shadow-lg rounded border-0">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={car.photo.startsWith("data:image") ? car.photo : `data:image/jpeg;base64,${car.photo}`}
                    alt={car.model}
                    className="img-fluid car-image"
                  />
                  <div className="overlay d-flex align-items-center justify-content-center">
                    <Button variant="primary" onClick={() => handleOpenModal(car.id)}>Book Now</Button>
                  </div>
                </div>
                <Card.Body className="text-center">
                  <Card.Title className="fw-bold">{car.model}</Card.Title>
                  <Card.Text className="text-muted">
                    <strong>Plate:</strong> {car.licensePlate} <br />
                    <strong>Seats:</strong> {car.seats} <br />
                    <strong>Engine:</strong> {car.capacity} CC <br />
                    <strong>Rate:</strong> ${car.pricePerKm} per km
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered>
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>🛣 Confirm Your Ride</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={processBooking}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Pickup Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter pickup point"
                  value={bookingInfo.location}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Pickup Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="time"
                  value={bookingInfo.time}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
  <Form.Label className="fw-bold">Distance (km)</Form.Label>
  <Form.Control
    type="number"
    name="travelDistance"
    placeholder="Enter travel distance"
    value={bookingInfo.travelDistance}
    onChange={handleInputChange}
    required
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label className="fw-bold">Total Fee ($)</Form.Label>
  <Form.Control type="text" value={bookingInfo.totalfee || 0} readOnly />
</Form.Group>




              {/* Assign Driver */}
              <Dropdown className="mb-3">
                <Dropdown.Toggle variant="dark">
                  {assignedDriver ? `Driver: ${assignedDriver.name} (ID: ${assignedDriver.id})` : "Select a Driver"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {driverList.length > 0 ? (
                    driverList.map((driver) => (
                      <Dropdown.Item key={driver.id} onClick={() => selectDriver(driver.id, driver.username)}>
                        {driver.username} (ID: {driver.id})
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>No Drivers Available</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <div className="text-center">
                <Button variant="success" type="submit">✅ Confirm</Button>
                <Button variant="secondary" onClick={() => setShowBookingModal(false)}>❌ Cancel</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default CarReservation;
