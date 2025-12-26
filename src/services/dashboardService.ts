import apiClient from '../utils/api';
/**
 * Mengambil data statistik untuk card di dashboard.
 */

export const getDashboardStats = async () => {
    console.log("SERVICE: mengambil data Dashboard...");
    try {
        const response = await apiClient.get(`api/v1/pelaporan/dashboard`)
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error mengambil data Dashboard:", error);
        throw error;
    }
}

/**
 * Mengambil data chart barang masuk.
 */
export const getChartBarangMasuk = async (year?: number) => {
    console.log("SERVICE: mengambil Chart masuk Dashboard...");
    try {
        const params: Record<string, number | string> = {};
        if (year !== undefined) {
            params.year = year;
        }
        const response = await apiClient.get(`api/v1/pelaporan/penerimaan-per-bulan`, {params})
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error mengambil Chart masuk Dashboard:", error);
        throw error;
    }
};

/**
 * Mengambil data chart barang keluar.
 */
export const getChartBarangKeluar = async (year?: number) => {
    console.log("SERVICE: mengambil Chart keluar Dashboard...");
    try {
        const params: Record<string, number | string> = {};
        if (year !== undefined) {
            params.year = year;
        }
        const response = await apiClient.get(`api/v1/pelaporan/pengeluaran-per-bulan`, {params})
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error mengambil Chart keluar Dashboard:", error);
        throw error;
    }
};