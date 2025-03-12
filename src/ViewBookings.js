import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Button, Form, Card, Row, Col, Modal } from "react-bootstrap";
import { FaCar, FaMapMarkerAlt, FaClock, FaRoad, FaDollarSign, FaSearch, FaTrash, FaEdit } from "react-icons/fa";
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
    height: 180px;
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
    background: linear-gradient(45deg, #3498db, #2980b9);
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

const StyledFormControl = styled(Form.Control)`
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

function MyBookings() {
  const userId = localStorage.getItem("userId");
  const [bookingsList, setBookingsList] = useState([]); // Fixed typo: use_STATUS -> useState
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [carDetails, setCarDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    time: "",
    travelDistance: "",
    totalFee: 0,
  });

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/rental/all");
        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        const userBookings = data.filter((booking) => booking.userid === userId);
        setBookingsList(userBookings);
        setFilteredBookings(userBookings);

        const uniqueCarIds = [...new Set(userBookings.map((b) => b.carid))];
        const carData = {};
        await Promise.all(
          uniqueCarIds.map(async (carId) => {
            try {
              const carResponse = await fetch(`http://localhost:8080/cars/${carId}`);
              if (!carResponse.ok) throw new Error("Failed to fetch car data");
              const carInfo = await carResponse.json();
              carData[carId] = carInfo;
            } catch (error) {
              console.error(`Error fetching car details for carId ${carId}:`, error);
            }
          })
        );
        setCarDetails(carData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchUserBookings();
  }, [userId]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = bookingsList.filter((booking) => {
      const car = carDetails[booking.carid];
      const model = car && car.model ? car.model.toLowerCase() : "";
      return model.includes(query);
    });
    setFilteredBookings(filtered);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8080/rental/delete/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookingsList(bookingsList.filter((booking) => booking.id !== bookingId));
      setFilteredBookings(filteredBookings.filter((booking) => booking.id !== bookingId));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  const handleOpenEditModal = (booking) => {
    const car = carDetails[booking.carid];
    setSelectedBooking(booking);
    setEditForm({
      location: booking.location,
      time: booking.time.slice(0, 16),
      travelDistance: booking.travelDistance,
      totalFee: car ? car.pricePerKm * parseFloat(booking.travelDistance || 0) : booking.totalfee,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "travelDistance" && selectedBooking) {
        const car = carDetails[selectedBooking.carid];
        updatedForm.totalFee = car ? car.pricePerKm * parseFloat(value || 0) : prev.totalFee;
      }
      return updatedForm;
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editForm.location || !editForm.time || !editForm.travelDistance) {
      alert("Please complete all required fields.");
      return;
    }

    const updatedBooking = {
      ...selectedBooking,
      location: editForm.location,
      time: editForm.time,
      travelDistance: editForm.travelDistance,
      totalfee: editForm.totalFee,
    };

    try {
      const response = await fetch(`http://localhost:8080/rental/update/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });

      if (!response.ok) throw new Error("Failed to update booking");

      setBookingsList(bookingsList.map((b) => (b.id === selectedBooking.id ? updatedBooking : b)));
      setFilteredBookings(filteredBookings.map((b) => (b.id === selectedBooking.id ? updatedBooking : b)));
      setShowEditModal(false);
      alert("Booking updated successfully!");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking.");
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
              <Nav.Link as={Link} to="/customer" style={{ color: "#2c3e50", padding: "10px 15px" }}>
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
          <h1 style={{ 
            background: "linear-gradient(to right, #3498db, #2ecc71)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            fontSize: "2.5rem"
          }}>
            My Bookings
          </h1>
          <p style={{ color: "#7f8c8d" }}>User ID: {userId || "N/A"}</p>
        </div>

        {filteredBookings.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredBookings.map((booking) => {
              const car = carDetails[booking.carid];
              return (
                <Col key={booking.id}>
                  <StyledCard>
                    {car && car.photo ? (
                      <Card.Img
                        variant="top"
                        src={car.photo.startsWith("data:image") ? car.photo : `data:image/jpeg;base64,${car.photo}`}
                        alt={car.model}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "180px", borderRadius: "20px 20px 0 0" }}
                      >
                        <span style={{ color: "#7f8c8d" }}>No Image</span>
                      </div>
                    )}
                    <Card.Body className="p-4">
                      <Card.Title style={{ color: "#2c3e50", fontSize: "1.5rem", fontWeight: "bold" }}>
                        {car ? car.model : "Unknown Car"}
                      </Card.Title>
                      <Card.Text style={{ color: "#7f8c8d" }}>
                        <div className="d-flex flex-column gap-2">
                          <span><FaMapMarkerAlt className="me-2" /><strong>Location:</strong> {booking.location}</span>
                          <span><FaClock className="me-2" /><strong>Time:</strong> {new Date(booking.time).toLocaleString()}</span>
                          <span>
                            <FaRoad className="me-2" /><strong>Status:</strong>{" "}
                            <span style={{ color: booking.bookstatus === 0 ? "#f39c12" : "#2ecc71" }}>
                              {booking.bookstatus === 0 ? "Pending" : "Confirmed"}
                            </span>
                          </span>
                          <span><FaDollarSign className="me-2" /><strong>Total Fee:</strong> ${booking.totalfee.toFixed(2)}</span>
                          <span>
                            <strong>Payment:</strong>{" "}
                            <span style={{ color: booking.paymentstatus === 0 ? "#e74c3c" : "#2ecc71" }}>
                              {booking.paymentstatus === 0 ? "Unpaid" : "Paid"}
                            </span>
                          </span>
                        </div>
                      </Card.Text>
                      <div className="d-flex gap-2 mt-3 justify-content-center">
                        <StyledButton
                          variant="primary"
                          onClick={() => handleOpenEditModal(booking)}
                          style={{ background: "linear-gradient(45deg, #3498db, #2980b9)", border: "none" }}
                        >
                          <FaEdit className="me-2" /> Edit
                        </StyledButton>
                        <StyledButton
                          variant="danger"
                          onClick={() => handleDeleteBooking(booking.id)}
                          style={{ background: "linear-gradient(45deg, #e74c3c, #c0392b)", border: "none" }}
                        >
                          <FaTrash className="me-2" /> Delete
                        </StyledButton>
                      </div>
                    </Card.Body>
                  </StyledCard>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className="text-center" style={{ color: "#7f8c8d", marginTop: "50px" }}>
            No bookings match your search or you have no bookings yet.
          </p>
        )}

        <StyledModal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header>
            <Modal.Title>
              <FaCar className="me-2" /> Edit Booking - {selectedBooking && carDetails[selectedBooking.carid]?.model}
            </Modal.Title>
            <Button variant="link" style={{ color: "white" }} onClick={() => setShowEditModal(false)}>
              ×
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSaveEdit}>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  <FaMapMarkerAlt className="me-2" /> Pickup Location
                </Form.Label>
                <StyledFormControl
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleEditInputChange}
                  placeholder="e.g., Downtown"
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
                  value={editForm.time}
                  onChange={handleEditInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  <FaRoad className="me-2" /> Travel Distance (km)
                </Form.Label>
                <StyledFormControl
                  type="number"
                  name="travelDistance"
                  value={editForm.travelDistance}
                  onChange={handleEditInputChange}
                  placeholder="e.g., 10"
                  required
                />
              </Form.Group>

              <div className="text-center mb-4">
                <h5 style={{ color: "#2c3e50" }}>
                  <FaDollarSign className="me-2" /> Total: ${editForm.totalFee.toFixed(2)}
                </h5>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <StyledButton
                  variant="success"
                  type="submit"
                  style={{ background: "linear-gradient(45deg, #2ecc71, #27ae60)", border: "none" }}
                >
                  Save Changes
                </StyledButton>
                <StyledButton
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
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
}

export default MyBookings;