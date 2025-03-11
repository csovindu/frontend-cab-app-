import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Row, Col } from "react-bootstrap";
import "./App.css"; // Assuming you have some global styles

const About = () => {
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

      {/* About Page Content */}
      <Container className="py-5">
        {/* Header Section */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="display-4 fw-bold text-dark" style={{ letterSpacing: "1px" }}>
              About Rent-A-Car
            </h1>
            <p className="lead text-muted mt-3" style={{ maxWidth: "700px", margin: "0 auto" }}>
              Your trusted partner for seamless, affordable, and reliable cab booking services.
            </p>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <h2 className="fw-bold text-primary mb-3">Our Mission</h2>
            <p className="text-muted" style={{ lineHeight: "1.8" }}>
              At Rent-A-Car, we aim to revolutionize urban mobility by providing a hassle-free car rental experience. 
              Whether you need a ride for a quick trip or a long journey, we connect you with top-quality vehicles 
              and professional drivers at competitive prices.
            </p>
          </Col>
          <Col md={6}>
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
              alt="Mission"
              className="img-fluid rounded shadow"
              style={{ borderRadius: "15px" }}
            />
          </Col>
        </Row>

        {/* Values Section */}
        <Row className="mb-5">
          <Col md={4} className="text-center mb-4">
            <div className="p-4 shadow-sm rounded" style={{ background: "#f8f9fa", borderRadius: "15px" }}>
              <span className="display-5 text-primary">🚗</span>
              <h3 className="fw-semibold mt-3">Reliability</h3>
              <p className="text-muted">
                Count on us for punctual service and well-maintained vehicles every time.
              </p>
            </div>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="p-4 shadow-sm rounded" style={{ background: "#f8f9fa", borderRadius: "15px" }}>
              <span className="display-5 text-primary">💰</span>
              <h3 className="fw-semibold mt-3">Affordability</h3>
              <p className="text-muted">
                Enjoy premium services at prices that won't break the bank.
              </p>
            </div>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="p-4 shadow-sm rounded" style={{ background: "#f8f9fa", borderRadius: "15px" }}>
              <span className="display-5 text-primary">🌟</span>
              <h3 className="fw-semibold mt-3">Quality</h3>
              <p className="text-muted">
                Experience top-notch service with our dedicated team and modern fleet.
              </p>
            </div>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold text-primary mb-4">Our Team</h2>
            <p className="text-muted" style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
              Rent-A-Car was founded by a group of passionate individuals committed to making transportation 
              accessible and enjoyable. Our team of experienced drivers, customer support staff, and tech 
              experts work together to ensure your journey is smooth from start to finish.
            </p>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="text-center">
          <Col>
            <h3 className="fw-bold text-dark mb-4">Ready to Ride?</h3>
            <Button 
              as={Link} 
              to="/customer" 
              variant="primary" 
              size="lg" 
              className="px-5 py-3 fw-semibold rounded-pill shadow-sm"
              style={{ background: "linear-gradient(45deg, #007bff, #00b4db)", border: "none" }}
            >
              Book Your Car Now
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;