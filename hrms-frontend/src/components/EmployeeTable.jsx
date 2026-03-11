import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

function EmployeeTable({
  employees,
  onDelete,
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  departmentOptions,
}) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          mb={2.5}
        >
          <div>
            <Typography variant="h6" fontWeight={700}>
              Employee Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search by employee ID, name, email, or filter by department.
            </Typography>
          </div>
          <Typography variant="body2" color="text.secondary">
            {employees.length} match{employees.length === 1 ? '' : 'es'}
          </Typography>
        </Stack>

        <Grid container spacing={2} mb={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              label="Search employees"
              placeholder="Search by ID, name, email, or department"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Department"
              value={departmentFilter}
              onChange={(event) => onDepartmentFilterChange(event.target.value)}
              fullWidth
            >
              <MenuItem value="">All Departments</MenuItem>
              {departmentOptions.map((department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow hover key={employee.id || employee.employee_id}>
                    <TableCell>{employee.employee_id}</TableCell>
                    <TableCell>{employee.full_name}</TableCell>
                    <TableCell>{employee.email_address || employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete Employee">
                        <IconButton color="error" onClick={() => onDelete(employee.id || employee.employee_id)}>
                          <DeleteOutlineRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" py={1}>
                      No employees match the current filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default EmployeeTable;
