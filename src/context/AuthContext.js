import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginWithGoogle = (credentialResponse) => {
    // decode token for user info
    const jwt_decode = require("jwt-decode");
    const decoded = jwt_decode(credentialResponse.credential);

    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded)); // optional persist
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
