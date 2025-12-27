import apiClient from '../utils/api';
import { type LogItem, type PaginationResponse } from '../constant/roles';

/**
 * Mengambil log aktivitas per halaman.
 * Sorting dilakukan di sisi Frontend (client-side) setelah data diterima.
 * * @param page - Nomor halaman (default: 1)
 * @param perPage - Jumlah item per halaman (default: 7 sesuai UI)
 */

export const getLogAktivitas = async (
    page: number = 1,
    perPage?: number,
    search?: number,
): Promise<PaginationResponse<LogItem>> => {
    console.log(`SERVICE: Mengambil log aktivitas page ${page}...`);

    try {
        const params: Record<string, number> = { page };
        if (perPage) {
            params.per_page = perPage;
        }
        if (search) {
            params.search = search;
        }

        const response = await apiClient.get('/api/v1/monitoring', { params });

        if (response.data && response.data.data) {
            console.log("Data log aktivitas diterima:", response.data.data);
            return response.data.data as PaginationResponse<LogItem>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
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