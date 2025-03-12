import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Row, Col } from "react-bootstrap";
import { FaCar, FaBullseye, FaMoneyBillWave, FaStar } from "react-icons/fa";
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

const StyledCard = styled.div`
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(8px);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.3);
  }
`;

const StyledButton = styled(Button)`
  border-radius: 10px;
  padding: 12px 30px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
`;

const StyledImage = styled.img`
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const About = () => {
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
              About Rent-A-Car
            </h1>
            <p style={{ color: "#7f8c8d", maxWidth: "700px", margin: "0 auto" }}>
              Your trusted partner for seamless, affordable, and reliable cab booking services.
            </p>
          </Col>
        </Row>

        <Row className="align-items-center mb-5">
          <Col md={6}>
            <h2 style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "15px" }}>
              <FaBullseye className="me-2" /> Our Mission
            </h2>
            <p style={{ color: "#7f8c8d", lineHeight: "1.8" }}>
              At Rent-A-Car, we aim to revolutionize urban mobility by providing a hassle-free car rental experience. 
              Whether you need a ride for a quick trip or a long journey, we connect you with top-quality vehicles 
              and professional drivers at competitive prices.
            </p>
          </Col>
          <Col md={6}>
            <StyledImage 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
              alt="Mission"
              className="img-fluid"
            />
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={4} className="text-center mb-4">
            <StyledCard>
              <FaCar size={50} style={{ color: "#3498db", marginBottom: "15px" }} />
              <h3 style={{ color: "#2c3e50", fontWeight: "600" }}>Reliability</h3>
              <p style={{ color: "#7f8c8d" }}>
                Count on us for punctual service and well-maintained vehicles every time.
              </p>
            </StyledCard>
          </Col>
          <Col md={4} className="text-center mb-4">
            <StyledCard>
              <FaMoneyBillWave size={50} style={{ color: "#3498db", marginBottom: "15px" }} />
              <h3 style={{ color: "#2c3e50", fontWeight: "600" }}>Affordability</h3>
              <p style={{ color: "#7f8c8d" }}>
                Enjoy premium services at prices that won't break the bank.
              </p>
            </StyledCard>
          </Col>
          <Col md={4} className="text-center mb-4">
            <StyledCard>
              <FaStar size={50} style={{ color: "#3498db", marginBottom: "15px" }} />
              <h3 style={{ color: "#2c3e50", fontWeight: "600" }}>Quality</h3>
              <p style={{ color: "#7f8c8d" }}>
                Experience top-notch service with our dedicated team and modern fleet.
              </p>
            </StyledCard>
          </Col>
        </Row>

        <Row className="text-center mb-5">
          <Col>
            <h2 style={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "20px" }}>
              Our Team
            </h2>
            <p style={{ color: "#7f8c8d", maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
              Rent-A-Car was founded by a group of passionate individuals committed to making transportation 
              accessible and enjoyable. Our team of experienced drivers, customer support staff, and tech 
              experts work together to ensure your journey is smooth from start to finish.
            </p>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>

          </Col>
        </Row>
      </StyledContainer>
    </>
  );
};

export default About;