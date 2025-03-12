import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Row, Col, Accordion, Card, Form, Modal } from "react-bootstrap";
import { FaCar, FaQuestionCircle, FaEnvelope, FaPhone, FaComment, FaPaperPlane } from "react-icons/fa";
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

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.3);
  }
`;

const StyledAccordion = styled(Accordion)`
  .accordion-item {
    border: none;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
    backdrop-filter: blur(8px);
    margin-bottom: 20px;
    overflow: hidden;
  }

  .accordion-header button {
    background: linear-gradient(45deg, #3498db, #2980b9);
    color: white;
    border: none;
    border-radius: 20px 20px 0 0;
    padding: 15px;
    font-weight: 600;
  }

  .accordion-body {
    padding: 20px;
    color: #7f8c8d;
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
    max-height: 400px;
    overflow-y: auto;
    background: #f8f9fa;
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

const ChatBubble = styled.div`
  display: inline-block;
  padding: 10px 15px;
  border-radius: 10px;
  max-width: 70%;
  margin-bottom: 15px;
  background: ${props => (props.isUser ? "linear-gradient(45deg, #3498db, #2980b9)" : "#ecf0f1")};
  color: ${props => (props.isUser ? "white" : "#2c3e50")};
`;

const Help = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponses, setChatResponses] = useState([
    { sender: "Bot", message: "Hello! How can I assist you today? Type 'book' to make a booking or ask a question." }
  ]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatResponses(prev => [...prev, { sender: "You", message: chatMessage }]);

    let botResponse = "I'm here to help! Could you please clarify your request?";
    if (chatMessage.toLowerCase().includes("book")) {
      botResponse = "To book a car, I'll need some details. Please provide: Pickup Location, Time (YYYY-MM-DDTHH:MM), and Distance (km). For example: 'Colombo, 2025-03-15T10:00, 20'";
    } else if (chatMessage.toLowerCase().includes("location") && chatMessage.toLowerCase().includes("time") && chatMessage.toLowerCase().includes("km")) {
      botResponse = "Great! I've submitted your booking request. Please check 'My Reservations' for confirmation.";
      // Add API call here if needed
    }

    setTimeout(() => {
      setChatResponses(prev => [...prev, { sender: "Bot", message: botResponse }]);
    }, 500);

    setChatMessage("");
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
        <Row className="text-center mb-5">
          <Col>
            <h1 style={{ 
              background: "linear-gradient(to right, #3498db, #2ecc71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              fontSize: "2.5rem"
            }}>
              Help Center
            </h1>
            <p style={{ color: "#7f8c8d", maxWidth: "700px", margin: "0 auto" }}>
              Find answers to your questions or get assistance with cab booking system services.
            </p>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col>
            <h2 style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "20px" }}>
              <FaQuestionCircle className="me-2" /> Frequently Asked Questions
            </h2>
            <StyledAccordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>How do I book a car?</Accordion.Header>
                <Accordion.Body>
                  To book a car, go to the "Reserve a Vehicle" page, browse available cars, select your preferred vehicle, 
                  and fill out the booking form with your pickup location, time, distance, and driver preference. 
                  Click "Confirm" to complete your booking. Or use our chatbot below!
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>How is the total fee calculated?</Accordion.Header>
                <Accordion.Body>
                  The total fee is calculated by multiplying the car's price per kilometer by the travel distance you 
                  enter in the booking form. The fee is displayed automatically before you confirm your booking.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Can I cancel a booking?</Accordion.Header>
                <Accordion.Body>
                  Yes, you can cancel a booking by navigating to "My Reservations," finding your booking, and selecting 
                  the cancel option. Note that cancellation policies may apply depending on the timing.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>What if I need help during my rental?</Accordion.Header>
                <Accordion.Body>
                  If you need assistance during your rental, check your "Active Rentals" page for driver contact details 
                  or reach out to our support team via email or chat below.
                </Accordion.Body>
              </Accordion.Item>
            </StyledAccordion>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={6} className="mb-4">
            <StyledCard>
              <Card.Body className="text-center p-4">
                <h3 style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "15px" }}>
                  <FaEnvelope className="me-2" /> Contact Us
                </h3>
                <p style={{ color: "#7f8c8d", lineHeight: "1.8" }}>
                  <strong>Email:</strong> ovndu.071@gmail.com <br />
                  <strong>Phone:</strong> +94 787471008 <br />
                </p>
                <StyledButton
                  href="mailto:ovndu.071@gmail.com?subject=Support Request from Rent-A-Car&body=Please describe your issue or question here."
                  variant="primary"
                  style={{ background: "linear-gradient(45deg, #3498db, #2980b9)", border: "none" }}
                >
                  Email Support
                </StyledButton>
              </Card.Body>
            </StyledCard>
          </Col>
          <Col md={6} className="mb-4">
            <StyledCard>
              <Card.Body className="text-center p-4">
                <h3 style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "15px" }}>
                  <FaComment className="me-2" /> Live Chat
                </h3>
                <p style={{ color: "#7f8c8d", lineHeight: "1.8" }}>
                  Need immediate assistance? Chat with our support bot or a live agent.
                </p>
                <StyledButton
                  variant="success"
                  onClick={() => setShowChatbot(true)}
                  style={{ background: "linear-gradient(45deg, #2ecc71, #27ae60)", border: "none" }}
                >
                  Start Chat
                </StyledButton>
              </Card.Body>
            </StyledCard>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
            <h2 style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "20px" }}>
              Still Need Help?
            </h2>
            <p style={{ color: "#7f8c8d", maxWidth: "600px", margin: "0 auto 20px" }}>
              If you can't find the answers you need, feel free to reach out to our support team or check our detailed user guide.
            </p>

          </Col>
        </Row>

        <StyledModal show={showChatbot} onHide={() => setShowChatbot(false)} centered>
          <Modal.Header>
            <Modal.Title>
              <FaComment className="me-2" /> Chat Support
            </Modal.Title>
            <Button variant="link" style={{ color: "white" }} onClick={() => setShowChatbot(false)}>
              ×
            </Button>
          </Modal.Header>
          <Modal.Body>
            {chatResponses.map((chat, index) => (
              <div key={index} className={`text-${chat.sender === "You" ? "end" : "start"}`}>
                <ChatBubble isUser={chat.sender === "You"}>
                  <strong>{chat.sender}:</strong> {chat.message}
                </ChatBubble>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Form className="w-100" onSubmit={handleChatSubmit}>
              <Row className="align-items-center">
                <Col xs={9}>
                  <StyledFormControl
                    type="text"
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                </Col>
                <Col xs={3}>
                  <StyledButton
                    type="submit"
                    variant="primary"
                    style={{ background: "linear-gradient(45deg, #3498db, #2980b9)", border: "none", width: "100%" }}
                  >
                    <FaPaperPlane />
                  </StyledButton>
                </Col>
              </Row>
            </Form>
          </Modal.Footer>
        </StyledModal>
      </StyledContainer>
    </>
  );
};

export default Help;