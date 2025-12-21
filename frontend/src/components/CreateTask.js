import React, { useState } from "react";

function CreateTask() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        
        body: JSON.stringify({ title, description }),
      
      });

      const data = await response.json();

      if (response.ok) {
        
        setMessage("✅ Task created successfully!");
        setTitle("");
        setDescription("");
      } 
      else { setMessage(data.message || "❌ Failed to create task"); }
    } 
    catch (error) { setMessage("⚠️ Error connecting to backend"); }
  };

  return (
    <div className = "flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-200 to-blue-500 text-gray-800 fixed top-0 left-0">
      <div className = "bg-white shadow-lg rounded-3xl p-8 w-full max-w-md">
        
        <h2 className = "text-2xl font-semibold text-gray-800 text-center mb-6">
          Create New Task
        </h2>

        <form onSubmit = {handleCreate} className = "space-y-4">
          <input
            type = "text"
            placeholder = "Task Title"
            value = {title}
            onChange = {(e) => setTitle(e.target.value)}
            className = "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />

          <textarea
            placeholder = "Task Description"
            value = {description}
            onChange = {(e) => setDescription(e.target.value)}
            className = "w-full border border-gray-300 rounded-lg px-4 py-2 h-28 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            required
          ></textarea>

          <button
            type = "submit"
            className = "w-full bg-orange-600 hover:bg-green-500 text-white font-medium py-2 rounded-lg transition-all"
          >
            Create Task
          </button>
        
        </form>

        {message && (
          <p
            className = {`mt-4 text-center font-medium ${
              message.includes("success")
                ? "text-green-600"
                : message.includes("Error")
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {message}
          </p>
        )}
      
      </div>
    
    </div>
  );
}

export default CreateTask;
