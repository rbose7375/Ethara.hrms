import { Alert, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getAttendance, getEmployees, markAttendance } from '../services/api';

const normalizeList = (data) => (Array.isArray(data) ? data : data?.results || data?.data || []);

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [employeesRes, recordsRes] = await Promise.all([getEmployees(), getAttendance()]);
      const employeeList = normalizeList(employeesRes.data);
      const attendanceList = normalizeList(recordsRes.data);

      const employeeMap = employeeList.reduce((acc, item) => {
        acc[item.employee_id] = item.full_name;
        return acc;
      }, {});

      setEmployees(employeeList);
      setRecords(
        attendanceList.map((record) => ({
          ...record,
          employee_name: record.employee_name || employeeMap[record.employee_id] || 'Unknown Employee',
        })),
      );
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleMarkAttendance = async (payload) => {
    try {
      setSubmitting(true);
      await markAttendance(payload);
      setBanner('Attendance marked successfully.');
      fetchAttendance();
    } catch (err) {
      setBanner(err.response?.data?.detail || 'Unable to mark attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = useMemo(
    () => (dateFilter ? records.filter((record) => record.date === dateFilter) : records),
    [dateFilter, records],
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Attendance Management
      </Typography>

      {banner && (
        <Alert severity="info" onClose={() => setBanner('')}>
          {banner}
        </Alert>
      )}

      <AttendanceForm employees={employees} onSubmit={handleMarkAttendance} submitting={submitting} />

      <TextField
        label="Filter by date"
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ maxWidth: 260 }}
      />

      {loading && <LoadingState message="Loading attendance records..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchAttendance} />}
      {!loading && !error && filteredRecords.length === 0 && (
        <EmptyState title="No attendance records" description="Marked attendance records will show up here." />
      )}
      {!loading && !error && filteredRecords.length > 0 && <AttendanceTable records={filteredRecords} />}
    </Stack>
  );
}

export default Attendance;
