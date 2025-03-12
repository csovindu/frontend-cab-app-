import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Card, Button, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCar, FaMapMarkerAlt, FaClock, FaRoad, FaDollarSign, FaTrash, FaFileDownload, FaCreditCard } from "react-icons/fa";
import styled from "styled-components";
import jsPDF from "jspdf";

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

  .card-header {
    background: linear-gradient(45deg, #3498db, #2980b9);
    border-bottom: none;
  }

  .card-footer {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    border-top: none;
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

  .modal-footer {
    border-top: none;
    background: #f8f9fa;
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
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const StyledSelect = styled(Form.Select)`
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

function DriverDashboard() {
  const driverId = localStorage.getItem("userId");
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchAssignedBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/rental/all");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        
        const data = await response.json();
        const filteredData = data.filter(
          (booking) => String(booking.userid) === driverId && booking.bookstatus === 1
        );
        setAssignedBookings(filteredData);
      } catch (error) {
        console.error("Error fetching assigned bookings:", error);
      }
    };

    fetchAssignedBookings();
  }, [driverId]);

  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedBooking) return;

    try {
      const updatedBooking = { ...selectedBooking, paymentstatus: 1 };
      const response = await fetch(`http://localhost:8080/rental/update/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });

      if (!response.ok) throw new Error("Failed to update payment status");

      setAssignedBookings(prev =>
        prev.map(booking =>
          booking.id === selectedBooking.id ? { ...booking, paymentstatus: 1 } : booking
        )
      );

      setShowPaymentModal(false);
      setSelectedBooking(null);
      alert("Payment processed successfully!");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8080/rental/delete/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setAssignedBookings(prev => prev.filter(booking => booking.id !== bookingId));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  };

  const downloadBillAsPDF = (booking) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(52, 152, 219);
    doc.text("Rent-A-Car Bill", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Driver Dashboard Receipt", 105, 30, { align: "center" });

    doc.setFontSize(14);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.id}`, 20, 50);
    doc.text(`User ID: ${booking.userid}`, 20, 60);
    doc.text(`Car ID: ${booking.carid}`, 20, 70);
    doc.text(`Pickup Location: ${booking.location}`, 20, 80);
    doc.text(`Pickup Time: ${booking.time}`, 20, 90);
    doc.text(`Travel Distance: ${booking.travelDistance > 0 ? `${booking.travelDistance} km` : "Not Complete"}`, 20, 100);
    doc.text(`Total Fee: $${booking.totalfee ? booking.totalfee.toFixed(2) : "N/A"}`, 20, 110);
    doc.text(`Payment Status: ${booking.paymentstatus === 1 ? "Paid" : "Unpaid"}`, 20, 120);
    doc.text(`Status: Driver Accepted`, 20, 130);

    doc.line(20, 140, 190, 140);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for using Rent-A-Car!", 105, 150, { align: "center" });

    doc.save(`Bill_Booking_${booking.id}.pdf`);
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
            Driver Dashboard
          </h1>
          <p style={{ color: "#7f8c8d" }}>Assigned Bookings for Driver ID: {driverId || "N/A"}</p>
        </div>

        {assignedBookings.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {assignedBookings.map((booking) => (
              <Col key={booking.id}>
                <StyledCard>
                  <Card.Header className="text-white py-3">
                    <Card.Title style={{ marginBottom: 0, fontWeight: "bold" }}>
                      Bill #{booking.id}
                    </Card.Title>
                    <Card.Subtitle style={{ marginTop: "5px", opacity: 0.75 }}>
                      User ID: {booking.userid}
                    </Card.Subtitle>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="d-flex flex-column gap-2" style={{ color: "#7f8c8d" }}>
                      <div className="d-flex justify-content-between">
                        <strong><FaCar className="me-2" />Car ID:</strong>
                        <span>{booking.carid}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong><FaMapMarkerAlt className="me-2" />Pickup Location:</strong>
                        <span>{booking.location}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong><FaClock className="me-2" />Pickup Time:</strong>
                        <span>{new Date(booking.time).toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong><FaRoad className="me-2" />Travel Distance:</strong>
                        <Badge bg={booking.travelDistance > 0 ? "info" : "warning"} className="px-2 py-1">
                          {booking.travelDistance > 0 ? `${booking.travelDistance} km` : "Not Complete"}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong><FaDollarSign className="me-2" />Total Fee:</strong>
                        <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
                          ${booking.totalfee ? booking.totalfee.toFixed(2) : "N/A"}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong>Payment Status:</strong>
                        <Badge bg={booking.paymentstatus === 1 ? "success" : "danger"} className="px-2 py-1">
                          {booking.paymentstatus === 1 ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="text-white text-center py-3">
                    <p className="mb-2" style={{ fontWeight: "bold" }}>✓ Driver Accepted</p>
                    <div className="d-flex justify-content-center gap-2">
                      {booking.paymentstatus === 0 && (
                        <StyledButton
                          variant="light"
                          onClick={() => handlePaymentClick(booking)}
                          style={{ background: "linear-gradient(45deg, #3498db, #2980b9)", border: "none" }}
                        >
                          <FaCreditCard className="me-2" /> Make Payment
                        </StyledButton>
                      )}
                      <StyledButton
                        variant="light"
                        onClick={() => downloadBillAsPDF(booking)}
                        style={{ background: "linear-gradient(45deg, #f1c40f, #e67e22)", border: "none" }}
                      >
                        <FaFileDownload className="me-2" /> Download Bill
                      </StyledButton>
                      <StyledButton
                        variant="danger"
                        onClick={() => handleDeleteBooking(booking.id)}
                        style={{ background: "linear-gradient(45deg, #e74c3c, #c0392b)", border: "none" }}
                      >
                        <FaTrash className="me-2" /> Delete
                      </StyledButton>
                    </div>
                  </Card.Footer>
                </StyledCard>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center mt-5">
            <StyledCard style={{ maxWidth: "500px", margin: "0 auto" }}>
              <Card.Body className="py-5">
                <h5 style={{ color: "#7f8c8d" }}>No Confirmed Bookings</h5>
                <p style={{ color: "#7f8c8d" }}>Currently, there are no bookings assigned to you. Check back later!</p>
              </Card.Body>
            </StyledCard>
          </div>
        )}

        <StyledModal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
          <Modal.Header>
            <Modal.Title>
              <FaCreditCard className="me-2" /> Process Payment for Booking #{selectedBooking?.id}
            </Modal.Title>
            <Button variant="link" style={{ color: "white" }} onClick={() => setShowPaymentModal(false)}>
              ×
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  <FaDollarSign className="me-2" /> Total Amount
                </Form.Label>
                <StyledFormControl
                  type="text"
                  value={`$${selectedBooking?.totalfee ? selectedBooking.totalfee.toFixed(2) : "N/A"}`}
                  readOnly
                  style={{ background: "#ecf0f1" }}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label style={{ color: "#2c3e50", fontWeight: "bold" }}>
                  Payment Method
                </Form.Label>
                <StyledSelect>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="paypal">PayPal</option>
                </StyledSelect>
              </Form.Group>
              <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                This is a simulated payment. In a real application, you'd integrate with a payment gateway.
              </p>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <StyledButton
              variant="secondary"
              onClick={() => setShowPaymentModal(false)}
              style={{ background: "linear-gradient(45deg, #95a5a6, #7f8c8d)", border: "none" }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              variant="success"
              onClick={processPayment}
              style={{ background: "linear-gradient(45deg, #2ecc71, #27ae60)", border: "none" }}
            >
              Confirm Payment
            </StyledButton>
          </Modal.Footer>
        </StyledModal>
      </StyledContainer>
    </>
  );
}

export default DriverDashboard;