import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Employees from './pages/Employees';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import { getDefaultRouteForRole, isAuthenticated } from './services/auth';

function App() {
  const fallbackRoute = isAuthenticated() ? getDefaultRouteForRole() : '/login';

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/employee/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute role="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<Attendance />} />
      </Route>
      <Route
        path="/employee"
        element={
          <ProtectedRoute role="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={fallbackRoute} replace />} />
    </Routes>
  );
}

export default App;
