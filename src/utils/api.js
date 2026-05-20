import axios from 'axios';

// Konfigurasi dasar Axios untuk komunikasi ke Backend Laravel
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor untuk menyisipkan Token ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Atau ambil dari zustand store
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;