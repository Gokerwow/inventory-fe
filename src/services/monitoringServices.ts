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