import React, {useState} from "react";

function CreateTask() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {

    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if(!token)
    {
      setMessage("Please Log in First.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/tasks", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${token}`,
        },
        body: JSON.stringify( {title, description} ),
      });

      const data = await response.json();

      if(response.ok){
        setMessage("Task created successfully!!");
        setTitle("");
        setDescription("");
      }
      else { setMessage(data.message || "Failed to create task"); }
    }
    catch(error) { setMessage("Error connecting to backend"); }
  };
  
  return (
    <div style = {{ textAlign: "center", marginTop: "40px" }}>
      <h2>Create Task </h2>
      <form onSubmit = {handleCreate}>
        
        <input
          type = "text"
          placeholder = "Task Title"
          value = {title}
          onChange = { (e) => setTitle(e.target.value) }
          style = { { padding : "10px", margin : "10px" } }
          required 
        />

        <br />
        <textarea
          placeholder = "Task Description"
          value = {description}
          onChange = { (e) => setDescription(e.target.value) }
          style = {{padding : "10px", margin : "10px", width : "250px", height : "100px" }}
          required
        ></textarea>
        <br />
        <button
          type = "submit"
          style = {{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        > 
        Create Task
        
        </button>   
      </form> 
      <p>{message}</p>
    </div>
  );
}

export default CreateTask;


         






