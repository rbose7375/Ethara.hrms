import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AttendanceTable from '../components/AttendanceTable';
import DashboardCards from '../components/DashboardCards';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getAttendance, getEmployees } from '../services/api';
import { normalizeAttendanceRecords, normalizeCollection } from '../utils/attendance';

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
      const employeeList = normalizeCollection(employeesRes.data);

      const employeeMap = employeeList.reduce((acc, item) => {
        acc[item.employee_id] = item.full_name;
        return acc;
      }, {});

      setEmployees(employeeList);
      setAttendance(normalizeAttendanceRecords(attendanceRes.data, employeeMap));
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
    const today = dayjs().format('YYYY-MM-DD');
    const todayRecords = attendance.filter((record) => record.date === today);

    return {
      totalEmployees: employees.length,
      presentToday: todayRecords.filter((record) => `${record.status}`.toLowerCase() === 'present').length,
      absentToday: todayRecords.filter((record) => `${record.status}`.toLowerCase() === 'absent').length,
    };
  }, [attendance, employees]);

  const recentAttendance = useMemo(
    () => [...attendance].sort((left, right) => `${right.date}`.localeCompare(`${left.date}`)).slice(0, 6),
    [attendance],
  );

  if (loading) return <LoadingState message="Loading dashboard overview..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboard} />;

  return (
    <Stack spacing={3}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', lg: 'center' }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} mb={1}>
                Operations Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track employees, monitor today&apos;s attendance, and keep the admin team aligned from one dashboard.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip icon={<CalendarTodayRoundedIcon />} label={dayjs().format('dddd, D MMMM YYYY')} variant="outlined" />
              <Chip icon={<InsightsRoundedIcon />} label={`${recentAttendance.length} recent attendance updates`} color="primary" variant="outlined" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <DashboardCards stats={stats} />

      {recentAttendance.length > 0 ? (
        <AttendanceTable records={recentAttendance} title="Recent Attendance Records" />
      ) : (
        <EmptyState
          title="No recent attendance"
          description="Recent attendance updates will appear here once records are added."
        />
      )}
    </Stack>
  );
}

export default Dashboard;
