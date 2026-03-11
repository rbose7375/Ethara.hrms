import { useCallback, useEffect, useMemo, useState } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import DashboardCards from '../components/DashboardCards';
import AttendanceTable from '../components/AttendanceTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getEmployeeAttendance, getEmployees } from '../services/api';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [employeesRes, attendanceRes] = await Promise.all([getEmployees(), getEmployeeAttendance()]);
      const employeeList = Array.isArray(employeesRes.data) ? employeesRes.data : employeesRes.data.results || [];
      const attendanceList = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : attendanceRes.data.results || [];

      const employeesById = employeeList.reduce((acc, employee) => {
        acc[employee.employee_id] = employee.full_name;
        return acc;
      }, {});

      setEmployees(employeeList);
      setAttendance(
        attendanceList.map((record) => ({
          ...record,
          employee_name: record.employee_name || employeesById[record.employee_id] || 'Unknown Employee',
        })),
      );
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayRecords = attendance.filter((record) => record.date === today);

    return {
      totalEmployees: employees.length,
      presentToday: todayRecords.filter((record) => record.status === 'Present').length,
      absentToday: todayRecords.filter((record) => record.status === 'Absent').length,
    };
  }, [employees, attendance]);

  const recentRecords = useMemo(() => attendance.slice(0, 6), [attendance]);

  if (loading) return <LoadingState message="Preparing dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchOverview} />;

  return (
    <Stack spacing={2.5}>
      <DashboardCards stats={stats} />

      <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Recent Attendance Records
        </Typography>
        {recentRecords.length > 0 ? (
          <AttendanceTable records={recentRecords} />
        ) : (
          <EmptyState title="No recent attendance" description="Recent attendance updates will appear here." />
        )}
      </Paper>
    </Stack>
  );
}

export default Dashboard;
