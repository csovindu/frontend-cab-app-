import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, Button, } from "react-bootstrap";

function MyBookings() {
  const userId = localStorage.getItem("userId");
  const [bookingsList, setBookingsList] = useState([]);
  const [carDetails, setCarDetails] = useState({});

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/rental/all");
        if (!response.ok) throw new Error("Failed to fetch bookings");

        const data = await response.json();
        const userBookings = data.filter((booking) => booking.userid === userId);
        setBookingsList(userBookings);

        // Fetch car details
        const uniqueCarIds = [...new Set(userBookings.map((b) => b.carid))];
        const carData = {};
        await Promise.all(
          uniqueCarIds.map(async (carId) => {
            try {
              const carResponse = await fetch(`http://localhost:8080/cars/${carId}`);
              if (!carResponse.ok) throw new Error("Failed to fetch car data");
              const carInfo = await carResponse.json();
              carData[carId] = carInfo;
            } catch (error) {
              console.error(`Error fetching car details for carId ${carId}:`, error);
            }
          })
        );
        setCarDetails(carData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchUserBookings();
  }, [userId]);

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8080/rental/delete/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookingsList(bookingsList.filter((booking) => booking.id !== bookingId));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  return (
<>
          {/* Navigation Bar */}
          <Navbar bg="white" expand="lg" className="mb-4 shadow-lg border-b-2 border-gray-200 rounded-b-xl">
  <Container>
    <Navbar.Brand as={Link} to="/" className="text-blue-600 font-bold text-2xl flex items-center">
      🚗 Rent-A-Car
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarContent" />
    <Navbar.Collapse id="navbarContent">
      <Nav className="ms-auto flex items-center gap-5">
                <Nav.Link  as={Link} to="/customer" className="text-gray-700 hover:text-blue-600 transition font-medium">Reserve a Vehicle</Nav.Link>
                <Nav.Link as={Link} to="/ViewBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">My Reservations</Nav.Link>
                <Nav.Link as={Link} to="/UserActiveBookings" className="text-gray-700 hover:text-blue-600 transition font-medium">Active Rentals</Nav.Link>
                <Button as={Link} to="/" variant="outline-danger" className="rounded-full px-4 py-2 font-medium border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>



    
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Bookings</h2>
      {bookingsList.length > 0 ? (
        <div className="row">
          {bookingsList.map((booking) => {
            const car = carDetails[booking.carid];
            return (
              <div key={booking.id} className="col-md-4 mb-4">
                <div className="card shadow-sm">
                  {car && car.photo ? (
                    <img
                      src={car.photo.startsWith("data:image") ? car.photo : `data:image/jpeg;base64,${car.photo}`}
                      alt={car.model}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{ height: "200px" }}>
                      <span className="text-muted">No Image Available</span>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{car ? car.model : "Unknown Car"}</h5>
                    <p className="card-text"><strong>Location:</strong> {booking.location}</p>
                    <p className="card-text"><strong>Time:</strong> {booking.time}</p>
                    <p className="card-text">
                      <strong>Status:</strong>
                      <span className={booking.bookstatus === 0 ? "text-warning fw-bold" : "text-success fw-bold"}>
                        {booking.bookstatus === 0 ? " Pending" : " Confirmed"}
                      </span>
                    </p>
                    <p className="card-text"><strong>Total Fee:</strong> ${booking.totalfee.toFixed(2)}</p>
                    <p className="card-text">
                      <strong>Payment:</strong>
                      <span className={booking.paymentstatus === 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                        {booking.paymentstatus === 0 ? " Unpaid" : " Paid"}
                      </span>
                    </p>
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      className="btn btn-danger w-100"
                    >
                      Delete Booking
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted">No bookings found for your account.</p>
      )}
    </div>
    </>
  );
}

export default MyBookings;