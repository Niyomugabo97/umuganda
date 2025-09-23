import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import SectorOfficials from "./pages/SectorDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import LocalLeaderDashboard from "./pages/LocalLeaderDashboard";
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
  
           <Route path="/local/dashboard" element={
        <ProtectedRoute allowedRoles={["local"]}>
          <LocalLeaderDashboard />
        </ProtectedRoute>
        }/>

        <Route path="/sectorlevel" element={
        <ProtectedRoute allowedRoles={["sector"]}>
        <SectorOfficials />
        </ProtectedRoute>
       }/>
    </Routes>

      <Footer/>
  </Router>
    </AuthProvider>
      
    </GoogleOAuthProvider>

  );
}
