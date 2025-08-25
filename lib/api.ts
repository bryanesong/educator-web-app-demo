import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login/',
  logout: '/auth/logout/',
  currentUser: '/auth/current-user/',
  
  // Students
  students: '/students/',
  studentDetail: (id: string) => `/students/${id}/`,
  studentConversations: (id: string) => `/students/${id}/conversations/`,
  studentAnalytics: (id: string) => `/students/${id}/analytics/`,
  
  // Attendance
  attendance: '/attendance/',
  checkIn: '/attendance/check-in/',
  checkOut: '/attendance/check-out/',
  
  // Analytics
  dashboardStats: '/analytics/dashboard/',
  moodTrends: '/analytics/mood-trends/',
  engagementMetrics: '/analytics/engagement/',
  
  // Assignments
  assignments: '/assignments/',
  assignmentDetail: (id: string) => `/assignments/${id}/`,
  
  // Reports
  generateReport: '/reports/generate/',
  exportData: '/reports/export/',
};