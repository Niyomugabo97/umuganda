import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "./context/AuthContext";

export default function Auth() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/citizen/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="auth-container">
      <h2>Login / Sign Up</h2>
      <p>Use Google to continue</p>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          loginWithGoogle(credentialResponse);
        }}
        onError={() => {
          alert("Login Failed");
        }}
      />
    </div>
  );
}
