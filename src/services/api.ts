// file: src/api.js

import axios from 'axios';

// 1. Buat instance Axios. 
// Biarkan kosong agar menggunakan path relatif (yang akan ditangkap proxy)
const apiClient = axios.create();

// 2. Gunakan "Interceptor" untuk otomatis menambahkan token
apiClient.interceptors.request.use(
    (config) => {
        // 3. Ambil token dari localStorage
        const token = localStorage.getItem('api_token');

        // 4. Jika token ada, tambahkan ke header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 5. Selalu minta respons JSON
        config.headers.Accept = 'application/json';

        return config; // Lanjutkan request
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Ekspor instance yang sudah dikonfigurasi
export default apiClient;