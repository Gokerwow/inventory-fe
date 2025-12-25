import apiClient from './api';
import { type APINotifikasi, type PaginationResponse } from '../constant/roles';

/**
 * Mengambil daftar pegawai di bawah admin.
 * Digunakan di: src/pages/profil.tsx
 */

export const getDaftarNotifikasi = async (
    page: number = 1,
    perPage?: number,
    status?: string,
): Promise<PaginationResponse<APINotifikasi>> => {
    console.log(`SERVICE: Mengambil daftar notifikasi halaman ${page}...`);

    try {
        // Buat params untuk query string
        const params: Record<string, number | string> = { page };
        if (perPage) {
            params.per_page = perPage;
        }
        if (status && status !== 'all') params.status = status;
        const response = await apiClient.get('/api/v1/notifikasi', { params });

        if (response.data && response.data.data) {
            console.log("Data notifikasi diterima:", response.data.data);
            return response.data.data as PaginationResponse<APINotifikasi>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data notifikasi:", error);
        throw new Error('Gagal mengambil data notifikasi.');
    }
};

export const markReadNotifikasi = async (notifikasiId: number): Promise<APINotifikasi> => {
    console.log("SERVICE: Tandai lihat notifikasi...", notifikasiId);
    try {
        const response = await apiClient.patch(`/api/v1/notifikasi/${notifikasiId}/markRead`);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            console.error("❌ DETAIL ERROR VALIDASI (422):", error.response.data);
        }
        console.error("❌ Error mengedit notifikasi:", error);
        throw error;
    }
};
export const markAllNotifikasi = async (): Promise<APINotifikasi> => {
    console.log("SERVICE: Tandai lihat notifikasi...");
    try {
        const response = await apiClient.patch(`/api/v1/notifikasi/markAll`);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            console.error("❌ DETAIL ERROR VALIDASI (422):", error.response.data);
        }
        console.error("❌ Error mengedit notifikasi:", error);
        throw error;
    }
};
export const deleteNotifikasi = async (notifikasiId: number): Promise<any> => {
    try {
        const response = await apiClient.delete(`/api/v1/notifikasi/${notifikasiId}`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

export const deleteAllNotifikasi = async (): Promise<any> => {
    try {
        const response = await apiClient.delete(`/api/v1/notifikasi/delete-all`);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};