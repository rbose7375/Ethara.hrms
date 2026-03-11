import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import EmployeeDashboard from "./admin/EmployeeDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;