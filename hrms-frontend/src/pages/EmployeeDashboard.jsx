import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { Alert, AppBar, Box, Button, Card, CardContent, Chip, Grid, Stack, Toolbar, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AttendanceTable from '../components/AttendanceTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import TimeZoneSelector from '../components/TimeZoneSelector';
import { useTimeZone } from '../contexts/TimeZoneContext';
import { employeeTimeIn, employeeTimeOut, getAttendance } from '../services/api';
import { clearAuthData, getUser } from '../services/auth';
import { normalizeAttendanceRecords } from '../utils/attendance';
import { formatTimeLabel } from '../utils/timezone';

const summaryCards = [
  { key: 'totalRecords', label: 'Attendance Records', icon: <TodayRoundedIcon color="primary" /> },
  { key: 'presentDays', label: 'Present Days', icon: <TaskAltRoundedIcon color="success" /> },
  { key: 'absentDays', label: 'Absent Days', icon: <AccessTimeRoundedIcon color="error" /> },
];

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const { timeZone } = useTimeZone();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAttendance();
      const list = normalizeAttendanceRecords(response.data).sort((left, right) => `${right.date}`.localeCompare(`${left.date}`));
      setRecords(list);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load your attendance records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/employee/login', { replace: true });
  };

  const handleTimeAction = async (action, successMessage, loadingKey) => {
    try {
      setActionLoading(loadingKey);
      setBanner('');
      await action();
      await fetchAttendance();
      setBanner(successMessage);
    } catch (err) {
      setBanner(err.response?.data?.detail || err.response?.data?.error || 'Unable to update your attendance right now.');
    } finally {
      setActionLoading('');
    }
  };

  const stats = useMemo(
    () => ({
      totalRecords: records.length,
      presentDays: records.filter((record) => `${record.status}`.toLowerCase() === 'present').length,
      absentDays: records.filter((record) => `${record.status}`.toLowerCase() === 'absent').length,
    }),
    [records],
  );

  const today = dayjs().format('YYYY-MM-DD');
  const todayRecord = useMemo(() => records.find((record) => record.date === today), [records, today]);
  const todayLogs = useMemo(() => {
    const logs = Array.isArray(todayRecord?.logs) ? [...todayRecord.logs] : [];
    return logs.sort((left, right) => `${right.time_in || ''}`.localeCompare(`${left.time_in || ''}`));
  }, [todayRecord]);
  const latestTodayLog = todayLogs[0] || null;
  const activeTodayLog = useMemo(
    () => todayLogs.find((log) => log?.time_in && !log?.time_out) || null,
    [todayLogs],
  );
  const canTimeIn = !activeTodayLog;
  const canTimeOut = Boolean(activeTodayLog);
  const mergedAction = canTimeOut
    ? {
        key: 'timeOut',
        label: 'Time Out',
        loadingLabel: 'Recording...',
        variant: 'outlined',
        icon: <AccessTimeRoundedIcon />,
        onClick: () => handleTimeAction(employeeTimeOut, 'Time out recorded successfully.', 'timeOut'),
      }
    : {
        key: 'timeIn',
        label: 'Time In',
        loadingLabel: 'Recording...',
        variant: 'contained',
        icon: <TimelapseRoundedIcon />,
        onClick: () => handleTimeAction(employeeTimeIn, 'Time in recorded successfully.', 'timeIn'),
      };
  const sessionChipLabel = activeTodayLog
    ? 'Time In is active'
    : todayLogs.length > 0
      ? 'Ready for next session'
      : 'No session started';
  const sessionChipColor = activeTodayLog ? 'warning' : todayLogs.length > 0 ? 'success' : 'primary';
  const sessionMessage = activeTodayLog
    ? `Active since ${formatTimeLabel(activeTodayLog.time_in, timeZone)}. Finish with Time Out before the next Time In.`
    : latestTodayLog?.time_out
      ? `Last session ended at ${formatTimeLabel(latestTodayLog.time_out, timeZone)}. You can start another Time In today.`
      : 'Use Time In to start your first session for today.';
  const lastRecordedTime = activeTodayLog?.time_in
    ? { label: 'Last Time In', value: activeTodayLog.time_in }
    : latestTodayLog?.time_out
      ? { label: 'Last Time Out', value: latestTodayLog.time_out }
      : latestTodayLog?.time_in
        ? { label: 'Last Time In', value: latestTodayLog.time_in }
        : null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f6f8fc' }}>
      <AppBar
        elevation={0}
        color="inherit"
        position="sticky"
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)' }}
      >
        <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 4 }, gap: 1.5, flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ flexGrow: 1 }}>
            <BadgeRoundedIcon color="primary" />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Employee Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.full_name || user?.email || 'Employee Access'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <TimeZoneSelector sx={{ minWidth: { xs: '100%', sm: 120 } }} />
            {!loading && !error && lastRecordedTime && (
              <Box sx={{ minWidth: { sm: 150 } }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  {lastRecordedTime.label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatTimeLabel(lastRecordedTime.value, timeZone)}
                </Typography>
              </Box>
            )}
            {!loading && !error && (
              <Button
                variant={mergedAction.variant}
                startIcon={mergedAction.icon}
                onClick={mergedAction.onClick}
                disabled={actionLoading !== ''}
                sx={{ minWidth: { sm: 140 } }}
              >
                {actionLoading === mergedAction.key ? mergedAction.loadingLabel : mergedAction.label}
              </Button>
            )}
            <Button variant="outlined" startIcon={<LogoutRoundedIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1240, mx: 'auto' }}>
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
                    Welcome back
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    Review your attendance and keep your daily time logs up to date.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={dayjs().format('dddd, D MMMM YYYY')} variant="outlined" />
                    <Chip
                      label={todayRecord ? `Today: ${todayRecord.status}` : 'Today: no record yet'}
                      color={todayRecord && `${todayRecord.status}`.toLowerCase() === 'present' ? 'success' : 'default'}
                      variant={todayRecord ? 'filled' : 'outlined'}
                    />
                  </Stack>
                </Box>

                <Box sx={{ width: { xs: '100%', lg: 'auto' }, minWidth: { lg: 240 } }}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Current session
                  </Typography>
                  <Chip
                    label={sessionChipLabel}
                    color={sessionChipColor}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {sessionMessage}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {banner && (
            <Alert severity="info" onClose={() => setBanner('')}>
              {banner}
            </Alert>
          )}

          {loading && <LoadingState message="Loading your attendance records..." />}
          {!loading && error && <ErrorState message={error} onRetry={fetchAttendance} />}

          {!loading && !error && (
            <Grid container spacing={3}>
              {summaryCards.map((item) => (
                <Grid key={item.key} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
                  <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)', flex: 1 }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 148 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        {item.icon}
                      </Stack>
                      <Typography variant="h4" fontWeight={700}>
                        {stats[item.key]}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {!loading && !error && records.length === 0 && (
            <EmptyState
              title="No attendance records yet"
              description="Your attendance updates will appear here after you start recording your work day."
            />
          )}

          {!loading && !error && records.length > 0 && <AttendanceTable records={records} title="Your Attendance History" />}
        </Stack>
      </Box>
    </Box>
  );
}

export default EmployeeDashboard;
