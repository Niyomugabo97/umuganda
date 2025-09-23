// src/pages/Signup.js
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  
  // Local state for manual signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Handle normal form signup
  const handleSubmit = (e) => {
    e.preventDefault();

    // Store user info (later you’ll connect this with your backend)
    localStorage.setItem("user", JSON.stringify(formData));

    // Redirect to role selection
    navigate("/select-role");
  };

  // Handle Google Signup success
  const handleSignupSuccess = (credentialResponse) => {
    const decoded = credentialResponse.credential;

    localStorage.setItem("user", JSON.stringify(decoded));
    navigate("/select-role");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Signup</h2>

      {/* Manual Signup Form */}
      <form 
        onSubmit={handleSubmit} 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginBottom: "30px"
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ padding: "10px", width: "250px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={{ padding: "10px", width: "250px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          style={{ padding: "10px", width: "250px" }}
        />

        <button 
          type="submit" 
          style={{ padding: "10px 20px", marginTop: "10px" }}
        >
          Sign Up
        </button>
      </form>

      <h3>Or</h3>

      {/* Google Signup */}
      <GoogleLogin
        onSuccess={handleSignupSuccess}
        onError={() => console.log("Google Signup Failed")}
      />
    </div>
  );
}
