import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import Auth from "./Auth";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!clientId) {
    // eslint-disable-next-line no-console
    console.error("Missing REACT_APP_GOOGLE_CLIENT_ID in environment.");
  }
  return (
    
    
    <GoogleOAuthProvider clientId={clientId || ""}>
      <AuthProvider>
      <Router>
      <Navbar />
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth" element={<Auth/>} />

            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />

            {/* Admin-only Control Panel */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }/>

            {/* Backward-compatible redirects to Citizen area */}
            <Route path="/local/dashboard" element={<Navigate to="/citizen/dashboard" replace />} />
            <Route path="/sectorlevel" element={<Navigate to="/citizen/dashboard" replace />} />
      </Routes>

      <Footer/>
      </Router>
      </AuthProvider>
      </GoogleOAuthProvider>

  );
}
