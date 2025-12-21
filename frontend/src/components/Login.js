import React , { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    

    const handleLogin = async (e) => {

        e.preventDefault();
        setMessage("");

        console.log("Login details :", {username, password});

        try{

           const response = await fetch("/api/login", {

            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify( {username, password} ), 

           });

           const data = await response.json();

           console.log("Backend response :", data);

           if(response.ok) { 
            
            setMessage("Login successful!!");
            localStorage.setItem("token" , data.access_token);
            navigate("/dashboard");

           }    // closing for if block 
           else { setMessage(data.message || "Invalid Credentials") };
        
        }   // closing for try block

        catch (error){ 
            
            setMessage("Error connecting to backend"); 
            console.error("Error :", error);
        }
    };   // closing for handle login variable    

    return (

        <div style = { {textAlign : "center", marginTop : "5px"} } >
            
            <h2> Login </h2>
            
            <form onSubmit = {handleLogin}>
                
                <input 
                    type = "text"
                    placeholder = "Username"
                    value = {username}
                    onChange = { (e) => setUsername(e.target.value) } 
                    style = { { padding : "10px", margin : "10px" } }
                    required
                />
                
                <br />

                <input 
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = { (e) => setPassword(e.target.value) }
                    style = { {padding : "10px", margin : "10px"} } 
                    required
                /> 

                <br />

                <button 
                    type = "submit"
                    style = { {
                        padding : "10px 20px",
                        backgroundColor : "#007bff",
                        color : "white",
                        border : "none",
                        borderRadius : "5px",
                        cursor : "pointer"
                    } } >
                    
                    Login

                </button>
            </form> 
            <p>{message}</p>
        </div>
    );                     
}

export default Login;
