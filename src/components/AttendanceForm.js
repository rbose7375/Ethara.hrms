import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Button, Card, CardContent, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';

const createInitialForm = () => ({
  employee: '',
  date: dayjs().format('YYYY-MM-DD'),
  status: 'Present',
  time_in: '',
  time_out: '',
});

function AttendanceForm({ employees, onSubmit, submitting }) {
  const [form, setForm] = useState(createInitialForm);

  const hasEmployees = useMemo(() => employees.length > 0, [employees]);
  const requiresTimeRange = form.status === 'Present';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      employee: form.employee,
      date: form.date,
      status: form.status,
    };

    if (requiresTimeRange) {
      payload.time_in = form.time_in;
      payload.time_out = form.time_out;
    }

    const isSuccess = await onSubmit(payload);
    if (isSuccess) {
      setForm(createInitialForm());
    }
  };

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2.5}>
          Add Attendance Entry
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                label="Employee"
                value={form.employee}
                onChange={(e) => setForm((prev) => ({ ...prev, employee: e.target.value }))}
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
            <Grid size={{ xs: 12, md: 3 }}>
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
            <Grid size={{ xs: 12, md: 2 }}>
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
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                type="time"
                label="Time In"
                value={form.time_in}
                onChange={(e) => setForm((prev) => ({ ...prev, time_in: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required={requiresTimeRange}
                disabled={!requiresTimeRange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                type="time"
                label="Time Out"
                value={form.time_out}
                onChange={(e) => setForm((prev) => ({ ...prev, time_out: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required={requiresTimeRange}
                disabled={!requiresTimeRange}
              />
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
