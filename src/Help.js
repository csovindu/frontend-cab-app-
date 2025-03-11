import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Row, Col, Accordion, Card, Form, Modal } from "react-bootstrap";
import "./App.css"; // Assuming you have some global styles

const Help = () => {
  // State for Chatbot Modal
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponses, setChatResponses] = useState([
    { sender: "Bot", message: "Hello! How can I assist you today? Type 'book' to make a booking or ask a question." }
  ]);

  // Handle Chatbot Input
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // Add user's message to chat
    setChatResponses(prev => [...prev, { sender: "You", message: chatMessage }]);

    // Simple bot logic
    let botResponse = "I'm here to help! Could you please clarify your request?";
    if (chatMessage.toLowerCase().includes("book")) {
      botResponse = "To book a car, I'll need some details. Please provide: Pickup Location, Time (YYYY-MM-DDTHH:MM), and Distance (km). For example: 'Colombo, 2025-03-15T10:00, 20'";
    } else if (chatMessage.toLowerCase().includes("location") && chatMessage.toLowerCase().includes("time") && chatMessage.toLowerCase().includes("km")) {
      botResponse = "Great! I've submitted your booking request. Please check 'My Reservations' for confirmation.";
      // Here you could add API call to /rental/create with parsed data
    }

    setTimeout(() => {
      setChatResponses(prev => [...prev, { sender: "Bot", message: botResponse }]);
    }, 500);

    setChatMessage("");
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

      {/* Help Page Content */}
      <Container className="py-5">
        {/* Header Section */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="display-4 fw-bold text-dark" style={{ letterSpacing: "1px" }}>
              Help Center
            </h1>
            <p className="lead text-muted mt-3" style={{ maxWidth: "700px", margin: "0 auto" }}>
              Find answers to your questions or get assistance with cab booking system services.
            </p>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="fw-bold text-primary mb-4">Frequently Asked Questions</h2>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0" className="mb-3 shadow-sm" style={{ borderRadius: "10px" }}>
                <Accordion.Header>How do I book a car?</Accordion.Header>
                <Accordion.Body>
                  To book a car, go to the "Reserve a Vehicle" page, browse available cars, select your preferred vehicle, 
                  and fill out the booking form with your pickup location, time, distance, and driver preference. 
                  Click "Confirm" to complete your booking. Or use our chatbot below!
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1" className="mb-3 shadow-sm" style={{ borderRadius: "10px" }}>
                <Accordion.Header>How is the total fee calculated?</Accordion.Header>
                <Accordion.Body>
                  The total fee is calculated by multiplying the car's price per kilometer by the travel distance you 
                  enter in the booking form. The fee is displayed automatically before you confirm your booking.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2" className="mb-3 shadow-sm" style={{ borderRadius: "10px" }}>
                <Accordion.Header>Can I cancel a booking?</Accordion.Header>
                <Accordion.Body>
                  Yes, you can cancel a booking by navigating to "My Reservations," finding your booking, and selecting 
                  the cancel option. Note that cancellation policies may apply depending on the timing.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3" className="mb-3 shadow-sm" style={{ borderRadius: "10px" }}>
                <Accordion.Header>What if I need help during my rental?</Accordion.Header>
                <Accordion.Body>
                  If you need assistance during your rental, check your "Active Rentals" page for driver contact details 
                  or reach out to our support team via email or chat below.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* Contact Section */}
        <Row className="mb-5">
          <Col md={6} className="mb-4">
            <Card className="shadow-sm border-0" style={{ borderRadius: "15px" }}>
              <Card.Body className="text-center p-4">
                <h3 className="fw-bold text-dark mb-3">Contact Us</h3>
                <p className="text-muted" style={{ lineHeight: "1.8" }}>
                  <strong>Email:</strong> ovndu.071@gmail.com <br />
                  <strong>Phone:</strong> +94 787471008 <br />
                  
                </p>
                <Button 
                  href="mailto:ovndu.071@gmail.com?subject=Support Request from Rent-A-Car&body=Please describe your issue or question here."
                  variant="primary" 
                  className="mt-3 px-4 py-2 fw-semibold rounded-pill"
                  style={{ background: "linear-gradient(45deg, #007bff, #00b4db)", border: "none" }}
                >
                  Email Support
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="shadow-sm border-0" style={{ borderRadius: "15px" }}>
              <Card.Body className="text-center p-4">
                <h3 className="fw-bold text-dark mb-3">Live Chat</h3>
                <p className="text-muted" style={{ lineHeight: "1.8" }}>
                  Need immediate assistance? Chat with our support bot or a live agent.
                </p>
                <Button 
                  variant="success" 
                  className="mt-3 px-4 py-2 fw-semibold rounded-pill"
                  style={{ background: "linear-gradient(45deg, #28a745, #38d39f)", border: "none" }}
                  onClick={() => setShowChatbot(true)}
                >
                  Start Chat
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Additional Resources */}
        <Row className="text-center">
          <Col>
            <h2 className="fw-bold text-primary mb-4">Still Need Help?</h2>
            <p className="text-muted mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
              If you can't find the answers you need, feel free to reach out to our support team or check our detailed user guide.
            </p>
            <Button 
              as={Link} 
              to="/customer" 
              variant="outline-primary" 
              size="lg" 
              className="px-5 py-3 fw-semibold rounded-pill shadow-sm"
              style={{ borderColor: "#007bff", color: "#007bff" }}
            >
              Back to Booking
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Chatbot Modal */}
      <Modal show={showChatbot} onHide={() => setShowChatbot(false)} centered>
        <Modal.Header className="bg-dark text-white border-0" style={{ borderRadius: "15px 15px 0 0" }}>
          <Modal.Title className="fw-bold">Chat Support</Modal.Title>
          <Button variant="link" className="text-white" onClick={() => setShowChatbot(false)} style={{ textDecoration: "none" }}>
            ×
          </Button>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ background: "#f8f9fa", maxHeight: "400px", overflowY: "auto" }}>
          {chatResponses.map((chat, index) => (
            <div key={index} className={`mb-3 ${chat.sender === "You" ? "text-end" : "text-start"}`}>
              <span 
                className={`d-inline-block p-2 rounded ${chat.sender === "You" ? "bg-primary text-white" : "bg-light text-dark"}`}
                style={{ maxWidth: "70%", borderRadius: "10px" }}
              >
                <strong>{chat.sender}:</strong> {chat.message}
              </span>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="bg-light border-0" style={{ borderRadius: "0 0 15px 15px" }}>
          <Form className="w-100" onSubmit={handleChatSubmit}>
            <Row className="align-items-center">
              <Col xs={9}>
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="shadow-sm"
                  style={{ borderRadius: "10px" }}
                />
              </Col>
              <Col xs={3}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 rounded-pill"
                  style={{ background: "linear-gradient(45deg, #007bff, #00b4db)", border: "none" }}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Help;