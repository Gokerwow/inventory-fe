// file: src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8001', // Sesuaikan dengan URL backend Anda jika perlu
});

// 1. Interceptor Request (Kirim Token)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token'); // Pastikan key-nya sesuai ('token' atau 'api_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers.Accept = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Interceptor Response (Tangani Error Global)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Cek jika error adalah 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.warn('Sesi habis atau tidak terotorisasi. Melakukan logout otomatis...');

            // A. Bersihkan LocalStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            
            // B. Redirect paksa ke halaman login atau trigger logout SSO
            // Kita gunakan window.location agar aplikasi refresh penuh dan membersihkan State React
            
            // Opsi 1: Redirect ke Endpoint Logout SSO (Paling Bersih)
            window.location.href = 'http://localhost:8001/api/sso/logout';
            
            // Opsi 2: Redirect ke halaman Login lokal (jika ingin user klik login lagi)
            // window.location.href = '/login'; 
        }

        // Kembalikan error agar komponen spesifik masih bisa menanganinya jika perlu (opsional)
        return Promise.reject(error);
    }
);

export default apiClient;