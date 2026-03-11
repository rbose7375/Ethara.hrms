import { Navigate } from 'react-router-dom';
import { getDefaultRouteForRole, getRole, isAuthenticated } from '../services/auth';

export default function ProtectedRoute({ children, role }) {
  if (!isAuthenticated()) {
    return <Navigate to={role === 'employee' ? '/employee/login' : '/login'} replace />;
  }

  const userRole = getRole();

  if (role && role !== userRole) {
    return <Navigate to={getDefaultRouteForRole(userRole)} replace />;
  }

  return children;
}
