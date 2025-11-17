import type { BASTAPI, PaginationResponse, RIWAYATBASTFILEAPI } from "../constant/roles";
import apiClient from "./api";


export const getBASTList = async (
    page: number = 1,
    perPage?: number
): Promise<PaginationResponse<BASTAPI>> => {
    console.log(`SERVICE: Mengambil daftar BAST ${page}...`);

    try {
        // Buat params untuk query string
        const params: Record<string, number> = { page };
        if (perPage) {
            params.per_page = perPage;
        }

        const response = await apiClient.get('/api/v1/bast/unsigned', { params });

        if (response.data && response.data.data) {
            console.log("Data penerimaan diterima:", response.data.data);
            return response.data.data as PaginationResponse<BASTAPI>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data penerimaan:", error);
        throw new Error('Gagal mengambil data penerimaan.');
    }
};

export const getRiwayatBASTList = async (
    page: number = 1,
    perPage?: number
): Promise<PaginationResponse<BASTAPI>> => {
    console.log(`SERVICE: Mengambil daftar BAST ${page}...`);

    try {
        // Buat params untuk query string
        const params: Record<string, number> = { page };
        if (perPage) {
            params.per_page = perPage;
        }

        const response = await apiClient.get('/api/v1/bast/signed', { params });

        if (response.data && response.data.data) {
            console.log("Data penerimaan diterima:", response.data.data);
            return response.data.data as PaginationResponse<BASTAPI>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data penerimaan:", error);
        throw new Error('Gagal mengambil data penerimaan.');
    }
};

export const uploadBAST = async (penerimaanId: number, data: {
    uploaded_signed_file: File | null
}) => {
    console.log(`SERVICE: Mengupload BAST dengan penerimaan id ${penerimaanId}...`);

    // 1. Buat instance FormData
    const formData = new FormData();

    // 2. Masukkan file ke dalam FormData
    // Pastikan key 'uploaded_signed_file' sesuai dengan yang diminta Backend (misal: 'file' atau 'bast_file')
    if (data.uploaded_signed_file) {
        formData.append('uploaded_signed_file', data.uploaded_signed_file);
    }

    try {
        // 3. Kirim FormData. 
        // Axios biasanya otomatis mendeteksi FormData dan mengatur header 'multipart/form-data'
        // tapi kita bisa set manual untuk memastikan.
        const response = await apiClient.post(`/api/v1/bast/upload/${penerimaanId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log("✅ Response dari BE:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error mengupload bast:", error);
        throw error;
    }
}

export const getRiwayatBASTFile = async (
    page: number = 1,
    perPage?: number
): Promise<PaginationResponse<RIWAYATBASTFILEAPI>> => {
    console.log(`SERVICE: mengambil daftar riwayat bast file ${page}...`);

    try {
        // Buat params untuk query string
        const params: Record<string, number> = { page };
        if (perPage) {
            params.per_page = perPage;
        }

        const response = await apiClient.get('/api/v1/bast/history', { params });

        if (response.data && response.data.data) {
            console.log("Data penerimaan diterima:", response.data.data);
            return response.data.data as PaginationResponse<RIWAYATBASTFILEAPI>;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            throw new Error('Struktur data tidak sesuai');
        }
    } catch (error) {
        console.error("Gagal mengambil data penerimaan:", error);
        throw new Error('Gagal mengambil data penerimaan.');
    }
};