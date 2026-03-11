import { Alert, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { createEmployee, deleteEmployee, getEmployees } from '../services/api';

const normalizeList = (data) => (Array.isArray(data) ? data : data?.results || data?.data || []);

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getEmployees();
      setEmployees(normalizeList(response.data));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreate = async (payload) => {
    try {
      setSubmitting(true);
      await createEmployee(payload);
      setBanner('Employee added successfully.');
      fetchEmployees();
    } catch (err) {
      setBanner(err.response?.data?.detail || 'Unable to add employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setBanner('Employee removed successfully.');
      fetchEmployees();
    } catch (err) {
      setBanner(err.response?.data?.detail || 'Unable to delete employee.');
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Employee Management
      </Typography>

      {banner && (
        <Alert severity="info" onClose={() => setBanner('')}>
          {banner}
        </Alert>
      )}

      <EmployeeForm onSubmit={handleCreate} submitting={submitting} />

      {loading && <LoadingState message="Loading employees..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchEmployees} />}
      {!loading && !error && employees.length === 0 && (
        <EmptyState title="No employees yet" description="Create your first employee record to get started." />
      )}
      {!loading && !error && employees.length > 0 && <EmployeeTable employees={employees} onDelete={handleDelete} />}
    </Stack>
  );
}

export default Employees;
