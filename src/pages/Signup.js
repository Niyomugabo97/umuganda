// src/pages/Signup.js
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignupSuccess = (credentialResponse) => {
    const decoded = credentialResponse.credential;

    // Bika user info muri localStorage
    localStorage.setItem("user", JSON.stringify(decoded));

    // Onekaho aho user ajya guhitamo role
    navigate("/select-role");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Signup with Google</h2>
      <GoogleLogin
        onSuccess={handleSignupSuccess}
        onError={() => console.log("Google Signup Failed")}
      />
    </div>
  );
}
