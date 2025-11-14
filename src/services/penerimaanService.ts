import {
    PenerimaanData,
    RiwayatPenerimaanData,
    BARANG_BELANJA,
    type TIPE_BARANG_BELANJA
} from '../Mock Data/data';
import { simulateApiCall } from './utils';

// Tipe data dari item di tabel penerimaan
type PenerimaanItem = typeof PenerimaanData[0];
// Tipe data dari item di riwayat upload
type RiwayatUploadItem = typeof RiwayatPenerimaanData[0];

/**
 * Mengambil daftar penerimaan untuk tab "Penerimaan".
 * Digunakan di: src/pages/penerimaan.tsx
 */
export const getPenerimaanList = (): Promise<PenerimaanItem[]> => {
    console.log("SERVICE: Mengambil daftar penerimaan...");
    return simulateApiCall(PenerimaanData);
};

/**
 * Mengambil daftar riwayat untuk tab "Riwayat Penerimaan".
 * Digunakan di: src/pages/penerimaan.tsx
 */
export const getRiwayatPenerimaanList = (): Promise<RiwayatUploadItem[]> => {
    console.log("SERVICE: Mengambil riwayat penerimaan...");
    return simulateApiCall(RiwayatPenerimaanData);
}; 

/**
 * Mengambil detail satu item penerimaan.
 * Digunakan di: src/pages/FormPenerimaan.tsx (mode edit)
 */
export const getPenerimaanDetail = (id: number): Promise<PenerimaanItem | undefined> => {
    console.log(`SERVICE: Mengambil detail penerimaan ID: ${id}...`);
    const item = PenerimaanData.find(p => p.id === id);
    return simulateApiCall(item);
};

/**
 * Mensimulasikan pengiriman form penerimaan baru.
 * Digunakan di: src/pages/FormPenerimaan.tsx
 */
export const createPenerimaan = (formData: any): Promise<PenerimaanItem> => {
    console.log("SERVICE: Membuat penerimaan baru...", formData);
    const newPenerimaan: PenerimaanItem = {
        id: Date.now(),
        noSurat: formData.noSurat || `SURAT/${Date.now()}`,
        role: 'Tim PPK', // Diasumsikan pembuatnya
        namaPegawai: formData.namaPihakPertama,
        kategori: formData.barang?.length > 0 ? formData.barang[0].kategori : 'ATK',
        status: 'Belum Dikonfirmasi',
        linkUnduh: '/dummyPDF.pdf' // Beri link dummy
    };
    return simulateApiCall(newPenerimaan);
};

/**
 * Mensimulasikan penambahan barang belanja ke form.
 * Digunakan di: src/pages/FormDataBarangBelanja.tsx
 */
export const addBarangBelanja = (barang: Omit<TIPE_BARANG_BELANJA, 'id'>): Promise<TIPE_BARANG_BELANJA> => {
    console.log("SERVICE: Menambah barang belanja...", barang);
    const newBarang: TIPE_BARANG_BELANJA = {
        id: Date.now(),
        ...barang
    };
    return simulateApiCall(newBarang);
};

/**
 * Mengambil daftar barang belanja untuk sebuah form (simulasi).
 * Digunakan di: src/pages/FormPenerimaan.tsx
 */
export const getBarangBelanjaByPenerimaanId = (id: number): Promise<TIPE_BARANG_BELANJA[]> => {
    console.log(`SERVICE: Mengambil barang belanja untuk penerimaan ID: ${id}...`);
    // Hanya simulasi, ambil 3 barang pertama
    return simulateApiCall(BARANG_BELANJA.slice(0, 3));
};