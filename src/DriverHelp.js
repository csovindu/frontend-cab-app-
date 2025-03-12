import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Row, Col, Accordion, Card, Form, Modal } from "react-bootstrap";
import "./App.css"; // Optional: for global styles

const DriverHelp = () => {
  // State for Chatbot Modal
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponses, setChatResponses] = useState([
    { sender: "Bot", message: "Hello, Driver! How can I assist you with your dashboard? Type 'rides' for booking help, 'status' for status info, or ask anything!" }
  ]);

  // Handle Chatbot Input
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Add user's message to chat
    setChatResponses(prev => [...prev, { sender: "You", message: chatMessage }]);

    // Driver-specific bot logic based on DriverDashboard
    let botResponse = "I’m here to help! Please provide more details or try a specific command.";
    if (chatMessage.toLowerCase().includes("rides") || chatMessage.toLowerCase().includes("bookings")) {
      botResponse = "Your rides are shown on the 'Driver Dashboard.' You’ll see Ride ID, Car Model, Location, Time, Status, and Payment Status. Use 'Confirm' to start a ride or 'Cancel' to remove it. Need help with a specific ride? Give me the Ride ID (e.g., 'ID: 123').";
    } else if (/id:\s*\d+/i.test(chatMessage)) {
      const rideId = chatMessage.match(/\d+/)[0];
      botResponse = `Checking Ride ID ${rideId}... It should appear on your dashboard with details like location and status. Use 'Confirm' to set it 'In Progress' or 'Cancel' to mark it 'Cancelled.' Want more details? Ask me!`;
      // Optional: Add API call (e.g., fetch(`/rental/${rideId}`))
    } else if (chatMessage.toLowerCase().includes("status")) {
      botResponse = "Ride statuses on your dashboard are: 'Pending' (yellow) - not started, 'In Progress' (blue) - confirmed and active, 'Cancelled' (red) - deleted. Use 'Confirm' to change to 'In Progress' or 'Cancel' to set as 'Cancelled.'";
    } else if (chatMessage.toLowerCase().includes("payment")) {
      botResponse = "Payment status is shown as 'Unpaid' (red) or 'Paid' (green) on your dashboard. You can’t update it directly—contact support or the customer for payment issues.";
    } else if (chatMessage.toLowerCase().includes("confirm") || chatMessage.toLowerCase().includes("cancel")) {
      botResponse = "'Confirm' sets a ride to 'In Progress' (updates bookstatus to 1). 'Cancel' marks it as 'Cancelled' (updates bookstatus to 2). Both buttons are on each ride card in your dashboard.";
    }

    setTimeout(() => {
      setChatResponses(prev => [...prev, { sender: "Bot", message: botResponse }]);
    }, 500);

    setChatMessage("");
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-5 shadow-lg" style={{ borderBottom: "2px solid #e9ecef", borderRadius: "0 0 20px 20px" }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-blue-600 fw-bold text-xl d-flex align-items-center">
            <span className="me-2">🚘</span> Rent-A-Car
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarContent" />
          <Navbar.Collapse id="navbarContent">
            <Nav className="ms-auto d-flex align-items-center gap-4">
              <Nav.Link as={Link} to="/DriverHome" className="text-gray-700 hover-text-blue transition fw-medium">
                Driver Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/DriverInProgressBookings" className="text-gray-700 hover-text-blue transition fw-medium">
                Active Rentals
              </Nav.Link>
              <Nav.Link as={Link} to="/DriverHelp" className="text-blue-600 fw-bold transition active">
                Help
              </Nav.Link>
              <Button 
                as={Link} 
                to="/" 
                variant="outline-danger" 
                className="rounded-pill px-4 py-1 fw-semibold text-red-500 border-red-500 hover-bg-red-500 hover-text-white transition"
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Driver Help Content */}
      <Container className="py-5">
        {/* Header */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="display-4 fw-bold" style={{ color: "#007bff", fontFamily: "'Poppins', sans-serif" }}>
              Driver Help Center
            </h1>
            <p className="lead text-muted mt-3" style={{ maxWidth: "700px", margin: "0 auto" }}>
              Assistance for managing your rides and bookings on the Rent-A-Car Driver Dashboard.
            </p>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold text-primary mb-4">Frequently Asked Questions</h2>
            <Accordion defaultActiveKey="0" className="shadow-sm" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <Accordion.Item eventKey="0" style={{ border: "none" }}>
                <Accordion.Header style={{ background: "linear-gradient(45deg, #007bff, #00c4cc)", color: "#fff", borderRadius: "15px 15px 0 0" }}>
                  How do I view my rides?
                </Accordion.Header>
                <Accordion.Body className="py-4">
                  On the "Driver Dashboard," you’ll see all rides assigned to your Driver ID ({localStorage.getItem("userId") || "Not Available"}). Each ride shows the car model, location, time, status, and payment status.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" style={{ border: "none" }}>
                <Accordion.Header style={{ background: "#f8f9fa" }}>
                  How do I confirm a ride?
                </Accordion.Header>
                <Accordion.Body className="py-4">
                  On your dashboard, find the ride card and click the green "Confirm" button. This sets the status to "In Progress" (bookstatus: 1), indicating you’ve started the ride.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2" style={{ border: "none" }}>
                <Accordion.Header style={{ background: "#f8f9fa" }}>
                  How do I cancel a ride?
                </Accordion.Header>
                <Accordion.Body className="py-4">
                  On the ride card, click the red "Cancel" button. This updates the status to "Cancelled" (bookstatus: 2), removing it from your active list.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3" style={{ border: "none" }}>
                <Accordion.Header style={{ background: "#f8f9fa", borderRadius: "0 0 15px 15px" }}>
                  What do the ride statuses mean?
                </Accordion.Header>
                <Accordion.Body className="py-4">
                  - <strong>Pending</strong> (yellow): Ride is assigned but not started.<br />
                  - <strong>In Progress</strong> (blue): You’ve confirmed the ride.<br />
                  - <strong>Cancelled</strong> (red): Ride has been canceled and is hidden from your dashboard.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* Contact Section */}
        <Row className="mb-5">
          <Col md={6} className="mb-4">
            <Card className="shadow-lg border-0" style={{ borderRadius: "20px", background: "#f8f9fa" }}>
              <Card.Body className="text-center p-5">
                <h3 className="fw-bold text-dark mb-4">Contact Support</h3>
                <p className="text-muted" style={{ lineHeight: "1.8" }}>
                  <strong>Email:</strong> support@rentacar.com <br />
                  <strong>Phone:</strong> +94 787471008 <br />
                  <strong>Driver Hotline:</strong> +94 1122334455
                </p>
                <Button 
                  href="mailto:support@rentacar.com?subject=Driver Dashboard Support&body=Please include your Driver ID and issue details."
                  style={{ backgroundColor: "#cce5ff", borderColor: "#b8daff", color: "#004085" }}
                  className="mt-3 px-5 py-2 fw-semibold rounded-pill shadow-sm hover-bg-blue-500 hover-text-white transition"
                >
                  Email Us
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="shadow-lg border-0" style={{ borderRadius: "20px", background: "#f8f9fa" }}>
              <Card.Body className="text-center p-5">
                <h3 className="fw-bold text-dark mb-4">Chat with Us</h3>
                <p className="text-muted" style={{ lineHeight: "1.8" }}>
                  Get instant help for your dashboard queries.
                </p>
                <Button 
                  style={{ backgroundColor: "#cce5ff", borderColor: "#b8daff", color: "#004085" }}
                  className="mt-3 px-5 py-2 fw-semibold rounded-pill shadow-sm hover-bg-blue-500 hover-text-white transition"
                  onClick={() => setShowChatbot(true)}
                >
                  Start Chat
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Back to Dashboard */}
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold text-primary mb-4">Need More Help?</h2>
            <p className="text-muted mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
              Contact us or return to your dashboard for ride management.
            </p>
            <Button 
              as={Link} 
              to="/drive" 
              style={{ background: "linear-gradient(45deg, #007bff, #00c4cc)", border: "none" }}
              className="px-5 py-3 fw-semibold rounded-pill shadow-lg hover-bg-blue-600 transition"
            >
              Back to Driver Home
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Chatbot Modal */}
      <Modal show={showChatbot} onHide={() => setShowChatbot(false)} centered>
        <Modal.Header style={{ background: "linear-gradient(45deg, #007bff, #00c4cc)", border: "none", color: "#fff", borderRadius: "20px 20px 0 0" }}>
          <Modal.Title className="fw-bold">Driver Chat Support</Modal.Title>
          <Button variant="link" className="text-white" onClick={() => setShowChatbot(false)} style={{ textDecoration: "none", fontSize: "1.5rem" }}>
            ×
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: "#f8f9fa", maxHeight: "400px", overflowY: "auto" }}>
          {chatResponses.map((chat, index) => (
            <div key={index} className={`mb-3 ${chat.sender === "You" ? "text-end" : "text-start"}`}>
              <span 
                className={`d-inline-block p-3 rounded ${chat.sender === "You" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                style={{ maxWidth: "75%", borderRadius: "15px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
              >
                <strong>{chat.sender}:</strong> {chat.message}
              </span>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="bg-light border-0" style={{ borderRadius: "0 0 20px 20px" }}>
          <Form className="w-100" onSubmit={handleChatSubmit}>
            <Row className="align-items-center">
              <Col xs={9}>
                <Form.Control
                  type="text"
                  placeholder="Ask about your rides..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="shadow-sm rounded-pill"
                  style={{ borderColor: "#007bff" }}
                />
              </Col>
              <Col xs={3}>
                <Button 
                  type="submit" 
                  style={{ backgroundColor: "#cce5ff", borderColor: "#b8daff", color: "#004085" }}
                  className="w-100 rounded-pill shadow-sm hover-bg-blue-500 hover-text-white transition"
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Footer>
      </Modal>

      {/* Custom CSS */}
      <style jsx>{`
        .hover-text-blue:hover {
          color: #007bff !important;
        }
        .hover-bg-blue-500:hover {
          background-color: #007bff !important;
          color: #fff !important;
        }
        .hover-text-white:hover {
          color: #fff !important;
        }
        .hover-bg-red-500:hover {
          background-color: #dc3545 !important;
        }
        .hover-bg-blue-600:hover {
          background: #0069d9 !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
        .accordion-button:not(.collapsed) {
          background: linear-gradient(45deg, #007bff, #00c4cc) !important;
          color: #fff !important;
        }
        .bg-blue-100 {
          background-color: #cce5ff !important;
        }
        .text-blue-800 {
          color: #004085 !important;
        }
        .bg-gray-100 {
          background-color: #e9ecef !important;
        }
        .text-gray-800 {
          color: #343a40 !important;
        }
      `}</style>
    </>
  );
};

export default DriverHelp;