import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Home from "./pages/Home";
import SectorOfficials from "./pages/SectorDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import LocalLeaderDashboard from "./pages/LocalLeaderDashboard";
import Navbar from "./components/Navbar";
import Join from "./pages/Join";
import SelectRole from "./pages/SelectRole"; // 💡 added this line
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import Auth from "./Auth";
export default function App() {
  return (
  
    <GoogleOAuthProvider clientId="33616128040-u8k7243l9lsud6kg3mhjbu8tu11iaie3.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/join" element={<Join />} />
          
            <Route path="/signup" element={<Signup />} />
            <Route path="/select-role" element={<SelectRole />} /> {/* 💡 New Route */}
            <Route path="auth" element={<Auth/>}/>
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/local/dashboard" element={<LocalLeaderDashboard />} />
            <Route path="/sectorlevel" element={<SectorOfficials />} />
          </Routes>
          <Footer/>
        </Router>
      </AuthProvider>
      
    </GoogleOAuthProvider>

  );
}
