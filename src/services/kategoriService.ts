import type { Kategori } from '../constant/roles';
import apiClient from '../utils/api';

export const getKategoriList = async (): Promise<Kategori[]> => {
    console.log("SERVICE: Mengambil daftar kategori...");
    try {
        const response = await apiClient.get('/api/v1/category');
        if (response.data && response.data.data) {
            console.log("Data kategori diterima:", response.data.data.data);
            const data = response.data.data.data as Kategori[]
            return data;
        } else {
            console.error("Struktur data tidak terduga:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error saat mengambil data kategori:", error);
        return [];
    }
}