// import React from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const navigate = useNavigate();

//   const loginWithGoogle = (credentialResponse) => {
//     try {
      
//        const decoded =(credentialResponse.credential);
//       console.log("Google User:", decoded);

//       // Store user info
//       localStorage.setItem("user", JSON.stringify(decoded));

//       // Redirect
//       navigate("/citizen");
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Login with Google</h2>
//       <GoogleLogin
//         onSuccess={loginWithGoogle}
//         onError={() => alert("Login Failed")}
//       />
//     </div>
//   );
// }
