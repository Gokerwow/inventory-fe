import type { APIJabatan } from "../constant/roles";
import apiClient from "../utils/api";


export const getJabatanSelect = async (): Promise<APIJabatan[]> => {
    console.log("SERVICE: Mengambil daftar jabatan...");
    try {
        const response = await apiClient.get('/api/v1/jabatan/select')
        const data = response.data.data as APIJabatan[]
        return data
    } catch (error) {
        console.error("Gagal mengambil data log aktivitas:", error);
        throw new Error('Gagal mengambil data log aktivitas.');
    }
};