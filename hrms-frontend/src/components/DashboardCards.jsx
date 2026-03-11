import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

const cardConfig = [
  { key: 'totalEmployees', label: 'Total Employees', icon: <Groups2RoundedIcon color='primary' /> },
  { key: 'presentToday', label: 'Present Today', icon: <TaskAltRoundedIcon color='success' /> },
  { key: 'absentToday', label: 'Absent Today', icon: <HighlightOffRoundedIcon color='error' /> },
];

function DashboardCards({ stats }) {
  return (
    <Grid container spacing={3}>
      {cardConfig.map((item) => (
        <Grid key={item.key} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                {item.icon}
              </Stack>
              <Typography variant="h4" fontWeight={700}>
                {stats[item.key] ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardCards;
