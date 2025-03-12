import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Dropdown, Button, Navbar, Nav, Modal, Form, Row, Col, FormControl } from "react-bootstrap";
import "./App.css";

const CarReservation = () => {
  const [availableCars, setAvailableCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]); // New state for filtered cars
  const [searchQuery, setSearchQuery] = useState("");   // New state for search input
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [driverList, setDriverList] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    location: "",
    time: "",
    travelDistance: "",
    pricePerKm: 0,
    totalfee: 0,
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
        setFilteredCars(data); // Initially show all cars
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = availableCars.filter(car => 
      car.model.toLowerCase().includes(query)
    );
    setFilteredCars(filtered);
  };

  const handleOpenModal = async (carId) => {
    setSelectedCarId(carId);
    
    try {
      const response = await fetch(`http://localhost:8080/cars/${carId}`);
      if (!response.ok) throw new Error("Failed to fetch car details");
      const carData = await response.json();
      setBookingInfo(prev => ({ ...prev, pricePerKm: carData.pricePerKm }));
    } catch (error) {
      console.error("Error fetching car price:", error);
    }

    setShowBookingModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBookingInfo((prev) => {
      const updatedInfo = { ...prev, [name]: value };

      if (name === "travelDistance") {
        updatedInfo.totalfee = updatedInfo.pricePerKm * parseFloat(value || 0);
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
      totalfee: bookingInfo.totalfee,
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
      setBookingInfo({
        location: "",
        time: "",
        travelDistance: "",
        pricePerKm: 0,
        totalfee: 0,
      });
      setAssignedDriver(null);
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred. Please try again.");
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
              <Nav.Link onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition font-medium">
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
        {/* Car Listings Header */}
        <div className="text-center mb-5">

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
                border: "1px solid #007bff"
              }}
            />
          </Form>
        </div>

        {/* Car Listings */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCars.map((car) => (
            <Col key={car.id}>
              <Card className="shadow-lg border-0 h-100" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={car.photo?.startsWith("data:image") ? car.photo : `data:image/jpeg;base64,${car.photo}`}
                    alt={car.model}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      background: "rgba(0, 0, 0, 0.3)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    <Button
                      variant="primary"
                      className="px-4 py-2 fw-semibold rounded-pill"
                      onClick={() => handleOpenModal(car.id)}
                      style={{ background: "linear-gradient(45deg, #007bff, #00b4db)", border: "none" }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
                <Card.Body className="text-center p-4">
                  <Card.Title className="fw-bold text-dark" style={{ fontSize: "1.5rem" }}>
                    {car.model}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    <div className="d-flex flex-column gap-2">
                      <span><strong>Plate:</strong> {car.licensePlate}</span>
                      <span><strong>Seats:</strong> {car.seats}</span>
                      <span><strong>Engine:</strong> {car.capacity} CC</span>
                      <span><strong>Rate:</strong> <span className="text-success fw-bold">${car.pricePerKm}</span> per km</span>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {filteredCars.length === 0 && (
            <Col className="text-center">
              <p className="text-muted mt-4">No cars match your search.</p>
            </Col>
          )}
        </Row>

        {/* Booking Modal */}
        <Modal
          show={showBookingModal}
          onHide={() => setShowBookingModal(false)}
          centered
        >
          <Modal.Header className="bg-dark text-white border-0" style={{ borderRadius: "20px 20px 0 0" }}>
            <Modal.Title className="fw-bold">
              <span className="me-2">🛣</span> Confirm Your Ride
            </Modal.Title>
            <Button
              variant="link"
              className="text-white"
              onClick={() => setShowBookingModal(false)}
              style={{ textDecoration: "none" }}
            >
              ×
            </Button>
          </Modal.Header>
          <Modal.Body className="p-4" style={{ background: "#f8f9fa", borderRadius: "0 0 20px 20px" }}>
            <Form onSubmit={processBooking}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-dark">Pickup Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Enter pickup point"
                  value={bookingInfo.location}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm"
                  style={{ borderRadius: "10px", padding: "12px" }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-dark">Pickup Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="time"
                  value={bookingInfo.time}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm"
                  style={{ borderRadius: "10px", padding: "12px" }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-dark">Distance (km)</Form.Label>
                <Form.Control
                  type="number"
                  name="travelDistance"
                  placeholder="Enter travel distance"
                  value={bookingInfo.travelDistance}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm"
                  style={{ borderRadius: "10px", padding: "12px" }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-dark">Total Fee ($)</Form.Label>
                <Form.Control
                  type="text"
                  value={bookingInfo.totalfee || 0}
                  readOnly
                  className="shadow-sm bg-light"
                  style={{ borderRadius: "10px", padding: "12px" }}
                />
              </Form.Group>

              <Dropdown className="mb-4">
                <Dropdown.Toggle
                  variant="dark"
                  className="w-100 text-start shadow-sm"
                  style={{ borderRadius: "10px", padding: "12px" }}
                >
                  {assignedDriver ? `Driver: ${assignedDriver.name} (ID: ${assignedDriver.id})` : "Select a Driver"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100" style={{ borderRadius: "10px" }}>
                  {driverList.length > 0 ? (
                    driverList.map((driver) => (
                      <Dropdown.Item
                        key={driver.id}
                        onClick={() => selectDriver(driver.id, driver.username)}
                        className="py-2"
                      >
                        {driver.username} (ID: {driver.id})
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>No Drivers Available</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              <div className="text-center d-flex gap-3 justify-content-center">
                <Button
                  variant="success"
                  type="submit"
                  className="px-4 py-2 fw-semibold rounded-pill shadow-sm"
                  style={{ background: "linear-gradient(45deg, #28a745, #38d39f)", border: "none" }}
                >
                  ✅ Confirm
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 fw-semibold rounded-pill shadow-sm"
                  style={{ background: "linear-gradient(45deg, #6c757d, #adb5bd)", border: "none" }}
                >
                  ❌ Cancel
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default CarReservation;