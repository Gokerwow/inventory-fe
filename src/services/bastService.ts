import type { BASTAPI, PaginationResponse, RIWAYATBASTFILEAPI } from "../constant/roles";
import apiClient from "../utils/api";


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

interface UploadBastPayload {
    uploaded_signed_file: File | null;
}

export const uploadBAST = async (id: number, data: UploadBastPayload) => {
    // 1. Buat instance FormData
    const formData = new FormData();

    // 2. Masukkan file ke dalam FormData
    if (data.uploaded_signed_file) {
        formData.append('uploaded_signed_file', data.uploaded_signed_file);
    }

    // 3. Kirim request dengan FormData
    // Catatan: Axios akan otomatis mendeteksi FormData dan mengatur header 
    // 'Content-Type': 'multipart/form-data' dengan boundary yang benar.
    const response = await apiClient.post(`api/v1/bast/upload/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

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

export const getBASTUnpaidList = async (
    page: number = 1,
    perPage?: number,
    category: 'paid' | 'unpaid' | '' = '',
    categoryid?: number,
    search?: string,
    year?: string,
): Promise<PaginationResponse<BASTAPI>> => {
    console.log(`SERVICE: Mengambil daftar BAST kategori "${category}" page ${page}...`);

    try {
        const params: Record<string, number | string> = { page };
        if (perPage) params.per_page = perPage;
        if (categoryid) params.category = categoryid;
        if (search) params.search = search;
        if (year) params.year = year;
        if (category) params.status = category;
        const response = await apiClient.get('/api/v1/bast/payment', { params });
        const resultData = response.data.data as PaginationResponse<BASTAPI>

        if (resultData) {
            console.log("Data BAST diterima:", resultData);
            return resultData;
        } else {
            throw new Error('Data kosong atau struktur tidak sesuai');
        }

    } catch (error) {
        console.error("Gagal mengambil data BAST:", error);
        throw error; // Lempar error asli agar bisa ditangkap di UI
    }
};