import { Card, CardContent, Grid, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';

const cardItems = [
  { key: 'totalEmployees', label: 'Total Employees', icon: <PeopleOutlineIcon color="primary" /> },
  { key: 'presentToday', label: 'Present Today', icon: <TaskAltOutlinedIcon color="success" /> },
  { key: 'absentToday', label: 'Absent Today', icon: <EventBusyOutlinedIcon color="error" /> },
];

function DashboardCards({ stats }) {
  return (
    <Grid container spacing={2.5}>
      {cardItems.map((item) => (
        <Grid item xs={12} md={4} key={item.key}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                {item.label}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                {stats[item.key] ?? 0}
              </Typography>
              {item.icon}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardCards;
