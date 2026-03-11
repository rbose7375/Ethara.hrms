import axios from 'axios';
import { clearAuthData, getToken } from './auth';

const api = axios.create({
  baseURL: '/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
    }
    return Promise.reject(error);
  },
);

export const adminLogin = (payload) => api.post('admin/login/', payload);
export const employeeLogin = (payload) => api.post('employee/login/', payload);

export const getEmployees = () => api.get('admin/employees/');
export const createEmployee = (payload) => api.post('admin/employees/', payload);
export const deleteEmployee = (id) => api.delete(`admin/employees/${id}/`);

export const getAttendance = (params = {}) => api.get('employee/attendance/', { params });
export const markAttendance = (payload) => api.post('employee/attendance/', payload);
export const employeeTimeIn = (payload) => api.post('employee/time-in/', payload);
export const employeeTimeOut = (payload) => api.post('employee/time-out/', payload);

export default api;
