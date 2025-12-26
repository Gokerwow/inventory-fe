import { ROLES, type APIAlokasiPengeluaranPayload, type APIDetailStokBAST, type APIPatchQuantityPJ, type APIPengeluaranList, type PaginationResponse } from "../constant/roles";
import apiClient from "../utils/api";



export const confirmPemesanan = async (id: number, formData: APIPatchQuantityPJ) => {
    console.log("SERVICE: Mengkonfirmasi detail pemesanan...", id);
    try {
        const response = await apiClient.patch(`/api/v1/pemesanan/${id}/quantity-pj`, formData)
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error mengkonfirmasi pemesanan:", error);
        throw error;
    }

}

export const getPengeluaranList = async (
    page: number = 1,
    perPage?: number,
    search?: string,
    role?: string,
    startDate?: string,
    endDate?: string
): Promise<PaginationResponse<APIPengeluaranList>> => {
    console.log(`SERVICE: Mengambil daftar pengeluaran halaman ${page}...`);

    try {
        const params: Record<string, number | string> = { page };
        if (perPage) {
            params.per_page = perPage;
        }
        if (search) {
            params.search = search;
        }
        if (startDate) {
            params.start_date = startDate;
        }
        if (endDate) {
            params.end_date = endDate;
        }

        console.log(params)

        let endpoint = '/api/v1/pengeluaran'

        if (role === ROLES.PENANGGUNG_JAWAB) {
            endpoint = 'api/v1/pemesanan/riwayat-pj'
        }

        const response = await apiClient.get(endpoint, { params });

        if (response.data && response.data.data) {
            console.log("Data pengeluaran diterima:", response.data.data);
            return response.data.data as PaginationResponse<APIPengeluaranList>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data pengeluaran:", error);
        throw new Error('Gagal mengambil data pengeluaran.');
    }
};

export const alokasiPengeluaran = async (id: number, formData: APIAlokasiPengeluaranPayload) => {
    console.log("SERVICE: Mengalokasi pengeluaran...", id);
    try {
        const response = await apiClient.post(`/api/v1/pemesanan/${id}/alokasi-stok`, formData)
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error Mengalokasi pengeluaran:", error);
        throw error;
    }
}

export const exportPengeluaranExcel = async (
    startDate?: string,
    endDate?: string
) => {
    try {
        const params: Record<string, string> = {};
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;

        const response = await apiClient.get('/api/v1/pengeluaran/export/excel', {
            params,
            responseType: 'blob',
        });

        return response;
    } catch (error) {
        console.error("Gagal export excel:", error);
        throw error;
    }
};