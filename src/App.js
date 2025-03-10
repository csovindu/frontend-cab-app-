import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from "./AuthPage";
import AdminHome from "./AdminHome";
import DriverHome from "./DriverHome";
import CustomerHomePage from "./CustomerHomePage";
import ManageBookings from "./ManageBookings";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/driver" element={<DriverHome />} />
        <Route path="/customer" element={<CustomerHomePage />} /> 
        <Route path="/ManageBookings" element={<ManageBookings />} />
        
      </Routes>
    </Router>
  );
}

export default App;
