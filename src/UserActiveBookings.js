import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Card, Button, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

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

  // Open payment modal
  const handlePaymentClick = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  // Simulate payment and update status
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

  // Delete booking
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

  // Generate and download PDF bill
  const downloadBillAsPDF = (booking) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text("Rent-A-Car Bill", 105, 20, { align: "center" });
    
    // Subheader
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Driver Dashboard Receipt", 105, 30, { align: "center" });

    // Bill details
    doc.setFontSize(14);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40); // Horizontal line

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

    // Footer
    doc.line(20, 140, 190, 140); // Horizontal line
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text("Thank you for using Rent-A-Car!", 105, 150, { align: "center" });

    doc.save(`Bill_Booking_${booking.id}.pdf`);
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200 rounded-b-xl">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-2xl flex items-center">
          🚘cab booking system
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
              <Nav.Link as={Link} to="/About" className="text-gray-700 hover:text-blue-600 transition font-medium"> About </Nav.Link>
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
        {/* Header */}
        <div className="text-center mb-5">
          <h4 className="display-6 fw-bold text-primary">Driver Dashboard</h4>
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
                  style={{ borderRadius: "15px", overflow: "hidden", transition: "transform 0.3s" }}
                >
                  <Card.Header className="bg-primary text-white py-3" style={{ borderBottom: "3px solid #fff" }}>
                    <Card.Title className="mb-0 fw-bold">Bill #{booking.id}</Card.Title>
                    <Card.Subtitle className="mt-1 opacity-75">User ID: {booking.userid}</Card.Subtitle>
                  </Card.Header>

                  <Card.Body className="p-4">
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Car ID:</strong>
                        <span>{booking.carid}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Pickup Location:</strong>
                        <span>{booking.location}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Pickup Time:</strong>
                        <span>{booking.time}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Travel Distance:</strong>
                        <Badge bg={booking.travelDistance > 0 ? "info" : "warning"}>
                          {booking.travelDistance > 0 ? `${booking.travelDistance} km` : "Not Complete"}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Total Fee:</strong>
                        <span className="fw-bold text-success">${booking.totalfee ? booking.totalfee.toFixed(2) : "N/A"}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-muted">Payment Status:</strong>
                        <Badge bg={booking.paymentstatus === 1 ? "success" : "danger"} className="px-2 py-1">
                          {booking.paymentstatus === 1 ? "Paid" : "Unpaid"}
                        </Badge>
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-success text-white text-center py-3">
                    <p className="mb-2 fw-bold">✓ Driver Accepted</p>
                    <div className="d-flex justify-content-center gap-2">
                      {booking.paymentstatus === 0 && (
                        <Button
                          variant="light"
                          className="rounded-pill px-4 py-1 fw-semibold"
                          style={{ background: "white", color: "#28a745", border: "none" }}
                          onClick={() => handlePaymentClick(booking)}
                        >
                          Make Payment
                        </Button>
                      )}
                      <Button
                        variant="light"
                        className="rounded-pill px-4 py-1 fw-semibold"
                        style={{ background: "white", color: "#007bff", border: "none" }}
                        onClick={() => downloadBillAsPDF(booking)}
                      >
                        Download Bill
                      </Button>
                      <Button
                        variant="light"
                        className="rounded-pill px-4 py-1 fw-semibold"
                        style={{ background: "white", color: "#dc3545", border: "none" }}
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Delete
                      </Button>
                    </div>
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
                <p className="text-secondary">Currently, there are no bookings assigned to you. Check back later!</p>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header className="bg-dark text-white border-0" style={{ borderRadius: "15px 15px 0 0" }}>
          <Modal.Title className="fw-bold">Process Payment for Booking #{selectedBooking?.id}</Modal.Title>
          <Button variant="link" className="text-white" onClick={() => setShowPaymentModal(false)} style={{ textDecoration: "none" }}>
            ×
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: "#f8f9fa" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Total Amount</Form.Label>
              <Form.Control
                type="text"
                value={`$${selectedBooking?.totalfee ? selectedBooking.totalfee.toFixed(2) : "N/A"}`}
                readOnly
                className="shadow-sm"
                style={{ borderRadius: "10px" }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Payment Method</Form.Label>
              <Form.Select className="shadow-sm" style={{ borderRadius: "10px" }}>
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">PayPal</option>
              </Form.Select>
            </Form.Group>
            <p className="text-muted">This is a simulated payment. In a real application, you'd integrate with a payment gateway.</p>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light border-0" style={{ borderRadius: "0 0 15px 15px" }}>
          <Button
            variant="secondary"
            className="rounded-pill px-4 py-2 fw-semibold"
            onClick={() => setShowPaymentModal(false)}
            style={{ background: "linear-gradient(45deg, #6c757d, #adb5bd)", border: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            className="rounded-pill px-4 py-2 fw-semibold"
            onClick={processPayment}
            style={{ background: "linear-gradient(45deg, #28a745, #38d39f)", border: "none" }}
          >
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DriverDashboard;