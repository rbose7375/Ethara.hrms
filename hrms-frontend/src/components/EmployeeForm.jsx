import { useState } from 'react';
import { Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';

const initialForm = {
  employee_id: '',
  full_name: '',
  email: '',
  department: '',
};

function EmployeeForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialForm);
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2.5}>
          Add Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Employee ID" value={form.employee_id} onChange={handleChange('employee_id')} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Full Name" value={form.full_name} onChange={handleChange('full_name')} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Email" type="email" value={form.email} onChange={handleChange('email')} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Department" value={form.department} onChange={handleChange('department')} fullWidth required />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" mt={2.5}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Employee'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}

export default EmployeeForm;
