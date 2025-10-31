import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h1>Task Manager</h1>
        <nav style = {{ marginBottom: "20px" }}>
          <Link to = "/register" style={{ marginRight: "10px" }}>Register</Link>
          <Link to = "/login">Login</Link>
        </nav>
        <Routes>
          <Route path = "/register" element = {<Register />} />
          <Route path = "/login" element = {<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
