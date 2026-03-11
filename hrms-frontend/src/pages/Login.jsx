import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';
import { setAuthData } from '../services/auth';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const response = await adminLogin(form);
      const token =
        response.data?.token ||
        response.data?.access ||
        response.data?.data?.token ||
        response.data?.data?.access;
      const user = response.data?.user || response.data?.data?.user || { email: form.email, role: 'admin' };

      if (!token) {
        throw new Error('Missing token in login response.');
      }

      setAuthData({ token, user });
      navigate('/', { replace: true });
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
          <Stack direction="row" alignItems="center" spacing={1.2} mb={2.5}>
            <LockRoundedIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Admin Login
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to manage employees and attendance.
          </Typography>

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
