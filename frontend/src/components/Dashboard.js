import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const handlePopState = () => {
      const t = localStorage.getItem("token");
      if (!t) navigate("/login", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  return (
    <div className = "flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-red-100 to-orange-400 text-gray-800 fixed top-0 left-0">
      <div className = "bg-white shadow-xl rounded-xl p-10 w-96 text-center">
        <h2 className = "text-2xl font-semibold text-blue-600 mb-2">
          Welcome to Task Manager
        </h2>
        <p className="text-sm text-gray-900 mb-6">Select an option below:</p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate("/create")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
          >
            ✏️Create Task
          </button>

          <button
            onClick={() => navigate("/tasks")}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
          >
            📄View Tasks
          </button>

          <button
            onClick={() => navigate("/update")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition"
          >
            📝Update Task
          </button>

          <button
            onClick={() => navigate("/delete")}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition"
          >
            🗑️Delete Task
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login", { replace: true });
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
