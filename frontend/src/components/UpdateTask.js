import React, { useEffect, useState } from "react";

function UpdateTask() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch all tasks on page load
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
        if (response.ok) setTasks(data.tasks || []);
        else setMessage(data.message || "Failed to fetch tasks");
      } catch (error) {
        setMessage("Error connecting to backend");
      }
    };

    fetchTasks();
  }, []);

  // Handle input changes for selected task
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask({ ...selectedTask, [name]: value });
  };

  // Handle task update
  const handleUpdate = async () => {
    if (!selectedTask) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:5000/tasks/${selectedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: selectedTask.title,
            description: selectedTask.description,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Task updated successfully!");
        setTasks(
          tasks.map((task) =>
            task.id === selectedTask.id ? selectedTask : task
          )
        );
      } else {
        setMessage(data.message || "Failed to update task");
      }
    } catch (error) {
      setMessage("Error updating task");
    }
  };

  return (
    <div style={{ display: "flex", gap: "30px", margin: "40px" }}>
      {/* Left side - Task list */}
      <div style={{ flex: 1 }}>
        <h2>Tasks</h2>
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
                  margin: "10px 0",
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedTask?.id === task.id ? "#e3f2fd" : "white",
                }}
                onClick={() => setSelectedTask(task)}
              >
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <small>ID: {task.id}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right side - Update form */}
      <div style={{ flex: 1 }}>
        <h2>Update Task</h2>
        {selectedTask ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              width: "90%",
              margin: "auto",
            }}
          >
            <label style={{ marginTop: "10px" }}>ID:</label>
            <input
              type="text"
              value={selectedTask.id}
              readOnly
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <label style={{ marginTop: "10px" }}>Title:</label>
            <input
              type="text"
              name="title"
              value={selectedTask.title}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <label style={{ marginTop: "10px" }}>Description:</label>
            <textarea
              name="description"
              value={selectedTask.description}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "15px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleUpdate}
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                alignSelf: "flex-end",
              }}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <p>Select a task from the left to update it.</p>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default UpdateTask;
