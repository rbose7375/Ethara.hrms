import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { getEmployeeAttendance, getEmployees, markAttendance } from '../services/api';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');

  const fetchData = useCallback(async () => {
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

      const normalizedRecords = attendanceList.map((item) => ({
        ...item,
        employee_name: item.employee_name || employeesById[item.employee_id] || 'Unknown Employee',
      }));

      setEmployees(employeeList);
      setRecords(normalizedRecords);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRecords = useMemo(() => {
    if (!dateFilter) return records;
    return records.filter((record) => record.date === dateFilter);
  }, [records, dateFilter]);

  const handleMarkAttendance = async (payload) => {
    try {
      setSubmitting(true);
      await markAttendance(payload);
      setBanner('Attendance marked successfully.');
      await fetchData();
    } catch (err) {
      setBanner(err.response?.data?.detail || 'Unable to mark attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5" fontWeight={700}>
        Attendance Management
      </Typography>

      {banner && <Alert onClose={() => setBanner('')}>{banner}</Alert>}

      <AttendanceForm employees={employees} onSubmit={handleMarkAttendance} isSubmitting={submitting} />

      <TextField
        label="Filter by date"
        type="date"
        value={dateFilter}
        onChange={(event) => setDateFilter(event.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ maxWidth: 260 }}
      />

      {loading && <LoadingState message="Loading attendance data..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchData} />}
      {!loading && !error && filteredRecords.length === 0 && (
        <EmptyState title="No attendance records" description="Attendance records will appear here once marked." />
      )}
      {!loading && !error && filteredRecords.length > 0 && <AttendanceTable records={filteredRecords} />}
    </Stack>
  );
}

export default Attendance;
