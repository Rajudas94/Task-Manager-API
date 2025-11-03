import React, { useEffect, useState } from "react";

function DeleteTask() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all tasks on component load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setTasks(data.tasks || []);
        } else {
          setMessage(data.message || "Failed to fetch tasks");
        }
      } catch (error) {
        setMessage("Error connecting to backend");
      }
    };

    fetchTasks();
  }, []);

  // Function to delete a task
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Task ${id} deleted successfully`);
        setTasks(tasks.filter((task) => task.id !== id)); // instantly update UI
      } else {
        setMessage(data.message || "Failed to delete task");
      }
    } catch (error) {
      setMessage("Error deleting task");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Delete Tasks</h2>
      {message && <p>{message}</p>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                margin: "10px auto",
                padding: "10px",
                width: "60%",
              }}
            >
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeleteTask;
