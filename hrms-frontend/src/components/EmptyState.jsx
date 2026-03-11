import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

function EmptyState({ title = 'No data available', description = 'Please add new records to get started.' }) {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <InboxIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  );
}

export default EmptyState;
