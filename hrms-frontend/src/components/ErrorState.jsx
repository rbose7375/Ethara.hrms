import { Alert, Box, Button } from '@mui/material';

function ErrorState({ message = 'Something went wrong while fetching data.', onRetry }) {
  return (
    <Box sx={{ py: 4 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
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
