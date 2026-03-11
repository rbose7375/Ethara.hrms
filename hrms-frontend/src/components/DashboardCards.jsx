import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

const cardConfig = [
  {
    key: 'totalEmployees',
    label: 'Total Employees',
    helper: 'All active employee records',
    icon: <Groups2RoundedIcon color="primary" />,
  },
  {
    key: 'presentToday',
    label: 'Present Today',
    helper: 'Marked present for today',
    icon: <TaskAltRoundedIcon color="success" />,
  },
  {
    key: 'absentToday',
    label: 'Absent Today',
    helper: 'Marked absent for today',
    icon: <HighlightOffRoundedIcon color="error" />,
  },
];

function DashboardCards({ stats }) {
  return (
    <Grid container spacing={3} alignItems="stretch">
      {cardConfig.map((item) => (
        <Grid key={item.key} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)', flex: 1 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 156 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                {item.icon}
              </Stack>
              <Typography variant="h4" fontWeight={700}>
                {stats[item.key] ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.helper}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardCards;
