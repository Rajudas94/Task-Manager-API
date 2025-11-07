import React, { useEffect, useState } from "react";

function UpdateTask() {
  
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://task-manager-b4it.onrender.com/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) setTasks(data.tasks || []);
        else setMessage(data.message || "Failed to fetch tasks");
      } 
      
      catch (error) { setMessage("Error connecting to backend"); }
    };

    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask({ ...selectedTask, [name]: value });
  };

  const handleUpdate = async () => {
    if (!selectedTask) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://task-manager-b4it.onrender.com/tasks/${selectedTask.id}`,
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
    <div style={{ display: "flex", gap: "30px", margin: "5px",}}>
      {/* Left Side - Task List */}
      <div style={{ flex: 1 }}>
        
        <h2 className = "text-2xl font-semibold text-gray-800 text-center mb-6">
          📋Your Task/s.
        </h2>

        {tasks.length === 0 ? (
          <p style={{ textAlign: "center" }}>No tasks found.</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                onClick={() => setSelectedTask(task)}
                style={{
                  border: "1px solid #a1c4fd",
                  borderRadius: "6px",
                  margin: "10px 0",
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor:
                    selectedTask?.id === task.id ? "#e8f0fe" : "#f9fbff",
                  cursor: "pointer",
                }}
              >
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <small>ID : {task.id}</small>
              
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Side - Update Form */}
      <div style={{ flex: 1 }}>
        <h2 className = "text-2xl font-semibold text-gray-800 text-center mb-6" >
          📝Update Task.
        </h2>

        {selectedTask ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f5f9ff",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #a1c4fd",
              width: "90%",
              margin: "auto",
            }}
          >
            <label>ID:</label>
            <input
              type="text"
              value={selectedTask.id}
              readOnly
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #a1c4fd",
              }}
            />

            <label>Title:</label>
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
                border: "1px solid #a1c4fd",
              }}
            />

            <label>Description:</label>
            <textarea
              name="description"
              value={selectedTask.description}
              onChange={handleChange}
              style={{
                width: "100%",
                marginBottom: "15px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #a1c4fd",
                height: "100px",
                resize: "none",
              }}
            />

            <button
              onClick = {handleUpdate}
              style = {{
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <p style = {{ textAlign: "center", }}>
            Select a task from the left to update it.
          </p>
        )}

        {message && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default UpdateTask;
