import React, { useEffect, useState } from "react";

function ViewTasks() {
  
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    
    const fetchTasks = async () => {
      
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://15.207.98.198:8000/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) { setTasks(Array.isArray(data) ? data : data.tasks || []); } 
        else { setMessage(data.message || "Failed to fetch tasks");}
      } 
      
      catch (error) { setMessage("Error connecting to the backend"); }
    };

    fetchTasks();
  
  }, []);

  const markDone = async(taskId) => {

    try{
      const token = localStorage.getItem("token");

      const response = await fetch (`http://15.207.98.198:8000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify( {done : true} ),
      });

      const data = await response.json();

      if(response.ok){

        setTasks(tasks.map(task =>
          task.id === taskId ? {...task, done: true} : task
        ));  
      }  
      
      else { console.error(data.message || "Failed to mark task as done"); }
    }
    catch(error){ console.error("Error connecting to backend", error); }    
  };

  return (
    <div style = {styles.container}>
      <h2 style = {styles.heading}>🔍Your Tasks</h2>

      {message && <p style = {styles.message}>{message}</p>}

      {tasks.length === 0 ? (
        <p style = {styles.noTask}>No tasks found.</p>
      ) : (
        <div style={styles.taskContainer}>
          {tasks.map((task) => (
            <div key = {task.id} style = {styles.taskCard}>
              
              <p><strong>ID:</strong> {task.id} </p>
              <p><strong>Title:</strong> {task.title}</p>
              <p><strong>Description:</strong> {task.description}</p>

              { !task.done ? (
                <button
                  onClick = {() => markDone(task.id)}
                  style = {{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Mark as Done
                </button>
              ) : (
                <p style = {{color: "green", fontWeight: "bold"}}>✅ Completed</p>
              )}        
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  
  container: {
    textAlign: "center",
    marginTop: "40px",
    fontFamily: "Arial, sans-serif",
  },
  
  heading: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "20px",
  },
  
  message: {
    color: "red",
    fontWeight: "bold",
  },
  
  noTask: {
    color: "#777",
  },
  
  taskContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  
  taskCard: {
    backgroundColor: "#f0e580ff",
    border: "1px solid #f8e806ff",
    borderRadius: "8px",
    padding: "15px 20px",
    width: "280px",
    textAlign: "left",
    boxShadow: "0 2px 3px rgba(153, 228, 218, 1)",
  },
};

export default ViewTasks;
