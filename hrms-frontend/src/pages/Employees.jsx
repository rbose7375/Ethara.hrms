import { Alert, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { createEmployee, deleteEmployee, getEmployees } from '../services/api';

const normalizeList = (data) => (Array.isArray(data) ? data : data?.results || data?.data || []);
const formatApiMessage = (data, fallback) => {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;

  const messages = Object.entries(data).flatMap(([field, value]) => {
    const entries = Array.isArray(value) ? value : [value];
    return entries
      .filter(Boolean)
      .map((entry) => `${field.replace(/_/g, ' ')}: ${typeof entry === 'string' ? entry : JSON.stringify(entry)}`);
  });

  return messages[0] || fallback;
};

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getEmployees();
      setEmployees(normalizeList(response.data));
    } catch (err) {
      setError(formatApiMessage(err.response?.data, 'Failed to fetch employees.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const departmentOptions = useMemo(
    () =>
      [...new Set(employees.map((employee) => employee.department).filter(Boolean))].sort((left, right) =>
        `${left}`.localeCompare(`${right}`),
      ),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          employee.employee_id,
          employee.full_name,
          employee.email_address,
          employee.email,
          employee.department,
        ]
          .filter(Boolean)
          .some((value) => `${value}`.toLowerCase().includes(normalizedSearch));

      return matchesDepartment && matchesSearch;
    });
  }, [departmentFilter, employees, searchTerm]);

  const handleCreate = async (payload) => {
    try {
      setSubmitting(true);
      await createEmployee(payload);
      setBanner({ message: 'Employee added successfully.', severity: 'success' });
      await fetchEmployees();
      return true;
    } catch (err) {
      setBanner({ message: formatApiMessage(err.response?.data, 'Unable to add employee.'), severity: 'error' });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setBanner({ message: 'Employee removed successfully.', severity: 'success' });
      await fetchEmployees();
    } catch (err) {
      setBanner({ message: formatApiMessage(err.response?.data, 'Unable to delete employee.'), severity: 'error' });
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Employee Management
      </Typography>

      {banner && (
        <Alert severity={banner.severity} onClose={() => setBanner(null)}>
          {banner.message}
        </Alert>
      )}

      <EmployeeForm onSubmit={handleCreate} submitting={submitting} />

      {loading && <LoadingState message="Loading employees..." />}
      {!loading && error && <ErrorState message={error} onRetry={fetchEmployees} />}
      {!loading && !error && employees.length === 0 && (
        <EmptyState title="No employees yet" description="Create your first employee record to get started." />
      )}
      {!loading && !error && employees.length > 0 && (
        <EmployeeTable
          employees={filteredEmployees}
          onDelete={handleDelete}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          departmentOptions={departmentOptions}
        />
      )}
    </Stack>
  );
}

export default Employees;
