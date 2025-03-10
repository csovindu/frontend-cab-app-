import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from "./AuthPage";
import AdminHome from "./AdminHome";
import DriverHome from "./DriverHome";
import CustomerHomePage from "./CustomerHomePage";
import ManageBookings from "./ManageBookings";
import ManageCar from "./ManageCar";
import DriverInProgressBookings from "./DriverInProgressBookings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/driver" element={<DriverHome />} />
        <Route path="/customer" element={<CustomerHomePage />} /> 
        <Route path="/ManageBookings" element={<ManageBookings />} />
        <Route path="/DeleteDrivers" element={<DeleteDrivers />} />
        <Route path="/ManageCar" element={<ManageCar />} />
        <Route path="/DriverInProgressBookings" element={<DriverInProgressBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
