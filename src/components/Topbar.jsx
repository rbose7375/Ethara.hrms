import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthData, getUser } from '../services/auth';
import TimeZoneSelector from './TimeZoneSelector';

const TITLE_BY_PATH = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/attendance': 'Attendance',
};

function Topbar({ drawerWidth, onMenuClick }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const title = TITLE_BY_PATH[pathname] || 'Admin Panel';
  const user = getUser();

  const handleLogout = () => {
    clearAuthData();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar
      elevation={0}
      color="inherit"
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 3 }, gap: 1.5, flexWrap: 'wrap' }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { lg: 'none' }, mr: 1 }}>
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back{user?.full_name ? `, ${user.full_name}` : ''}
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <TimeZoneSelector sx={{ minWidth: { xs: '100%', sm: 120 } }} />
          <Button variant="outlined" startIcon={<LogoutRoundedIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
