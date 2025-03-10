import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const RemoveDrivers = () => {
  const [driverList, setDriverList] = useState([]); // Stores drivers
  const [fetchError, setFetchError] = useState(null); // Stores fetch error
  const [deleteSuccess, setDeleteSuccess] = useState(null); // Stores success message

  // Fetch all drivers
  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const response = await fetch("http://localhost:8080/users/all");
      if (!response.ok) throw new Error("Failed to load drivers");
      const data = await response.json();
      setDriverList(data.filter(user => user.userrole === 1));
    } catch (err) {
      setFetchError("Failed to load drivers");
    }
  };

  // Delete a driver
  const deleteDriver = async (driverId) => {
    if (window.confirm("Are you sure you want to remove this driver?")) {
      try {
        const response = await fetch(`http://localhost:8080/users/delete/${driverId}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to remove driver");

        setDeleteSuccess("Driver removed successfully!");
        loadDrivers(); // Refresh the list after deletion
      } catch (error) {
        setFetchError(error.message);
      }
    }
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
        <Nav.Link onClick={(e) => e.preventDefault()} className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Drivers</Nav.Link>
        <Nav.Link as={Link} to="/DeleteUsers" className="text-gray-700 hover:text-blue-600 transition font-medium">Delete Users</Nav.Link>
        <Nav.Link as={Link} to="/ManageBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">Manage Bookings</Nav.Link>
        <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      <Container>
        <h1 className="mb-4">Manage Drivers</h1>

        {/* Display Messages */}
        {fetchError && <Alert variant="danger">{fetchError}</Alert>}
        {deleteSuccess && <Alert variant="success">{deleteSuccess}</Alert>}

        {/* Drivers Table */}
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
            {driverList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No drivers available.</td>
              </tr>
            ) : (
              driverList.map((driver, index) => (
                <tr key={driver.id}>
                  <td>{index + 1}</td>
                  <td>{driver.username}</td>
                  <td>{driver.email}</td>
                  <td>{driver.phonenumber}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => deleteDriver(driver.id)}>Remove</Button>
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

export default RemoveDrivers;
