import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Dropdown, Button, Navbar, Nav, Modal, Form, Row, Col, FormControl } from "react-bootstrap";
import { FaCar, FaMapMarkerAlt, FaClock, FaRoad, FaDollarSign, FaSearch } from "react-icons/fa";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
`;

const BackgroundCircles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(52, 152, 219, 0.2), transparent);
    border-radius: 50%;
    top: 5%;
    left: 15%;
    animation: float 6s infinite ease-in-out;
  }

  &::after {
    content: '';
    position: absolute;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(46, 204, 113, 0.2), transparent);
    border-radius: 50%;
    bottom: 10%;
    right: 10%;
    animation: float 8s infinite ease-in-out reverse;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-25px); }
  }
`;

const StyledNavbar = styled(Navbar)`
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  margin-bottom: 40px;
  padding: 15px 20px;
`;

const StyledCard = styled(Card)`
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(8px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.3);
  }

  .card-img-top {
    height: 200px;
    object-fit: cover;
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
    backdrop-filter: blur(8px);
    border: none;
  }

  .modal-header {
    background: linear-gradient(45deg, #343a40, #495057);
    border-radius: 20px 20px 0 0;
    color: white;
    border: none;
  }

  .modal-body {
    padding: 25px;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const StyledFormControl = styled(FormControl)`
  border-radius: 25px;
  padding: 10px 15px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;
  max-width: 300px;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const CarReservation = () => {
  const [availableCars, setAvailableCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
        if (!response.ok) throw new Error("Failed to fetch cars");
        const data = await response.json();
        console.log("Fetched cars:", data); // Debug: Check the structure
        setAvailableCars(data);
        setFilteredCars(data);
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

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = availableCars.filter((car) => {
      const model = car.model ? car.model.toLowerCase() : "";
      return model.includes(query);
    });

    console.log("Search query:", query, "Filtered cars:", filtered); // Debug: Check filtering
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
      <StyledNavbar expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/" style={{ 
            color: "#3498db", 
            fontWeight: "bold", 
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center"
          }}>
            <FaCar className="me-2" /> Cab Booking
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Form className="d-flex mx-auto" style={{ maxWidth: "400px" }}>
              <div className="input-group">
                <span className="input-group-text" style={{ 
                  background: "transparent", 
                  border: "1px solid #ced4da", 
                  borderRadius: "25px 0 0 25px",
                  color: "#3498db"
                }}>
                  <FaSearch />
                </span>
                <StyledFormControl
                  type="text"
                  placeholder="Search by car model..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{ borderRadius: "0 25px 25px 0" }}
                />
              </div>
            </Form>
            <Nav className="ms-auto">
              <Nav.Link onClick={(e) => e.preventDefault()} style={{ color: "#2c3e50", padding: "10px 15px" }}>
                Reserve a Vehicle
              </Nav.Link>
              <Nav.Link as={Link} to="/ViewBookings" style={{ color: "#2c3e50", padding: "10px 15px" }}>
                My Reservations
              </Nav.Link>
              <Nav.Link as={Link} to="/UserActiveBookings" style={{ color: "#2c3e50", padding: "10px 15px" }}>
                Active Rentals
              </Nav.Link>
              <Nav.Link as={Link} to="/About" style={{ color: "#2c3e50", padding: "10px 15px" }}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/Help" style={{ color: "#2c3e50", padding: "10px 15px" }}>
                Help
              </Nav.Link>
              <StyledButton
                as={Link}
                to="/"
                variant="outline-danger"
                style={{ 
                  borderRadius: "25px", 
                  borderColor: "#e74c3c",
                  color: "#e74c3c",
                  background: "transparent"
                }}
              >
                Logout
              </StyledButton>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>

      <StyledContainer>
        <BackgroundCircles />
        <div className="text-center mb-5">
          <h2 style={{ 
            background: "linear-gradient(to right, #3498db, #2ecc71)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            fontSize: "2.5rem"
          }}>
            Available Cars
          </h2>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredCars.map((car) => (
            <Col key={car.id}>
              <StyledCard>
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={car.photo?.startsWith("data:image") ? car.photo : `data:image/jpeg;base64,${car.photo}`}
                    alt={car.model}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      background: "rgba(0, 0, 0, 0.4)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    <StyledButton
                      variant="primary"
                      onClick={() => handleOpenModal(car.id)}
                      style={{ background: "linear-gradient(45deg, #3498db, #2980b9)", border: "none" }}
                    >
                      Book Now
                    </StyledButton>
                  </div>
                </div>
                <Card.Body className="text-center p-4">
                  <Card.Title style={{ color: "#2c3e50", fontSize: "1.5rem", fontWeight: "bold" }}>
                    {car.model}
                  </Card.Title>
                  <Card.Text style={{ color: "#7f8c8d" }}>
                    <div className="d-flex flex-column gap-2">
                      <span><strong>Plate:</strong> {car.licensePlate}</span>
                      <span><strong>Seats:</strong> {car.seats}</span>
                      <span><strong>Engine:</strong> {car.capacity} CC</span>
                      <span><strong>Rate:</strong> <span style={{ color: "#2ecc71", fontWeight: "bold" }}>${car.pricePerKm}</span> /km</span>
                    </div>
                  </Card.Text>
                </Card.Body>
              </StyledCard>
            </Col>
          ))}
          {filteredCars.length === 0 && (
            <Col className="text-center">
              <p style={{ color: "#7f8c8d", marginTop: "20px" }}>No cars match your search.</p>
            </Col>
          )}
        </Row>

        <StyledModal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered>
          <Modal.Header>
            <Modal.Title>
              <FaCar className="me-2" /> Book Your Ride
            </Modal.Title>
            <Button variant="link" style={{ color: "white" }} onClick={() => setShowBookingModal(false)}>
              ×
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={processBooking}>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  <FaMapMarkerAlt className="me-2" /> Pickup Location
                </Form.Label>
                <StyledFormControl
                  type="text"
                  name="location"
                  placeholder="Enter pickup point"
                  value={bookingInfo.location}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  <FaClock className="me-2" /> Pickup Time
                </Form.Label>
                <StyledFormControl
                  type="datetime-local"
                  name="time"
                  value={bookingInfo.time}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  <FaRoad className="me-2" /> Distance (km)
                </Form.Label>
                <StyledFormControl
                  type="number"
                  name="travelDistance"
                  placeholder="Enter travel distance"
                  value={bookingInfo.travelDistance}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  <FaDollarSign className="me-2" /> Total Fee ($)
                </Form.Label>
                <StyledFormControl
                  type="text"
                  value={bookingInfo.totalfee || 0}
                  readOnly
                  style={{ background: "#ecf0f1" }}
                />
              </Form.Group>

              <Dropdown className="mb-4">
                <Dropdown.Toggle
                  variant="dark"
                  className="w-100 text-start"
                  style={{ 
                    background: "linear-gradient(45deg, #2c3e50, #34495e)", 
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px"
                  }}
                >
                  {assignedDriver ? `Driver: ${assignedDriver.name}` : "Select a Driver"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100" style={{ borderRadius: "10px" }}>
                  {driverList.length > 0 ? (
                    driverList.map((driver) => (
                      <Dropdown.Item
                        key={driver.id}
                        onClick={() => selectDriver(driver.id, driver.username)}
                        style={{ padding: "10px" }}
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
                <StyledButton
                  variant="success"
                  type="submit"
                  style={{ background: "linear-gradient(45deg, #2ecc71, #27ae60)", border: "none" }}
                >
                  Confirm Booking
                </StyledButton>
                <StyledButton
                  variant="secondary"
                  onClick={() => setShowBookingModal(false)}
                  style={{ background: "linear-gradient(45deg, #95a5a6, #7f8c8d)", border: "none" }}
                >
                  Cancel
                </StyledButton>
              </div>
            </Form>
          </Modal.Body>
        </StyledModal>
      </StyledContainer>
    </>
  );
};

export default CarReservation; 