import { employees, FAQ } from '../Mock Data/data';
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