import { simulateApiCall } from './utils';

// Data dari DiagramBatang.tsx (masuk)
const dataBarangMasuk = [
    { bulan: 'Januari', value: 40 },
    { bulan: 'Februari', value: 35 },
    { bulan: 'Maret', value: 50 },
    { bulan: 'April', value: 48 },
    { bulan: 'Mei', value: 60 },
    { bulan: 'Juni', value: 52 },
    { bulan: 'Juli', value: 65 },
    { bulan: 'Agustus', value: 55 },
    { bulan: 'September', value: 28 },
    { bulan: 'Oktober', value: 65 },
    { bulan: 'November', value: 38 },
    { bulan: 'Desember', value: 45 },
];

// Data dari DiagramBatang.tsx (keluar)
const dataBarangKeluar = [
    { bulan: 'Januari', value: 30 },
    { bulan: 'Februari', value: 28 },
    { bulan: 'Maret', value: 45 },
    { bulan: 'April', value: 40 },
    { bulan: 'Mei', value: 55 },
    { bulan: 'Juni', value: 47 },
    { bulan: 'Juli', value: 55 },
    { bulan: 'Agustus', value: 32 },
    { bulan: 'September', value: 48 },
    { bulan: 'Oktober', value: 42 },
    { bulan: 'November', value: 60 },
    { bulan: 'Desember', value: 95 },
];

// Data dari categoryBarChart.tsx
const dataStokKategori = [
    { kategori: 'Pembersih', 'Barang Masuk': 40, 'Barang Keluar': 60, 'Stok Tersedia': 90 },
    { kategori: 'Listrik', 'Barang Masuk': 50, 'Barang Keluar': 90, 'Stok Tersedia': 50 },
    { kategori: 'Kertas & Cover', 'Barang Masuk': 20, 'Barang Keluar': 30, 'Stok Tersedia': 50 },
];

/**
 * Mengambil data statistik untuk card di dashboard.
 */
export const getDashboardStats = () => {
    const stats = {
        totalStok: 1248,
        bastDiterima: 9,
        belumBayar: 20,
    };
    return simulateApiCall(stats);
};

/**
 * Mengambil data chart barang masuk.
 */
export const getChartBarangMasuk = () => {
    return simulateApiCall(dataBarangMasuk);
};

/**
 * Mengambil data chart barang keluar.
 */
export const getChartBarangKeluar = () => {
    return simulateApiCall(dataBarangKeluar);
};

/**
 * Mengambil data chart stok per kategori.
 */
export const getChartStokKategori = () => {
    return simulateApiCall(dataStokKategori);
};