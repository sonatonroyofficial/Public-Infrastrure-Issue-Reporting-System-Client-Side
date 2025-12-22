import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
};

// Issue APIs
export const issueAPI = {
    createIssue: (data) => api.post('/issues', data),
    getAllIssues: (params) => api.get('/issues', { params }),
    getIssueById: (id) => api.get(`/issues/${id}`),
    assignIssue: (id, staffId) => api.put(`/issues/${id}/assign`, { staffId }), // Updated from PATCH to PUT
    rejectIssue: (id) => api.put(`/issues/${id}/reject`),
    updateStatus: (id, status, comment) => api.patch(`/issues/${id}/status`, { status, comment }),
    addComment: (id, comment) => api.post(`/issues/${id}/comments`, { comment }),
    deleteIssue: (id) => api.delete(`/issues/${id}`),
    upvoteIssue: (id) => api.put(`/issues/${id}/upvote`),
};

// User APIs
export const userAPI = {
    getAllUsers: (params) => api.get('/users', { params }),
    updateProfile: (data) => api.patch('/auth/profile', data),
    subscribe: (amount) => api.post('/payment/subscribe', { amount }),
    updateUser: (id, data) => api.patch(`/users/${id}`, data),
    blockUser: (id, isBlocked) => api.patch(`/users/${id}/block`, { isBlocked }),
    deleteUser: (id) => api.delete(`/users/${id}`),
    createStaff: (data) => api.post('/staff', data),
    getPayments: () => api.get('/payments'), // Adding this for Payments page
};

// Stats APIs
export const statsAPI = {
    getDashboardStats: () => api.get('/stats'),
};

export default api;
