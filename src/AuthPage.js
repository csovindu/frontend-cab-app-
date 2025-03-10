import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Container, Card, Alert } from "react-bootstrap";

function AuthPage() {
  const [name, setName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [contact, setContact] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  // Handle User Login
  const handleLogin = async (event) => {
    event.preventDefault();
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
          case 0:
            navigate("/admin");
            break;
          case 1:
            navigate("/driver");
            break;
          case 2:
            navigate("/customer");
            break;
          default:
            setNotification("Invalid user role.");
        }
      } else {
        setNotification("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setNotification("Unable to connect to the server.");
      console.error("Login Error:", error);
    }
  };

  // Handle User Registration
  const handleRegister = async (event) => {
    event.preventDefault();
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
        setTimeout(() => setIsSignUp(false), 2000);
      } else {
        setNotification("Registration failed. Please try again.");
      }
    } catch (error) {
      setNotification("Server connection error.");
      console.error("Registration Error:", error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-5 rounded" style={{ width: "450px" }}>
        <Card.Body>
          {notification && <Alert variant="warning">{notification}</Alert>}
          <h3 className="text-center mb-4">{isSignUp ? "Register" : "Login"}</h3>
          <Form onSubmit={isSignUp ? handleRegister : handleLogin}>
            {isSignUp && (
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </Form.Group>
            {isSignUp && (
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant={isSignUp ? "primary" : "success"} type="submit" className="w-100">
              {isSignUp ? "Register" : "Login"}
            </Button>
            <Button
              variant="link"
              className="w-100 mt-2 text-decoration-none"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Already have an account? Login" : "New user? Register here"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AuthPage;