import { Alert, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getAttendance, getEmployees, markAttendance } from '../services/api';
import { normalizeAttendanceRecords, normalizeCollection } from '../utils/attendance';

const formatApiMessage = (data, fallback) => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.error === 'string') return data.error;

  const messages = Object.entries(data).flatMap(([field, value]) => {
    const entries = Array.isArray(value) ? value : [value];
    return entries
      .filter(Boolean)
      .map((entry) => `${field.replace(/_/g, ' ')}: ${typeof entry === 'string' ? entry : JSON.stringify(entry)}`);
  });

  return messages[0] || fallback;
};

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(null);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [employeesRes, recordsRes] = await Promise.all([getEmployees(), getAttendance()]);
      const employeeList = normalizeCollection(employeesRes.data);

      const employeeMap = employeeList.reduce((acc, item) => {
        acc[item.employee_id] = item.full_name;
        return acc;
      }, {});

      setEmployees(employeeList);
      setRecords(normalizeAttendanceRecords(recordsRes.data, employeeMap));
    } catch (err) {
      setError(formatApiMessage(err.response?.data, 'Failed to fetch attendance records.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleCreateAttendance = async (payload) => {
    try {
      setSubmitting(true);
      await markAttendance(payload);
      setBanner({ message: 'Attendance saved successfully.', severity: 'success' });
      await fetchAttendance();
      return true;
    } catch (err) {
      setBanner({ message: formatApiMessage(err.response?.data, 'Unable to save attendance.'), severity: 'error' });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const matchesDate = !dateFilter || record.date === dateFilter;
        const matchesEmployee = !employeeFilter || `${record.employee_id}` === `${employeeFilter}`;
        return matchesDate && matchesEmployee;
      }),
    [dateFilter, employeeFilter, records],
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Attendance Management
      </Typography>

      {banner && (
        <Alert severity={banner.severity} onClose={() => setBanner(null)}>
          {banner.message}
        </Alert>
      )}

      <AttendanceForm employees={employees} onSubmit={handleCreateAttendance} submitting={submitting} />

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2.5}>
            Filter Attendance
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Filter by date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="Filter by employee"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                fullWidth
              >
                <MenuItem value="">All Employees</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id || employee.employee_id} value={employee.employee_id}>
                    {employee.full_name} ({employee.employee_id})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Matching Records"
                value={filteredRecords.length}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && <LoadingState message="Loading attendance records..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchAttendance} />}
      {!loading && !error && filteredRecords.length === 0 && (
        <EmptyState
          title="No attendance records"
          description={dateFilter || employeeFilter ? 'No records match the selected filters.' : 'Attendance records will show up here.'}
        />
      )}
      {!loading && !error && filteredRecords.length > 0 && <AttendanceTable records={filteredRecords} />}
    </Stack>
  );
}

export default Attendance;
