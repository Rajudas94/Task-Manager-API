import React, {useEffect, useState} from "react";

function ViewTasks() {

  const[tasks, setTasks] = useState([]);
  const[message, setMessage] = useState("");

  useEffect (() => {

    const fetchTasks = async () => {

      try {
        const token = localStorage.getItem("token");

        const response = await fetch ("http://127.0.0.1:5000/tasks", {

          method : "GET",
          headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`,
          },
        });
        
        const data = await response.json();

        if (response.ok) { setTasks(Array.isArray(data) ? data : data.tasks || []); }

        else setMessage(data.message || "Failed to fetch tasks");
      }
      catch(error) { setMessage("Error connecting to the backend"); }
    };
  
  fetchTasks();
}, []);

return (

  <div style = {{ textAlign: "center", marginTop: "30px" }}>
    <h2> Your Tasks </h2>
    { message && <p>{message}</p> }

    {tasks.length === 0 ? (
      <p> No tasks found.</p>
    ) : ( 
      <ul style = {{ listStyleType : "none", padding : 0 }}>
        { tasks.map((task) => (
          <li
            key = {task.id}
            style = {{
              border: "1px solid #ddd",
              margin: "10px",
              padding: "10px",
              borderRadius: "5px",
              width: "60%",
              marginLeft: "auto",
              marginRight: "auto",
            }} >
          
            <p><strong>ID :</strong> {task.id} </p>
            <p><strong>Title : </strong> {task.title} </p>
            <p><strong>Description :</strong> {task.description} </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);
}

export default ViewTasks;
               




