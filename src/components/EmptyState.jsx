import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { Box, Typography } from '@mui/material';

function EmptyState({ title = 'No data found', description = 'Try adjusting filters or adding a new record.' }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 3,
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <InboxRoundedIcon color="disabled" sx={{ fontSize: 44, mb: 1 }} />
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}

export default EmptyState;
