import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import './Signup.css';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  const { data, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
   options: {
    emailRedirectTo: 'http://localhost:3000/login',
  },
});

if (signUpError) {
  setError(signUpError.message);
  return;
}

const userId = data?.user?.id;

if (!userId) {
  setError("Signup succeeded but user ID not found.");
  return;
}

const { error: insertError } = await supabase
  .from("Login_Signup")
  .insert([{ name, email, user_id: userId }]);

if (insertError) {
  setError("Failed to save user info.");
  return;
}


  setEmail("");
  setPassword("");
  setName("");
  setError("");

  navigate("/citizen/dashboard");
};





  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>

        <button type="submit">Signup</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
