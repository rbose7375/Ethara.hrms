import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';

function AttendanceForm({ employees, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: dayjs().format('YYYY-MM-DD'),
    status: 'Present',
  });

  const canSubmit = useMemo(
    () => Boolean(formData.employee_id && formData.date && formData.status),
    [formData],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2.5, border: 1, borderColor: 'divider' }} elevation={0}>
      <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
        <FormControl fullWidth>
          <InputLabel id="employee-select-label">Employee</InputLabel>
          <Select
            labelId="employee-select-label"
            name="employee_id"
            label="Employee"
            value={formData.employee_id}
            onChange={handleChange}
          >
            {employees.map((employee) => (
              <MenuItem key={employee.id || employee.employee_id} value={employee.employee_id}>
                {employee.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          name="date"
          label="Date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            name="status"
            label="Status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ minWidth: 160 }}>
          <Button fullWidth type="submit" variant="contained" disabled={!canSubmit || isSubmitting}>
            Mark Attendance
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

export default AttendanceForm;
