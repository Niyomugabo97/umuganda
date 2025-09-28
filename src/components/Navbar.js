import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1 className="logo">
        <Link to="/" className="link">Umuganda</Link>
      </h1>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>
        {user ? (
          <>
            {user.role === "admin" ? (
              <Link to="/admin">Admin Panel</Link>
            ) : (
              <Link to="/citizen/dashboard">Citizen Info</Link>
            )}
          </>
        ) : (
          <Link to="/auth">Sign In</Link>
        )}

      
      </div>
    </nav>
  );
}
