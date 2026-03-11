import { Box, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const drawerWidth = 280;

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: '#f6f8fc' }}>
      <Topbar drawerWidth={drawerWidth} onMenuClick={() => setMobileOpen(true)} />
      <Sidebar drawerWidth={drawerWidth} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ px: { xs: 2, md: 3, xl: 4 }, py: { xs: 2, md: 3, xl: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
