import apiClient from './api';
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
export const getChartBarangMasuk = async () => {
    console.log("SERVICE: mengambil Chart masuk Dashboard...");
    try {
        const response = await apiClient.get(`api/v1/pelaporan/penerimaan-per-bulan`)
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
export const getChartBarangKeluar = async () => {
    console.log("SERVICE: mengambil Chart keluar Dashboard...");
    try {
        const response = await apiClient.get(`api/v1/pelaporan/pengeluaran-per-bulan`)
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error mengambil Chart keluar Dashboard:", error);
        throw error;
    }
};