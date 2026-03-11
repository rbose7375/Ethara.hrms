import { MenuItem, TextField } from '@mui/material';
import { useTimeZone } from '../contexts/TimeZoneContext';
import { TIMEZONE_OPTIONS } from '../utils/timezone';

function TimeZoneSelector({ sx }) {
  const { timeZone, setTimeZone } = useTimeZone();

  return (
    <TextField
      select
      size="small"
      label="Time Zone"
      value={timeZone}
      onChange={(event) => setTimeZone(event.target.value)}
      sx={sx}
    >
      {Object.entries(TIMEZONE_OPTIONS).map(([value, option]) => (
        <MenuItem key={value} value={value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default TimeZoneSelector;
