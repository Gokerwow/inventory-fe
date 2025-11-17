import { MOCK_USERS, type MockUser } from '../Mock Data/data';
import { simulateApiCall } from './utils';
import apiClient from './api';

/**
 * Mengambil semua data akun pengguna.
 * Digunakan di: src/pages/akun.tsx
 */
export const getAkunUsers = async (): Promise<MockUser[]> => {
    console.log("SERVICE: Mengambil semua data akun...");
    try {
        const response = await apiClient.get('/api/v1/account')
        console.log("Data akun diterima:", response.data.data.data);
        const dataAkun = response.data.data.data as MockUser[];
        return dataAkun;
    } catch (error) {
        // --- 2. FIX: Tangani error di sini ---
        const errMsg = (() => {
            if (error instanceof Error) return error.message;
            if (typeof error === 'object' && error !== null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const respMsg = (error as any).response?.data?.message;
                if (typeof respMsg === 'string') return respMsg;
            }
            return String(error);
        })();
        console.error("Mengambil data akun gagal:", errMsg);
        // Anda bisa menampilkan pesan error ini ke pengguna
        // contoh: setLoginError(error.response.data.message);
        // Kembalikan fallback (mock) agar fungsi selalu mengembalikan Promise<MockUser[]>
        return [];
    }
};

/**
 * Mengambil satu data akun berdasarkan ID.
 */
export const getAkunById = (userId: number): Promise<MockUser | undefined> => {
    console.log(`SERVICE: Mengambil akun by ID: ${userId}...`);
    const user = MOCK_USERS.find(u => u.user_id === userId);
    return simulateApiCall(user);
};

/**
 * Membuat akun baru.
 * Digunakan di: src/pages/FormAkun.tsx
 * Catatan: Ini hanya simulasi. Data tidak akan benar-benar tersimpan.
 */
export const createAkun = (data: Partial<MockUser>): Promise<MockUser> => {
    console.log("SERVICE: Membuat akun baru...", data);
    const newAkun: MockUser = {
        user_id: Date.now(),
        sso_user_id: Date.now(),
        nama_pengguna: data.nama_pengguna || 'userBaru',
        photo: data.photo || '/default-avatar.png',
        email: data.email || '',
        password: data.password || 'hashedpassword',
        role: data.role || 'user',
        last_login: new Date().toISOString(),
        synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    return simulateApiCall(newAkun);
};

/**
 * Mengupdate akun yang ada.
 * Digunakan di: src/pages/FormAkun.tsx (mode edit)
 */
export const updateAkun = (userId: number, data: Partial<MockUser>): Promise<MockUser> => {
    console.log(`SERVICE: Mengupdate akun ID: ${userId}...`, data);
    const currentUser = MOCK_USERS.find(u => u.user_id === userId);

    if (!currentUser) {
        return Promise.reject(new Error("Akun tidak ditemukan"));
    }

    const updatedAkun = {
        ...currentUser,
        ...data,
        updated_at: new Date().toISOString(),
    };

    return simulateApiCall(updatedAkun);
};