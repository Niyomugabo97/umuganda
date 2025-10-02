import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(localStorage.getItem("role") || "citizen");

  const navigate = useNavigate();
  const { user, loginWithGoogle, loginWithEmail, signupWithEmail, logout } = useAuth();

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const afterAuthRedirect = (u) => {
    if (!u) return;
    if (u.role === "admin") navigate("/admin");
    else navigate("/citizen/dashboard");
    setAuthOpen(false);
    setEmail("");
    setPassword("");
  };

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const u =
        mode === "login"
          ? await loginWithEmail(email, password)
          : await signupWithEmail(email, password);
      afterAuthRedirect(u);
    } catch (err) {
      alert(err?.message || "Authentication failed");
    }
  };

  return (
    <nav className="navbar">
      <h1 className="logo">
        <Link to="/" className="link">Umuganda</Link>
      </h1>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`} style={{ position: "relative" }}>
        <Link to="/">Home</Link>
        {/* Public access to citizen dashboard */}
        <Link to="/citizen/dashboard">Citizen Info</Link>
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setAuthOpen((v) => !v)}>Sign In</button>
            {authOpen && (
              <div className="auth-panel">
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <button
                    onClick={() => setMode("login")}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      border: "1px solid #ccc",
                      borderRadius: 6,
                      background: mode === "login" ? "#2c3e50" : "#fff",
                      color: mode === "login" ? "#fff" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setMode("signup")}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      border: "1px solid #ccc",
                      borderRadius: 6,
                      background: mode === "signup" ? "#2c3e50" : "#fff",
                      color: mode === "signup" ? "#fff" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    Signup
                  </button>
                </div>

                <label style={{ display: "block", marginBottom: 6 }}>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: "100%", marginBottom: 10 }}
                >
                  <option value="citizen">Citizen</option>
                  <option value="admin">Admin</option>
                </select>

                <form onSubmit={onEmailSubmit}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: 8 }}
                  />
                  <button type="submit" style={{ width: "100%", marginBottom: 8 }}>
                    {mode === "login" ? "Login" : "Create account"}
                  </button>
                </form>

                <div style={{ textAlign: "center", margin: "6px 0" }}>or</div>

                <div className="oauth">
                  <GoogleLogin
                    onSuccess={(cred) => {
                      try {
                        loginWithGoogle(cred);
                        // user state updates via context; read from localStorage for role
                        const stored = localStorage.getItem("user");
                        const parsed = stored ? JSON.parse(stored) : null;
                        afterAuthRedirect(parsed || { role: localStorage.getItem("role") || "unknown" });
                      } catch (e) {
                        alert("Google login failed");
                      }
                    }}
                    onError={() => alert("Google login failed")}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
