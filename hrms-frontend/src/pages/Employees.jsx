import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { createEmployee, deleteEmployee, getEmployees } from '../services/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [banner, setBanner] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getEmployees();
      setEmployees(Array.isArray(data) ? data : data.results || []);
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
      setBanner('Employee created successfully.');
      setOpenForm(false);
      await fetchEmployees();
    } catch (err) {
      setBanner(err.response?.data?.detail || 'Unable to create employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      await deleteEmployee(id);
      setBanner('Employee deleted successfully.');
      await fetchEmployees();
    } catch (err) {
      setBanner(err.response?.data?.detail || 'Unable to delete employee.');
    }
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={700}>
          Employee Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          Add Employee
        </Button>
      </Stack>

      {banner && <Alert onClose={() => setBanner('')}>{banner}</Alert>}

      {loading && <LoadingState message="Loading employees..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchEmployees} />}
      {!loading && !error && employees.length === 0 && (
        <EmptyState title="No employees found" description="Add your first employee to start managing HR records." />
      )}
      {!loading && !error && employees.length > 0 && (
        <EmployeeTable employees={employees} onDelete={handleDelete} />
      )}

      <EmployeeForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreate}
        isSubmitting={submitting}
      />
    </Stack>
  );
}

export default Employees;
