import type { APIPemesanan, APIPemesananBaru, APIStokPemesanan, PaginationResponse } from "../constant/roles";
import apiClient from "./api";

export const getStokPemesanan = async (
    page: number = 1,
    perPage?: number,
    categoryId?: number,
    search?: string
): Promise<PaginationResponse<APIStokPemesanan>> => {
    console.log(`SERVICE: Mengambil daftar stok untuk pemesanan ${page}...`);

    try {
        const params: Record<string, number | string> = { page };
        if (perPage) {
            params.per_page = perPage;
        }
        if (categoryId) {
            params.category = categoryId;
        }
        if (search) {
            params.search = search;
        }

        const response = await apiClient.get('/api/v1/pemesanan/stok', { params });

        if (response.data && response.data.data) {
            console.log("Data stok untuk pemesanan:", response.data.data);
            return response.data.data as PaginationResponse<APIStokPemesanan>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data stok untuk pemesanan:", error);
        throw new Error('Gagal mengambil data stok untuk pemesanan.');
    }
};

export const getPemesananList = async (
    page: number = 1,
    perPage?: number
): Promise<PaginationResponse<APIPemesanan>> => {
    console.log(`SERVICE: Mengambil daftar riwayat pemesanan halaman ${page}...`);

    try {
        const params: Record<string, number> = { page };
        if (perPage) {
            params.per_page = perPage;
        }

        const response = await apiClient.get('/api/v1/pemesanan', { params });

        if (response.data && response.data.data) {
            console.log("Data riwayat penerimaan diterima:", response.data.data);
            return response.data.data as PaginationResponse<APIPemesanan>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data riwayat pemesanan:", error);
        throw new Error('Gagal mengambil data riwayat pemesanan.');
    }
};


export const createPemesanan = async (formData: APIPemesananBaru): Promise<APIPemesananBaru> => {
    console.log("SERVICE: Membuat pemesanan baru...", formData);
    try {
        const response = await apiClient.post('/api/v1/pemesanan', formData);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error membuat pemesanan:", error);
        throw error;
    }
};