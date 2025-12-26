
import axios from 'axios';
import { debugLog } from './debugLogger';

const apiClient = axios.create({
    baseURL: 'http://localhost:8001', 
    withCredentials: true, 
    headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
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

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const loggingOut = sessionStorage.getItem('logging_out') === 'true';
        
        debugLog('API Interceptor: Error caught', {
            status: error.response?.status,
            loggingOut,
            url: error.config?.url
        });

        if (loggingOut) {
            debugLog('API Interceptor: Ignoring error - logout in progress');
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401) {
            debugLog('API Interceptor: 401 detected - triggering logout');
            
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            sessionStorage.setItem('logging_out', 'true');
            
            debugLog('API Interceptor: Redirecting to SSO logout');
            window.location.href = 'http://localhost:8000/logout';
        }

        return Promise.reject(error);
    }
);

export default apiClient;