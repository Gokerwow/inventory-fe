import { ROLES, type APIPemesanan, type APIPemesananBaru, type APIStokPemesanan, type PaginationResponse } from "../constant/roles";
import apiClient from "../utils/api";

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
    perPage?: number,
    search?: string,
    role?: string
): Promise<PaginationResponse<APIPemesanan>> => {
    console.log(`SERVICE: Mengambil daftar pemesanan halaman ${page}...`);

    try {
        const params: Record<string, number | string> = { page };
        if (perPage) {
            params.per_page = perPage;
        }
        if (search) {
            params.search = search;
        }

        let endpoint = '/api/v1/pemesanan'

        if (role === ROLES.INSTALASI) {
            endpoint = '/api/v1/pemesanan/status'
        }

        if (role === ROLES.ADMIN_GUDANG) {
            endpoint = '/api/v1/pemesanan/approved-pj'
        }

        const response = await apiClient.get(endpoint, { params });

        if (response.data && response.data.data) {
            console.log("Data pemesanan diterima:", response.data.data);
            return response.data.data as PaginationResponse<APIPemesanan>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data pemesanan:", error);
        throw new Error('Gagal mengambil data pemesanan.');
    }
};

// ✅ FUNGSI YANG SUDAH DIPERBAIKI
export const getDetailPemesanan = async (
    id: number,
    page: number = 1,
    perPage?: number,
    search?: string,
) => {
    console.log("SERVICE: Mengambil detail pemesanan...", id);
    try {
        // Build params object
        const params: Record<string, number | string> = { page };
        
        if (perPage) {
            params.per_page = perPage;
        }
        
        if (search) {
            params.search = search;
        }
        
        const response = await apiClient.get(`/api/v1/pemesanan/${id}`, { params });
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error mengambil detail pemesanan:", error);
        throw error;
    }
}


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