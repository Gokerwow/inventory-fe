import {
    PenerimaanData,
    RiwayatPenerimaanData,
} from '../Mock Data/data';
import apiClient from './api';
import axios from 'axios';
import type { APIDataPenerimaan, APIDetailPenerimaan, PaginationResponse } from '../constant/roles';

// Tipe data dari item di tabel penerimaan
type PenerimaanItem = typeof PenerimaanData[0];
// Tipe data dari item di riwayat upload
type RiwayatPenerimaanItem = typeof RiwayatPenerimaanData[0];

/**
 * Mengambil daftar penerimaan untuk tab "Penerimaan".
 * Digunakan di: src/pages/penerimaan.tsx
 */


export const getPenerimaanList = async (
    page: number = 1,
    perPage?: number
): Promise<PaginationResponse<PenerimaanItem>> => {
    console.log(`SERVICE: Mengambil daftar penerimaan halaman ${page}...`);

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

/**
 * Mengambil daftar riwayat penerimaan dengan pagination
 * @param page - Nomor halaman yang ingin diambil (default: 1)
 * @param perPage - Jumlah item per halaman (optional)
 */
export const getRiwayatPenerimaanList = async (
    page: number = 1,
    perPage?: number
): Promise<PaginationResponse<RiwayatPenerimaanItem>> => {
    console.log(`SERVICE: Mengambil daftar riwayat penerimaan halaman ${page}...`);

    try {
        const params: Record<string, number> = { page };
        if (perPage) {
            params.per_page = perPage;
        }

        const response = await apiClient.get('/api/v1/penerimaan/history', { params });

        if (response.data && response.data.data) {
            console.log("Data riwayat penerimaan diterima:", response.data.data);
            return response.data.data as PaginationResponse<RiwayatPenerimaanItem>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data riwayat penerimaan:", error);
        throw new Error('Gagal mengambil data riwayat penerimaan.');
    }
};

/**
 * Mengambil detail satu item penerimaan.
 * Digunakan di: src/pages/FormPenerimaan.tsx (mode edit)
 */
export const getPenerimaanDetail = async (id: number): Promise<APIDetailPenerimaan | undefined> => {
    console.log(`SERVICE: Mengambil detail penerimaan ID: ${id}...`);
    try {
        const response = await apiClient.get(`/api/v1/penerimaan/${id}`)
        const data = response.data.data
        return data
    } catch (error) {
        console.error("Gagal mengambil detail penerimaan:", error);
        throw new Error('Gagal mengambil detail penerimaan');
    }
};

export const createPenerimaan = async (formData: APIDataPenerimaan): Promise<APIDataPenerimaan> => {
    console.log("SERVICE: Membuat penerimaan baru...", formData);
    try {
        const response = await apiClient.post('/api/v1/penerimaan', formData);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error membuat penerimaan:", error);
        throw error;
    }
};

export const editPenerimaan = async (penerimaanId: number,formData: APIDataPenerimaan): Promise<APIDataPenerimaan> => {
    console.log("SERVICE: Mengedit penerimaan...", formData);
    try {
        const response = await apiClient.put(`/api/v1/penerimaan/${penerimaanId}`, formData);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("❌ DETAIL ERROR VALIDASI (422):", error.response.data);
            // Backend biasanya mengirim format seperti: { errors: { no_surat: ["Nomor surat sudah ada"] } }
        }
        console.error("❌ Error mengedit penerimaan:", error);
        throw error;
    }
};


export const confirmPenerimaan = async (id: number) => {
    console.log(`SERVICE: Mengoinfirmasi status detail penerimaan ID: ${id}...`);
    const confirmed = {
        "status": "confirmed"
    }
    try {
        const response = await apiClient.patch(`/api/v1/penerimaan/${id}/confirm`, confirmed);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error membuat penerimaan:", error);
        // Log detail error dari backend if axios error
        if (axios.isAxiosError(error) && error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
            
            // Throw error dengan pesan dari backend jika ada
            throw new Error(
                (error.response.data as any)?.message || 
                (error.response.data as any)?.error || 
                "Gagal mengonfirmasi penerimaan"
            );
        }
        // Non-Axios error or no response available
        throw new Error("Gagal mengonfirmasi penerimaan");
    }
}; 