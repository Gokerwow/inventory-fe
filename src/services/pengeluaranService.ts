import type { APIPengeluaran, PaginationResponse } from "../constant/roles";
import apiClient from "./api";

export const getPengeluaranList = async (
    page: number = 1,
    perPage?: number,
    role?: string // ✅ 1. Tambahkan parameter role (optional)
): Promise<PaginationResponse<APIPengeluaran>> => {
    console.log(`SERVICE: Mengambil daftar penerimaan halaman ${page}... Role: ${role}`);

    try {
        // Buat params untuk query string
        const params: Record<string, number> = { page };
        if (perPage) {
            params.per_page = perPage;
        }

        const response = await apiClient.get('/api/v1/penerimaan', { params });

        if (response.data && response.data.data) {
            console.log("Data penerimaan diterima:", response.data.data);
            return response.data.data as PaginationResponse<PenerimaanItem>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data penerimaan:", error);
        throw new Error('Gagal mengambil data penerimaan.');
    }
};