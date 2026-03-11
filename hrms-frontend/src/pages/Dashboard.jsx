import { useCallback, useEffect, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import AttendanceTable from '../components/AttendanceTable';
import DashboardCards from '../components/DashboardCards';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getAttendance, getEmployees } from '../services/api';

const normalizeList = (data) => (Array.isArray(data) ? data : data?.results || data?.data || []);

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [employeesRes, attendanceRes] = await Promise.all([getEmployees(), getAttendance()]);
      const employeeList = normalizeList(employeesRes.data);
      const attendanceList = normalizeList(attendanceRes.data);

      const employeeMap = employeeList.reduce((acc, item) => {
        acc[item.employee_id] = item.full_name;
        return acc;
      }, {});

      setEmployees(employeeList);
      setAttendance(
        attendanceList.map((record) => ({
          ...record,
          employee_name: record.employee_name || employeeMap[record.employee_id] || 'Unknown Employee',
        })),
      );
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayRecords = attendance.filter((record) => record.date === today);
    return {
      totalEmployees: employees.length,
      presentToday: todayRecords.filter((record) => record.status === 'Present').length,
      absentToday: todayRecords.filter((record) => record.status === 'Absent').length,
    };
  }, [attendance, employees]);

  const recentAttendance = useMemo(() => attendance.slice(0, 6), [attendance]);

  if (loading) return <LoadingState message="Loading dashboard overview..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />;

  return (
    <Stack spacing={3}>
      <DashboardCards stats={stats} />
      {recentAttendance.length > 0 ? (
        <AttendanceTable records={recentAttendance} title="Recent Attendance Records" />
      ) : (
        <EmptyState
          title="No recent attendance"
          description="Recent attendance updates will appear here once records are added."
        />
      )}
      <Typography variant="body2" color="text.secondary">
        Monitor employee attendance and trends from this centralized admin dashboard.
      </Typography>
    </Stack>
  );
}

export default Dashboard;
