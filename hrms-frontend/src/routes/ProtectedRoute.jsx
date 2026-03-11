import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const userRole = getRole();

  if (role && role !== userRole) {
    return <Navigate to="/login" />;
  }

  return children;
}