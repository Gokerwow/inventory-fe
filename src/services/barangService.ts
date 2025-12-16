import { BARANG_BELANJA } from "../Mock Data/data";
import { simulateApiCall } from "./utils";
import apiClient from "./api";
import { type APIStokUpdate, type BARANG_STOK, type PaginationResponse, type TIPE_BARANG_STOK } from "../constant/roles";

export const getBarangBelanja = async (id: number): Promise<TIPE_BARANG_STOK[]> => {
    console.log("SERVICE: Mengabil barang stok...");
    try {
        const response = await apiClient.get('/api/v1/stok/select', {
            params: {
                category_id: id
            }
        });
        const barangData = response.data.data as TIPE_BARANG_STOK[];
        return barangData;
    } catch (error) {
        console.error("Gagal mengambil barang stok:", error);
        throw new Error('Gagal mengambil barang stok.');
    }
};

export const getStokBarang = async (
    page: number = 1,
    perPage?: number,
    categoryId?: number,
    search?: string,
    year?: string
): Promise<PaginationResponse<BARANG_STOK[]>> => {
    console.log("SERVICE: Mengabil barang stok...");
    try {
        // Buat params untuk query string
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
        if (year) {
            params.year = year;
        }
        
        const response = await apiClient.get('/api/v1/stok', {
            params
        });
        const barangData = response.data.data as PaginationResponse<BARANG_STOK[]>;
        return barangData;
    } catch (error) {
        console.error("Gagal mengambil barang stok:", error);
        throw new Error('Gagal mengambil barang stok.');
    }
};

export const getDetailStokBarang = async (id: number): Promise<APIStokUpdate> => {
    console.log(`SERVICE: Mengambil detail stok barang dengan ID: ${id}...`);
    try {
        const response = await apiClient.get(`/api/v1/stok/${id}`);
        const detailData = response.data.data as APIStokUpdate;
        return detailData;
    } catch (error) {
        console.error(`Gagal mengambil detail stok barang dengan ID ${id}:`, error);
        throw new Error('Gagal mengambil detail stok barang.');
    }
}

export const updateBarangStok = async (formData: Partial<APIStokUpdate>, barangId: number): Promise<APIStokUpdate> => {
    console.log("SERVICE: Mengedit stok...", formData);
    try {
        const response = await apiClient.patch(`/api/v1/stok/${barangId}`, formData);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("❌ DETAIL ERROR VALIDASI (422):", error.response.data);
        }
        console.error("❌ Error mengedit stok:", error);
        throw error;
    }
};

export const updateBarangStatus = async (penerimaanId: number, detailId: number, isLayak: boolean) => {
    // Perhatikan payload di baris kedua: { is_layak: isLayak }
    const response = await apiClient.patch(
        `/api/v1/penerimaan/${penerimaanId}/barang/${detailId}/layak`, 
        { 
            is_layak: isLayak 
        }
    );
    return response.data;
};

/**
 * Mengambil daftar barang belanja untuk sebuah form (simulasi).
 * Digunakan di: src/pages/FormPenerimaan.tsx
 */
export const getBarangBelanjaByPenerimaanId = (id: number): Promise<TIPE_BARANG_STOK[]> => {
    console.log(`SERVICE: Mengambil barang belanja untuk penerimaan ID: ${id}...`);
    // Hanya simulasi, ambil 3 barang pertama
    return simulateApiCall(BARANG_BELANJA.slice(0, 3));
};

export const updateDetailBarangTerbayar = async (penerimaanId: number, detailBarangId: number) => {
    // Sesuaikan URL dengan route backend Anda
    const response = await apiClient.patch(`/api/v1/penerimaan/${penerimaanId}/barang/${detailBarangId}/paid`);
    return response.data;
};