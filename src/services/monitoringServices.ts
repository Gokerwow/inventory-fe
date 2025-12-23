import apiClient from './api';
import { type LogItem } from '../constant/roles';

/**
 * Mengambil log aktivitas per halaman.
 * Sorting dilakukan di sisi Frontend (client-side) setelah data diterima.
 * * @param page - Nomor halaman (default: 1)
 * @param perPage - Jumlah item per halaman (default: 7 sesuai UI)
 */
export const getLogAktivitas = async (
    page: number = 1,
    perPage?: number,
    search?: string
): Promise<{ data: LogItem[], total: number }> => {
    
    console.log(`SERVICE: Mengambil log aktivitas page ${page}...`);
    
    try {
        
        const params: Record<string, number | string> = { page };
        if (perPage) {
            params.per_page = perPage
        }
        if (search) {
            params.search = search
        }
        
        // Hanya mengirim parameter pagination, tanpa sort_by
        const response = await apiClient.get('/api/v1/monitoring', {params});

        // Mengambil data dari struktur response Laravel (Resource/Paginate)
        // response.data.data biasanya berisi object pagination (data, total, current_page, dll)
        const result = response.data.data;

        console.log("Data log aktivitas diterima:", result.data);

        return {
            data: result.data as LogItem[], // Data untuk halaman ini
            total: result.total || 0        // Total seluruh data (untuk menghitung jumlah halaman)
        };

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