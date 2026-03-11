export const normalizeCollection = (data) => {
  if (Array.isArray(data)) return data;
  return data?.results || data?.data || data?.items || [];
};

const pickFirstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const parseTimeToSeconds = (value) => {
  if (!value) return null;

  const match = String(value).match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] || 0);

  if ([hours, minutes, seconds].some(Number.isNaN)) {
    return null;
  }

  return (hours * 60 * 60) + (minutes * 60) + seconds;
};

const parseHoursCandidate = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  const durationSeconds = parseTimeToSeconds(trimmed);
  if (durationSeconds === null) {
    return null;
  }

  return durationSeconds / 3600;
};

const extractLogs = (record) => {
  const logsSource = pickFirstDefined(
    record?.today_logs,
    record?.logs,
    record?.attendance_logs,
    record?.time_logs,
    record?.entries,
    record?.work_logs,
  );

  return normalizeCollection(logsSource).map((log) => ({
    ...log,
    time_in: pickFirstDefined(log?.time_in, log?.timeIn, log?.clock_in),
    time_out: pickFirstDefined(log?.time_out, log?.timeOut, log?.clock_out),
    duration_hours: pickFirstDefined(log?.duration_hours, log?.total_hours, log?.work_hours, log?.hours),
  }));
};

const computeHoursFromLogs = (logs) => {
  if (!Array.isArray(logs) || logs.length === 0) return null;

  const totalSeconds = logs.reduce((sum, log) => {
    const directHours = parseHoursCandidate(
      log?.duration_hours,
    );

    if (directHours !== null) {
      return sum + (directHours * 3600);
    }

    const timeInSeconds = parseTimeToSeconds(log?.time_in);
    const timeOutSeconds = parseTimeToSeconds(log?.time_out);

    if (timeInSeconds === null || timeOutSeconds === null || timeOutSeconds < timeInSeconds) {
      return sum;
    }

    return sum + (timeOutSeconds - timeInSeconds);
  }, 0);

  if (!totalSeconds) {
    return null;
  }

  return totalSeconds / 3600;
};

export const formatWorkingTime = (value) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'string' && !/^\d+(\.\d+)?$/.test(value.trim()) && parseTimeToSeconds(value) === null) {
    return value;
  }

  const hours = parseHoursCandidate(value);
  if (hours === null) {
    return '-';
  }

  const totalMinutes = Math.max(0, Math.round(hours * 60));
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (wholeHours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
};

export const normalizeAttendanceRecord = (record, employeeMap = {}) => {
  const employeeObject = typeof record?.employee === 'object' ? record.employee : null;
  const employeeId = pickFirstDefined(
    record?.employee_id,
    employeeObject?.employee_id,
    employeeObject?.id,
    typeof record?.employee === 'number' || typeof record?.employee === 'string' ? record.employee : undefined,
  );
  const logs = extractLogs(record);
  const directTotalValue = pickFirstDefined(
    record?.total_hours_today,
    record?.total_working_hours,
    record?.total_hours,
    record?.total_working_time,
    record?.total_time,
    record?.work_duration,
    record?.working_hours,
  );
  const computedTotalHours = directTotalValue !== undefined && directTotalValue !== null && directTotalValue !== ''
    ? parseHoursCandidate(directTotalValue)
    : computeHoursFromLogs(logs);
  const totalWorkingTime = directTotalValue && typeof directTotalValue === 'string' && parseHoursCandidate(directTotalValue) === null
    ? directTotalValue
    : formatWorkingTime(computedTotalHours);

  return {
    ...record,
    employee_id: employeeId,
    employee_name: pickFirstDefined(
      record?.employee_name,
      record?.full_name,
      record?.employee_full_name,
      employeeObject?.full_name,
      employeeObject?.name,
      employeeMap[employeeId],
      'Unknown Employee',
    ),
    date: pickFirstDefined(record?.date, record?.attendance_date, record?.work_date, record?.day, ''),
    status: pickFirstDefined(record?.status, record?.attendance_status, record?.state, 'Unknown'),
    logs,
    session_count: logs.length,
    total_working_hours: computedTotalHours,
    total_working_time: totalWorkingTime,
  };
};

export const normalizeAttendanceRecords = (data, employeeMap = {}) =>
  normalizeCollection(data).map((record) => normalizeAttendanceRecord(record, employeeMap));
