import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingState({ message = 'Loading data...' }) {
  return (
    <Box
      sx={{
        py: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}

export default LoadingState;
