import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Container, Card, Alert, Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px;
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
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(52, 152, 219, 0.2), transparent);
    border-radius: 50%;
    top: 10%;
    left: 10%;
    animation: float 6s infinite ease-in-out;
  }

  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(46, 204, 113, 0.2), transparent);
    border-radius: 50%;
    bottom: 15%;
    right: 15%;
    animation: float 8s infinite ease-in-out reverse;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;

const StyledCard = styled(Card)`
  width: 450px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .alert {
    animation: alertSlide 0.3s ease-in-out;
  }

  @keyframes alertSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .input-group-text {
    background: #f8f9fa;
    border-radius: 8px 0 0 8px;
  }

  .form-control {
    border-radius: 0 8px 8px 0;
    transition: all 0.3s ease;
  }

  .form-control:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

function AuthPage() {
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [contact, setContact] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [notification, setNotification] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/users/userlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.userid);
        switch (data.userrole) {
          case 0: navigate("/admin"); break;
          case 1: navigate("/driver"); break;
          case 2: navigate("/customer"); break;
          default: setNotification("Invalid user role.");
        }
      } else {
        setNotification("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setNotification("Unable to connect to the server.");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/users/userregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email: userEmail,
          phonenumber: contact,
          password: userPassword,
        }),
      });

      if (response.ok) {
        setNotification("Registration successful! Redirecting to login...");
        setTimeout(() => {
          setIsSignUp(false);
          setNotification("");
        }, 2000);
      } else {
        setNotification("Registration failed. Please try again.");
      }
    } catch (error) {
      setNotification("Server connection error.");
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer className="d-flex justify-content-center align-items-center">
      <BackgroundCircles />
      <StyledCard className="p-4">
        <Card.Body>
          <div className="text-center mb-4">
            <div className="logo mb-3" style={{ fontSize: "2.5rem", color: "#3498db" }}>
              🚀
            </div>
            <h3 className="fw-bold" style={{ 
              background: "linear-gradient(to right, #3498db, #2ecc71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-muted">
              {isSignUp ? "Start your journey with us" : "Login to your account"}
            </p>
          </div>

          {notification && (
            <Alert 
              variant={notification.includes("successful") ? "success" : "warning"}
              className="rounded-pill text-center py-2 alert"
            >
              {notification}
            </Alert>
          )}

          <Form onSubmit={isSignUp ? handleRegister : handleLogin}>
            {isSignUp && (
              <Form.Group className="mb-3 position-relative">
                <Form.Label className="fw-semibold">Full Name</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FaUser /></span>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-3 position-relative">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <div className="input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="shadow-sm"
                />
              </div>
            </Form.Group>

            {isSignUp && (
              <Form.Group className="mb-3 position-relative">
                <Form.Label className="fw-semibold">Phone Number</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FaPhone /></span>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="shadow-sm"
                  />
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-4 position-relative">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                  className="shadow-sm"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  className="border-0"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
            </Form.Group>

            <Button
              variant={isSignUp ? "primary" : "success"}
              type="submit"
              className="w-100 mb-3 position-relative"
              disabled={loading}
              style={{
                background: isSignUp 
                  ? "linear-gradient(to right, #3498db, #2980b9)" 
                  : "linear-gradient(to right, #2ecc71, #27ae60)",
                border: "none",
                padding: "12px",
                borderRadius: "8px"
              }}
            >
              {loading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : null}
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>

            <Button
              variant="link"
              className="w-100 text-decoration-none"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{ color: "#3498db" }}
            >
              {isSignUp ? (
                <span>Already have an account? <strong>Sign In</strong></span>
              ) : (
                <span>New here? <strong>Create Account</strong></span>
              )}
            </Button>
          </Form>
        </Card.Body>
      </StyledCard>
    </StyledContainer>
  );
}

export default AuthPage;