import React, { useState } from "react";

function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setMessage("");

        try {

          const res = await fetch("http://127.0.0.1:5000/register", {

            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify( {username, password} ),
          
        }); // await fetch block

        const data = await res.json();

        if(res.ok){ setMessage("Registration successful !!"); }

        else { setMessage( data.message || "Error registering user") };
        
        }   // try block closing

        catch (err) { setMessage("Server error. Try again later") }

    };   // handle submit closing
    
    return (

        <div style = {{ textAlign: "center", marginTop: "5px" }} >

            <h2>Register</h2>
            <form onSubmit = {handleSubmit}>
                
                <input
                    type = "text"
                    placeholder = "Username"
                    value = {username}
                    onChange = { (e) => setUsername(e.target.value) }
                    style = { { padding : "10px", margin : "10px" }}
                    required
                />
                <br/>

                <input 
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = { (e) => setPassword(e.target.value) }
                    style = { {padding : "10px", margin : "10px"} }
                    required   
                />
                <br/>
                
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

                    Register 

                </button>  

            </form>
            <p> {message} </p>       
        
        </div>
    );
}   // closing for register function

export default Register;
