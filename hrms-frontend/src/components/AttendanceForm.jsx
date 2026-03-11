import { useMemo, useState } from 'react';
import { Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';

function AttendanceForm({ employees, onSubmit, submitting }) {
  const [form, setForm] = useState({ employee_id: '', date: '', status: 'Present' });

  const hasEmployees = useMemo(() => employees.length > 0, [employees]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm((prev) => ({ ...prev, employee_id: '', status: 'Present' }));
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2.5}>
          Mark Attendance
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="Employee"
                value={form.employee_id}
                onChange={(e) => setForm((prev) => ({ ...prev, employee_id: e.target.value }))}
                fullWidth
                required
                disabled={!hasEmployees}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id || employee.employee_id} value={employee.employee_id}>
                    {employee.full_name} ({employee.employee_id})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                type="date"
                label="Date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                fullWidth
                required
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-end" mt={2.5}>
            <Button type="submit" variant="contained" disabled={submitting || !hasEmployees}>
              {submitting ? 'Saving...' : 'Save Attendance'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}

export default AttendanceForm;
