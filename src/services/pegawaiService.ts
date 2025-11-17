import { employees, FAQ, type EmployeeType } from '../Mock Data/data';
import apiClient from './api';
import { simulateApiCall } from './utils';
import { SelectPihak } from '../constant/roles';

type Employee = typeof employees[0];
type FaqItem = typeof FAQ[0];

/**
 * Mengambil daftar pegawai di bawah admin.
 * Digunakan di: src/pages/profil.tsx
 */
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
export const updatePegawai = (pegawaiId: number, data: Partial<EmployeeType>): Promise<EmployeeType> => {
    console.log(`SERVICE: Mengupdate akun ID: ${pegawaiId}...`, data);
    const currentPegawai = employees.find(u => u.id === pegawaiId);

    if (!currentPegawai) {
        return Promise.reject(new Error("Pegawai tidak ditemukan"));
    }

    const updatedAkun = {
        ...currentPegawai,
        ...data,
        updated_at: new Date().toISOString(),
    };

    return simulateApiCall(updatedAkun);
};