import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
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
  return (
   
    
    <GoogleOAuthProvider clientId="33616128040-u8k7243l9lsud6kg3mhjbu8tu11iaie3.apps.googleusercontent.com">
      <AuthProvider>
      <Router>
      <Navbar />
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="auth" element={<Auth/>}/>

           <Route path="/citizen/dashboard" element={<CitizenDashboard />} />

           {/* Unified Admin Control Panel */}
           <Route path="/admin" element={
             <ProtectedRoute allowedRoles={["local", "sector"]}>
               <AdminDashboard />
             </ProtectedRoute>
           }/>

           {/* Backward-compatible redirects to Admin */}
           <Route path="/local/dashboard" element={<Navigate to="/admin" replace />} />
           <Route path="/sectorlevel" element={<Navigate to="/admin" replace />} />
      </Routes>

      <Footer/>
      </Router>
      </AuthProvider>
      </GoogleOAuthProvider>

  );
}
