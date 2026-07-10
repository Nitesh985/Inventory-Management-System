import axios from "axios";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  withCredentials: true,
});

const isAuthEndpoint = (url?: string) => Boolean(url && url.includes('/auth/'));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post('/auth/refresh');
      return api(originalRequest);
    } catch (refreshError) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
      }
      return Promise.reject(refreshError);
    }
  },
);

export default api