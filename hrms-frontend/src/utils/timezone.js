const TIMEZONE_KEY = 'preferred_timezone';

export const TIMEZONE_OPTIONS = {
  UTC: { label: 'UTC', offsetMinutes: 0 },
  IST: { label: 'IST', offsetMinutes: 330 },
};

export const getStoredTimeZone = () => {
  const storedValue = localStorage.getItem(TIMEZONE_KEY);
  return TIMEZONE_OPTIONS[storedValue] ? storedValue : 'IST';
};

export const setStoredTimeZone = (value) => {
  if (!TIMEZONE_OPTIONS[value]) return;
  localStorage.setItem(TIMEZONE_KEY, value);
};

export const formatTimeLabel = (value, timeZone = 'IST') => {
  if (!value) return '';

  const [rawHours = '0', rawMinutes = '00'] = String(value).split(':');
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value;
  }

  const offsetMinutes = TIMEZONE_OPTIONS[timeZone]?.offsetMinutes ?? 0;
  const totalMinutes = (((hours * 60) + minutes + offsetMinutes) % 1440 + 1440) % 1440;
  const convertedHours = Math.floor(totalMinutes / 60);
  const convertedMinutes = totalMinutes % 60;
  const normalizedHours = convertedHours % 12 || 12;
  const suffix = convertedHours >= 12 ? 'PM' : 'AM';

  return `${normalizedHours}:${String(convertedMinutes).padStart(2, '0')} ${suffix} ${timeZone}`;
};
