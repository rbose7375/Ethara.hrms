import { Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function AttendanceTable({ records, title = 'Attendance Records' }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          {title}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id || `${record.employee_id}-${record.date}`} hover>
                  <TableCell>{record.employee_name || record.full_name || record.employee_id}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={record.status === 'Present' ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default AttendanceTable;
