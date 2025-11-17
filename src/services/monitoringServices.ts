import apiClient from './api';
import { type LogItem } from '../constant/roles';


/**
 * Mengambil semua log aktivitas pengguna.
 * Digunakan di: src/pages/monitoring.tsx
 */
export const getLogAktivitas = async (): Promise<LogItem[]> => {
    console.log("SERVICE: Mengambil log aktivitas...");
    try {
        const response = await apiClient.get('/api/v1/monitoring');
        console.log("Data log aktivitas diterima:", response.data.data.data);
        return response.data.data.data as LogItem[];
    } catch (error) {
        console.error("Gagal mengambil data log aktivitas:", error);
        throw new Error('Gagal mengambil data log aktivitas.');
    }
};

// export const getLogAktivitas = async (): Promise<LogItem[]> => {
//     console.log("SERVICE: Mengambil log aktivitas...");
//     const response = await apiClient.get('/api/monitoring')
//     console.log("Data log aktivitas diterima:", response.data);
//     const logAktivitas = response.data as LogItem[];
//     return logAktivitas;
// };