import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home"; // ✅ Import Home Page
import SectorOfficials from "./pages/SectorDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
function App() {
  const role = 'citizen'; // You can make this dynamic later
  const admin = 'admin';

  return (
    <>
    <AuthProvider>
      <Router>
        <Navbar role={role} admin={admin} />
        
        <Routes>
          {/*  Home Page */}
          <Route path="/" element={<Home />} />
          <Route path="/sectorlevel" element={<SectorOfficials/>}/>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Route */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Citizen Protected Route */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      
    </AuthProvider>
    <Footer/>
   </>
  );
}

export default App;
