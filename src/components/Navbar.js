import { Link } from "react-router-dom";
import './Navbar.css';

export default function Navbar({ role, admin }) {
  return (
    <nav className="navbar">
      <h1 className="logo">Umuganda</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>

        {role === 'citizen' && (
          <Link to="/citizen/dashboard">Citizen view</Link>
        )}

        {admin === 'admin' && (
          <Link to="/admin/dashboard">Local leader view</Link>
        )}

        {/* 🟢 Add link to sector dashboard */}
        <Link to="/sectorlevel">Sector view</Link>
      </div>
    </nav>
  );
}
