import { createContext, useContext, useMemo, useState } from 'react';
import { getStoredTimeZone, setStoredTimeZone } from '../utils/timezone';

const TimeZoneContext = createContext(null);

export function TimeZoneProvider({ children }) {
  const [timeZone, setTimeZoneState] = useState(getStoredTimeZone);

  const setTimeZone = (value) => {
    setStoredTimeZone(value);
    setTimeZoneState(value);
  };

  const contextValue = useMemo(
    () => ({
      timeZone,
      setTimeZone,
    }),
    [timeZone],
  );

  return <TimeZoneContext.Provider value={contextValue}>{children}</TimeZoneContext.Provider>;
}

export function useTimeZone() {
  const context = useContext(TimeZoneContext);

  if (!context) {
    throw new Error('useTimeZone must be used within a TimeZoneProvider.');
  }

  return context;
}
