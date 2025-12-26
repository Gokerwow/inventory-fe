import { User } from '../constant/roles';
import { simulateApiCall } from './utils';
import apiClient from '../utils/api';

/**
 * Mengambil semua data akun pengguna.
 * Digunakan di: src/pages/akun.tsx
 */
export const getAkunUsers = async (): Promise<User[]> => {
    console.log("SERVICE: Mengambil semua data akun...");
    try {
        const response = await apiClient.get('/api/v1/account')
        console.log("Data akun diterima:", response.data.data.data);
        const dataAkun = response.data.data.data as User[];
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

/**
 * Membuat akun baru.
 * Digunakan di: src/pages/FormAkun.tsx
 * Catatan: Ini hanya simulasi. Data tidak akan benar-benar tersimpan.
 */
export const createAkun = (data: Partial<User>): Promise<User> => {
    console.log("SERVICE: Membuat akun baru...", data);
    const newAkun: User = {
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
/**
 * Mengupdate akun yang ada menggunakan API Backend.
 * Mendukung upload gambar via FormData.
 */
export const updateAkun = async (userId: number, data: FormData): Promise<any> => {
    console.log(`SERVICE: Mengupdate akun ID: ${userId}...`);
    
    // Laravel Workaround:
    // Menggunakan POST dengan _method: 'PUT' agar file upload (multipart/form-data) terbaca
    data.append('_method', 'PUT');

    try {
        // URL: http://127.0.0.1:8001/api/v1/account/{id}
        const response = await apiClient.post(`/api/v1/account/${userId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        console.log("✅ Update berhasil:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Gagal update akun:", error);
        throw error; 
    }
};