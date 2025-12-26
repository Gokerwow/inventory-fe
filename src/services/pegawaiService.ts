import { employees, FAQ, type EmployeeType } from '../Mock Data/data';
import apiClient from '../utils/api';
import { simulateApiCall } from './utils';
import { type SelectPihak, type DaftarPegawai, type APIPegawaiBaru, type PaginationResponse } from '../constant/roles';

type Employee = typeof employees[0];
type FaqItem = typeof FAQ[0];

/**
 * Mengambil daftar pegawai di bawah admin.
 * Digunakan di: src/pages/profil.tsx
 */

export const getDaftarPegawai = async (
    page: number = 1,
    perPage?: number,
    jabatanId?: number,
    status?: string,
    search?: string
): Promise<PaginationResponse<DaftarPegawai>> => {
    console.log(`SERVICE: Mengambil daftar pegawai halaman ${page}...`);

    try {
        // Buat params untuk query string
        const params: Record<string, number | string> = { page };
        if (perPage) {
            params.per_page = perPage;
        }
        if (jabatanId) {
            params.jabatan_id = jabatanId;
        }
        if (status) {
            params.status = status;
        }
        if (search) {
            params.search = search;
        }

        const response = await apiClient.get('/api/v1/pegawai', { params });

        if (response.data && response.data.data) {
            console.log("Data pegawai diterima:", response.data.data);
            return response.data.data as PaginationResponse<DaftarPegawai>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data pegawai:", error);
        throw new Error('Gagal mengambil data pegawai.');
    }
};

export const getPegawaiList = async (): Promise<Employee[]> => {
    console.log("SERVICE: Mengambil daftar pegawai...");
    try {
        const response = await apiClient.get('/api/v1/pegawai/select')
        const data = response.data.data as Employee[]
        return data
    } catch (error) {
        console.error("Gagal mengambil data log aktivitas:", error);
        throw new Error('Gagal mengambil data log aktivitas.');
    }
};

export const getPegawaiSelect = async (): Promise<SelectPihak[]> => {
    console.log("SERVICE: Mengambil daftar pegawai...");
    try {
        const response = await apiClient.get('/api/v1/pegawai/select')
        const data = response.data.data as SelectPihak[]
        return data
    } catch (error) {
        console.error("Gagal mengambil data log aktivitas:", error);
        throw new Error('Gagal mengambil data log aktivitas.');
    }
};

/**
 * Mengambil daftar FAQ.
 * Digunakan di: src/pages/profil.tsx
 */
export const getFaqList = (): Promise<FaqItem[]> => {
    console.log("SERVICE: Mengambil daftar FAQ...");
    return simulateApiCall(FAQ);
};

/**
 * Mengupdate akun yang ada.
 * Digunakan di: src/pages/FormAkun.tsx (mode edit)
 */
export const createPegawai = async (formData: APIPegawaiBaru): Promise<APIPegawaiBaru> => {
    console.log("SERVICE: Membuat pegawai baru...", formData);
    try {
        const response = await apiClient.post('/api/v1/pegawai', formData);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error membuat pegawai:", error);
        throw error;
    }
};
/**
 * Mengupdate akun yang ada.
 * Digunakan di: src/pages/FormAkun.tsx (mode edit)
 */
export const updatePegawai = async (pegawaiId: number, formData: Partial<APIPegawaiBaru>): Promise<APIPegawaiBaru> => {
    console.log("SERVICE: Mengedit pegawai...", formData);
    try {
        const response = await apiClient.put(`/api/v1/pegawai/${pegawaiId}`, formData);
        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            console.error("❌ DETAIL ERROR VALIDASI (422):", error.response.data);
            // Backend biasanya mengirim format seperti: { errors: { no_surat: ["Nomor surat sudah ada"] } }
        }
        console.error("❌ Error mengedit pegawai:", error);
        throw error;
    }
};

export const updateStatusPegawai = async (pegawaiId: number): Promise<APIPegawaiBaru> => {
    console.log("SERVICE: Mengedit pegawai...", pegawaiId);
    try {
        const response = await apiClient.patch(`/api/v1/pegawai/${pegawaiId}/status`);
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
