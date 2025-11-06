import { employees, FAQ, type EmployeeType  } from '../Mock Data/data';
import { simulateApiCall } from './utils';

type Employee = typeof employees[0];
type FaqItem = typeof FAQ[0];

/**
 * Mengambil daftar pegawai di bawah admin.
 * Digunakan di: src/pages/profil.tsx
 */
export const getPegawaiList = (): Promise<Employee[]> => {
    console.log("SERVICE: Mengambil daftar pegawai...");
    return simulateApiCall(employees);
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