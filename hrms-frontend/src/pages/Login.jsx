import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Alert, Box, Button, Card, CardContent, Chip, Link, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { adminLogin, employeeLogin } from '../services/api';
import { getDefaultRouteForRole, isAuthenticated, setAuthData } from '../services/auth';

function Login() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isEmployeeLogin = pathname === '/employee/login';

  const pageConfig = useMemo(
    () => ({
      title: isEmployeeLogin ? 'Employee Login' : 'Admin Login',
      description: isEmployeeLogin
        ? 'Sign in to view your attendance records and record your work day.'
        : 'Sign in to manage employees and attendance from the admin panel.',
      loginAction: isEmployeeLogin ? employeeLogin : adminLogin,
      defaultRole: isEmployeeLogin ? 'employee' : 'admin',
      alternatePath: isEmployeeLogin ? '/login' : '/employee/login',
      alternateLabel: isEmployeeLogin ? 'Need admin access?' : 'Are you an employee?',
      alternateCta: isEmployeeLogin ? 'Go to admin login' : 'Go to employee login',
      helperChip: isEmployeeLogin ? 'URL: /employee/login' : 'URL: /login',
      icon: isEmployeeLogin ? <PersonOutlineRoundedIcon color="primary" /> : <LockRoundedIcon color="primary" />,
    }),
    [isEmployeeLogin],
  );

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(getDefaultRouteForRole(), { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const response = await pageConfig.loginAction(form);
      const token =
        response.data?.token ||
        response.data?.access ||
        response.data?.data?.token ||
        response.data?.data?.access;
      const user =
        response.data?.user ||
        response.data?.data?.user ||
        response.data?.user_data ||
        response.data?.data?.user_data ||
        { email: form.email };
      const role =
        response.data?.role ||
        response.data?.data?.role ||
        response.data?.user?.role ||
        response.data?.data?.user?.role ||
        user?.role ||
        pageConfig.defaultRole;

      if (!token) {
        throw new Error('Missing token in login response.');
      }

      setAuthData({ token, user, role });
      navigate(getDefaultRouteForRole(role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        background: 'linear-gradient(120deg, #eef2ff 0%, #f8fafc 100%)',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 460, borderRadius: 4, boxShadow: '0 20px 60px rgba(15,23,42,0.12)' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5} mb={2.5}>
            <Stack direction="row" alignItems="center" spacing={1.2}>
              {pageConfig.icon}
              <Typography variant="h5" fontWeight={700}>
                {pageConfig.title}
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" mb={3}>
            {pageConfig.description}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mb={3}
          >
            <Typography variant="body2" color="text.secondary">
              {pageConfig.alternateLabel}
            </Typography>
            <Link component={RouterLink} to={pageConfig.alternatePath} underline="hover" sx={{ fontWeight: 600 }}>
              {pageConfig.alternateCta}
            </Link>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" disabled={submitting}>
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
