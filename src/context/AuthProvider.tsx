import { useState, useMemo, useCallback } from 'react'; // <-- TAMBAHKAN useMemo dan useCallback
import { type Usernames } from '../Mock Data/data.ts'
import { AuthContext } from './AuthContext.tsx'
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api.ts';
import { USERNAMES } from '../constant/roles.ts';

const ROLE_PATHS = {
    [USERNAMES.SUPER_ADMIN] : '/akun', 
    [USERNAMES.ADMIN_GUDANG] : '/dashboard',
    [USERNAMES.PPK]: '/penerimaan',
    [USERNAMES.TEKNIS]: '/penerimaan',
    [USERNAMES.PENANGGUNG_JAWAB]: '/pengeluaran',
    [USERNAMES.INSTALASI]: '/pemesanan',
};

// 2. Buat Provider (Komponen Pembungkus)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Ambil user dari localStorage saat pertama kali load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const navigate = useNavigate();

    // --- UBAHAN: Stabilkan 'login' dengan useCallback ---
    const login = useCallback(async (username: Usernames) => {
        // --- 2. FIX: Tambahkan try...catch untuk menangani error ---
        try {
            const response = await apiClient.post('/api/login', {
                username: username,
                password: 'password' //
            });

            if (response.status === 200) {
                localStorage.setItem('api_token', response.data.token);
                setUser(response.data.user);

                // --- 1. FIX: Gunakan JSON.stringify saat menyimpan objek ---
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));

                const path = ROLE_PATHS[username];
                navigate(path, {
                    state: { toastMessage: 'Anda berhasil Login!' }
                });
                console.log(`Simulasi: Login sebagai ${username}`);
            }
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
            console.error("Login gagal:", errMsg);
            // Anda bisa menampilkan pesan error ini ke pengguna
            // contoh: setLoginError(error.response.data.message);
        }
    }, [navigate]); // <-- Dependency

    // --- UBAHAN: Stabilkan 'logout' dengan useCallback ---
    const logout = useCallback(() => {
        navigate('/role-pick');
        localStorage.removeItem('mockUser');
        setUser(null);
        console.log('Simulasi: Logout');
    }, [navigate]); // <-- Dependency

    // --- UBAHAN: Stabilkan 'value' dengan useMemo ---
    // Nilai yang akan dibagikan ke semua komponen
    const value = useMemo(() => ({
        user,   // Data user saat ini (null jika guest)
        login,  // Fungsi untuk login
        logout, // Fungsi untuk logout
        isAuthenticated: !!user, // boolean (true/false)
    }), [user, login, logout]); // <-- Hanya buat objek 'value' baru jika user, login, atau logout berubah

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
}