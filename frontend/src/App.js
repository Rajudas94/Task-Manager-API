import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateTask from "./components/CreateTask";
import ViewTasks from "./components/ViewTasks";
import UpdateTask from "./components/UpdateTask";
import DeleteTask from "./components/DeleteTask";

function AppContent() {
  const location = useLocation();

  // Hide navigation when inside the dashboard or task pages
  const hideNav =
    location.pathname === "/dashboard" ||
    location.pathname === "/create" ||
    location.pathname === "/tasks" ||
    location.pathname === "/update" ||
    location.pathname === "/delete";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-center">
      {!hideNav && (
        <>
          <h1 className="text-4xl font-bold text-blue-700 mb-6 drop-shadow-sm">
            📝Task Manager
          </h1>
          <nav className="flex space-x-5">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-400 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200"
            >
              Login
            </Link>
          </nav>
        </>
      )}

      <div className="w-full max-w-3xl mt-8">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateTask />} />
          <Route path="/tasks" element={<ViewTasks />} />
          <Route path="/update" element={<UpdateTask />} />
          <Route path="/delete" element={<DeleteTask />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
