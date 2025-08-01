import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const getRole = () => {
    if (!user) return null;
    if (user.role) return user.role;

    const email = user.email?.toLowerCase();
    if (email?.includes("citizen")) return "citizen";
    if (email?.includes("local")) return "local";
    if (email?.includes("sector")) return "sector";

    return "unknown";
  };

  const role = getRole();

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
            {role === "citizen" && <Link to="/citizen/dashboard">Citizen Info</Link>}
            {role === "local" && <Link to="/local/dashboard">Local-Leaders</Link>}
            {role === "sector" && <Link to="/sectorlevel">Sector Level</Link>}
            {/* Optional logout */}
            <button onClick={logout} style={{ marginLeft: "10px" }}>Logout</button>
          </>
        ) : (
          <Link to="/join">Signup/Login</Link>
        )}
      </div>
    </nav>
  );
}
