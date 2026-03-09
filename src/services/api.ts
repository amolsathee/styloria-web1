import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Backend running locally
});

// Automatically inject JWT token from localStorage if valid
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('styloria-jwt-token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
    forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
    resetPassword: (token: string, data: any) => api.post(`/auth/reset-password/${token}`, data),
};

export const userAPI = {
    getAllUsers: () => api.get('/users'),
    updateProfileImage: (id: string, profileImage: string) => api.put(`/users/${id}/profile-image`, { profileImage })
};

export const bookingAPI = {
    createBooking: (data: any) => api.post('/bookings', data),
    getAllBookings: () => api.get('/bookings'),
    getUserBookings: (params: { email?: string; phone?: string }) => api.get('/bookings/user', { params }),
    updateBookingStatus: (id: string, status: string) => api.patch(`/bookings/${id}/status`, { status })
};

export const adminAPI = {
    sendFeedbackEmail: (data: { to: string, subject: string, text: string }) => api.post('/admin/send-email', data)
};

export default api;
