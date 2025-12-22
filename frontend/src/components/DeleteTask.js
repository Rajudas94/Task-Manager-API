import React, { useEffect, useState } from "react";

function DeleteTask() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://15.207.98.198:8000/tasks", {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        res.ok ? setTasks(data.tasks || []) : setMessage(data.message || "Failed to fetch tasks");
      } catch {
        setMessage("Error connecting to backend");
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://15.207.98.198:8000/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Task ${id} deleted successfully`);
        setTasks(tasks.filter((t) => t.id !== id));
      } else setMessage(data.message || "Failed to delete task");
    } catch {
      setMessage("Error deleting task");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "5px" }}>
      <h2 style={{ color: "#2c3e50", fontSize : "20px", }}><strong>🗑️ Delete Tasks</strong></h2>
      {message && <p>{message}</p>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "2px solid #75787cff",
                backgroundColor: "#f8faff",
                borderRadius: "15px",
                margin: "13px auto",
                padding: "12px",
                width: "70%",
                textAlign: "left",
              }}
            >
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  backgroundColor: "#d12c1aff",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop : "12px",
                }}
              >
              <strong>Delete</strong>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeleteTask;
