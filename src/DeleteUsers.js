import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const RemoveUsers = () => {
  const [userList, setUserList] = useState([]); // Stores all users with role 2 (Drivers)
  const [fetchError, setFetchError] = useState(""); // Stores any fetch error message

  // Fetch all users with role 2 (Drivers)
  const getUsers = () => {
    fetch("http://localhost:8080/users/all")
      .then((response) => response.json())
      .then((data) => setUserList(data.filter((user) => user.userrole === 2)))
      .catch(() => setFetchError("Failed to fetch users"));
  };

  useEffect(() => {
    getUsers(); // Fetch users when component mounts
  }, []);

  // Delete a user
  const deleteUser = (userId) => {
    const confirmDeletion = window.confirm("Are you sure you want to remove this user?");
    
    if (!confirmDeletion) return; // Stop if user cancels
  
    fetch(`http://localhost:8080/users/delete/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUserList(userList.filter((user) => user.id !== userId));
      })
      .catch(() => setFetchError("Failed to delete user"));
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200">
  <Container>
    <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-xl flex items-center">
      🚗 Rent-A-Car
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarContent" />
    <Navbar.Collapse id="navbarContent">
      <Nav className="ms-auto flex items-center gap-4">
        <Nav.Link as={Link} to="/AdminHome"className="text-gray-700 hover:text-blue-600 transition font-medium">Add Car</Nav.Link>
         <Nav.Link as={Link} to="/ManageCar"className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Cars</Nav.Link>
        <Nav.Link as={Link} to="/AddDriver" className="text-gray-700 hover:text-blue-600 transition font-medium">Add Driver</Nav.Link>
        <Nav.Link as={Link} to="/DeleteDrivers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Drivers</Nav.Link>
         <Nav.Link onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Users</Nav.Link>
        <Nav.Link as={Link} to="/ManageBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Bookings</Nav.Link>
        <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      <Container>
        <h1 className="mb-4">Manage Users</h1>

        {fetchError && <Alert variant="danger">{fetchError}</Alert>}

        {/* Users Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No users available.</td>
              </tr>
            ) : (
              userList.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phonenumber}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => deleteUser(user.id)}>Remove</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default RemoveUsers;
