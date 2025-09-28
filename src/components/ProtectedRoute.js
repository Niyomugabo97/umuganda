import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  // Not authenticated -> go to auth
  if (!user) return <Navigate to="/auth" replace />;

  // If roles are specified, enforce them
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
