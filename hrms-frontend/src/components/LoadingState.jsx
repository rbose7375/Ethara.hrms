import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingState({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        minHeight: 220,
        display: 'grid',
        placeItems: 'center',
        gap: 1.5,
        py: 6,
      }}
    >
      <CircularProgress size={28} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingState;
