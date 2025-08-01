import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ correct import for modern versions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginWithGoogle = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential); // ✅ correct function name

    const selectedRole = localStorage.getItem("role");

    const userWithRole = {
      ...decoded,
      role: selectedRole || "unknown",
    };

    setUser(userWithRole);
    localStorage.setItem("user", JSON.stringify(userWithRole));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
