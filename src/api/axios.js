import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: false, // ❌ No cookies used now since we removed refresh tokens
});

// ✅ Request interceptor: attach token if available
api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

// ✅ Response interceptor: handle expired tokens (401)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const auth = useAuthStore();
    // If token is invalid/expired → logout & redirect to login
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      console.warn('Access token expired or invalid. Logging out...');
      auth.logout(); // Clears token + redirects to login
    }
    return Promise.reject(err);
  }
);

export default api;
