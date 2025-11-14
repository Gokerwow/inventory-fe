import { logAktivitas } from '../Mock Data/data';
import { simulateApiCall } from './utils';

type LogItem = typeof logAktivitas[0];

/**
 * Mengambil semua log aktivitas pengguna.
 * Digunakan di: src/pages/monitoring.tsx
 */
export const getLogAktivitas = (): Promise<LogItem[]> => {
    console.log("SERVICE: Mengambil log aktivitas...");
    return simulateApiCall(logAktivitas);
};

// export const getLogAktivitas = async (): Promise<LogItem[]> => {
//     console.log("SERVICE: Mengambil log aktivitas...");
//     const response = await apiClient.get('/api/monitoring')
//     console.log("Data log aktivitas diterima:", response.data);
//     const logAktivitas = response.data as LogItem[];
//     return logAktivitas;
// };