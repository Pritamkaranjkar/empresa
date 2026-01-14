import { defineStore } from 'pinia';
import api from '../api/axios';
import router from '../router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('accessToken') || null,
    loading: false,
  }),

  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const res = await api.post('/auth/login', { email, password });
        this.user = res.data.user;
        this.token = res.data.accessToken;

        // ✅ Persist to localStorage
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('accessToken', this.token);

        // ✅ Set token for future API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        router.push(`/${this.user.role.toLowerCase()}/dashboard`);
      } catch (err) {
        console.error('Login failed:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(payload) {
      this.loading = true;
      try {
        const res = await api.post('/auth/register', payload);
        this.user = res.data.user;
        this.token = res.data.accessToken;

        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('accessToken', this.token);

        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        router.push(`/owner/dashboard`);
      } catch (err) {
        console.error('Registration failed:', err);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');

      // ✅ Remove Authorization header globally
      delete api.defaults.headers.common['Authorization'];

      router.push('/');
    },
  },
});
