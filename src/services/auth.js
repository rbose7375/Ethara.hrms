const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const ROLE_KEY = 'role';

const normalizeRole = (role, fallback = '') => {
  if (!role) return fallback;
  return String(role).toLowerCase();
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getRole = () => {
  const storedRole = localStorage.getItem(ROLE_KEY);
  if (storedRole) {
    return normalizeRole(storedRole);
  }

  return normalizeRole(getUser()?.role);
};

export const getDefaultRouteForRole = (role = getRole()) => (normalizeRole(role) === 'employee' ? '/employee' : '/');

export const setAuthData = ({ token, user, role }) => {
  const normalizedRole = normalizeRole(role || user?.role, 'admin');
  const nextUser = {
    ...(user || {}),
    role: normalizedRole,
  };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  localStorage.setItem(ROLE_KEY, normalizedRole);
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const isAuthenticated = () => Boolean(getToken());
