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

/**
 * Mensimulasikan penambahan barang belanja ke form.
 * Digunakan di: src/pages/FormDataBarangBelanja.tsx
 */
export const addBarangBelanja = async (barang: Omit<TIPE_BARANG_STOK, 'id'>): Promise<TIPE_BARANG_STOK> => {
    console.log("SERVICE: Menambah barang belanja...", barang);
    const response = await apiClient.post('/api/v1/barang-belanja', barang);
    const newBarang: TIPE_BARANG_STOK = {
        id: Date.now(),
        ...barang
    };
    return simulateApiCall(newBarang);
};

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

export const updateBarangStatus = async (
    penerimaanId: number,
    detailId: number,
    quantityLayak: number // ✅ Diubah jadi number
) => {
    try {
        // ✅ Payload disesuaikan permintaan: { "quantity_layak": 10 }
        const payload = { quantity_layak: quantityLayak };

        const response = await apiClient.patch(
            `/api/v1/penerimaan/${penerimaanId}/barang/${detailId}/layak`,
            payload
        );
        return response.data;
    } catch (error) {
        console.error(`❌ Error updating status for item ${detailId}:`, error);
        throw error; 
    }
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