import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/' },
  { label: 'Employees', icon: <PeopleAltRoundedIcon />, path: '/employees' },
  { label: 'Attendance', icon: <EventAvailableRoundedIcon />, path: '/attendance' },
];

function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  const { pathname } = useLocation();

  const content = (
    <>
      <Toolbar sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <ApartmentRoundedIcon color="primary" />
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Ethara HRMS
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 2 }}>
        {navItems.map((item) => {
          const selected = pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              component={RouterLink}
              to={item.path}
              selected={selected}
              onClick={onClose}
              sx={{
                borderRadius: 2.5,
                mb: 0.8,
                minHeight: 46,
                '&.Mui-selected': {
                  bgcolor: 'rgba(79,70,229,0.12)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: selected ? 600 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: '#fff',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}

export default Sidebar;
