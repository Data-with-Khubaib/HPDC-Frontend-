// src/lib/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hpdc_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh token on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('hpdc_refresh_token') : null;

      if (!refreshToken) {
        isRefreshing = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hpdc_access_token');
          localStorage.removeItem('hpdc_refresh_token');
          localStorage.removeItem('hpdc_user');
          if (!window.location.pathname.startsWith('/signin') && !window.location.pathname.startsWith('/signup') && window.location.pathname !== '/' && !window.location.pathname.startsWith('/verify-otp')) {
            window.location.href = '/signin';
          }
        }
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data.data || res.data;
        if (typeof window !== 'undefined') {
          localStorage.setItem('hpdc_access_token', accessToken);
          localStorage.setItem('hpdc_refresh_token', newRefreshToken);
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hpdc_access_token');
          localStorage.removeItem('hpdc_refresh_token');
          localStorage.removeItem('hpdc_user');
          if (!window.location.pathname.startsWith('/signin') && !window.location.pathname.startsWith('/signup') && window.location.pathname !== '/') {
            window.location.href = '/signin';
          }
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --- API SERVICES ---

export const authApi = {
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  resendOtp: (email) => api.post('/auth/resend-otp', { email }).then((res) => res.data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data).then((res) => res.data),
  refresh: (token) => api.post('/auth/refresh', { refresh_token: token }).then((res) => res.data),
  logout: (token) => api.post('/auth/logout', { refresh_token: token }).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
  changePassword: (data) => api.post('/auth/change-password', data).then((res) => res.data),
};

export const dashboardApi = {
  getMetrics: () => api.get('/api/dashboard/metrics').then((res) => res.data),
  getAdminMetrics: () => api.get('/api/dashboard/admin').then((res) => res.data),
  getCompanyMetrics: (companyId = 'me') => api.get(`/api/dashboard/company/${companyId}`).then((res) => res.data),
};

export const applicationApi = {
  submit: (data) => api.post('/api/applications', data).then((res) => res.data),
  submitFull: (data) => api.post('/api/applications', data).then((res) => res.data),
  getAll: (params) => api.get('/api/applications', { params }).then((res) => res.data),
  getById: (id) => api.get(`/api/applications/${id}`).then((res) => res.data),
  takeAction: (id, data) => api.post(`/api/applications/${id}/take-action`, data).then((res) => res.data),
  updateStatus: (id, data) => api.patch(`/api/applications/${id}/status`, data).then((res) => res.data),
  getDocuments: (id) => api.get(`/api/applications/${id}/documents`).then((res) => res.data),
};

export const certificateApi = {
  getAll: (params) => api.get('/api/certificates', { params }).then((res) => res.data),
  getById: (id) => api.get(`/api/certificates/${id}`).then((res) => res.data),
  getHtml: (id) => api.get(`/api/certificates/${id}/html`, { responseType: 'text' }).then((res) => res.data),
  getByApplication: (appId) => api.get(`/api/applications/${appId}/certificate`).then((res) => res.data),
  pay: (id) => api.post(`/api/certificates/${id}/pay`).then((res) => res.data),
  payByApp: (appId) => api.post(`/api/applications/${appId}/pay-certificate`).then((res) => res.data),
  suspend: (id) => api.patch(`/api/certificates/${id}/suspend`).then((res) => res.data),
};

export const commentApi = {
  getComments: (appId, params) => api.get(`/api/applications/${appId}/comments`, { params }).then((res) => res.data),
  postComment: (appId, text) => api.post(`/api/applications/${appId}/comments`, { comment_text: text }).then((res) => res.data),
  editComment: (appId, commentId, text) => api.put(`/api/applications/${appId}/comments/${commentId}`, { comment_text: text }).then((res) => res.data),
};

export const logApi = {
  getAll: (params) => api.get('/api/logs', { params }).then((res) => res.data),
};

export const certManagementApi = {
  getAll: (params) => api.get('/api/certificate-management', { params }).then((res) => res.data),
  getById: (id) => api.get(`/api/certificate-management/${id}`).then((res) => res.data),
  create: (data) => api.post('/api/certificate-management', data).then((res) => res.data),
  update: (id, data) => api.put(`/api/certificate-management/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/api/certificate-management/${id}`).then((res) => res.data),
  toggle: (id) => api.patch(`/api/certificate-management/${id}/toggle`).then((res) => res.data),
  getActiveTypes: () => api.get('/api/certificate-management/active').then((res) => res.data),
};

export const userApi = {
  getAll: (params) => api.get('/api/users', { params }).then((res) => res.data),
  update: (id, data) => api.put(`/api/users/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/api/users/${id}`).then((res) => res.data),
  create: (data) => api.post('/api/users', data).then((res) => res.data),
};

export const surveyApi = {
  getAll: () => api.get('/api/surveys').then((res) => res.data),
  getById: (id) => api.get(`/api/surveys/${id}`).then((res) => res.data),
  submitAnswers: (answers) => api.post('/api/surveys/answers', { answers }).then((res) => res.data),
  getByApplication: (appId) => api.get(`/api/surveys/answers/${appId}`).then((res) => res.data),
};

export const uploadApi = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export const publicApi = {
  getRegistry: (params) =>
    axios.get(`${API_BASE_URL}/public/registry`, { params }).then((res) => res.data),
  verifyCertificate: (query) =>
    axios.get(`${API_BASE_URL}/public/verify`, { params: { query } }).then((res) => res.data),
};



export default api;
