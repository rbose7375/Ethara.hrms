import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Alert, Box, Button } from '@mui/material';

function ErrorState({ message = 'Unable to fetch data.', onRetry }) {
  return (
    <Box sx={{ py: 2 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" startIcon={<RefreshRoundedIcon />} onClick={onRetry}>
              Retry
            </Button>
          ) : null
        }
      >
        {message}
      </Alert>
    </Box>
  );
}

export default ErrorState;
