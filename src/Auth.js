import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "./context/AuthContext";

export default function Auth() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (user) {
      // Redirect to dashboard based on role
      if (user.role === "citizen") navigate("/citizen/dashboard");
      else if (user.role === "local") navigate("/local/dashboard");
      else if (user.role === "sector") navigate("/sectorlevel");
      else navigate("/");
    }
  }, [user, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Sign up / Login with Google</h2>
      <p>Role: <strong>{role || "Not Selected"}</strong></p>
      <GoogleLogin
        onSuccess={credentialResponse => {
          loginWithGoogle(credentialResponse);
        }}
        onError={() => {
          alert("Login Failed. Try again.");
        }}
      />
    </div>
  );
}
