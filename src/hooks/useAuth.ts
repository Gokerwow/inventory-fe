import { useContext } from 'react';
// Impor Context dan Tipe-nya dari file provider
import { AuthContext } from '../context/AuthContext';

// 4. Buat dan Ekspor Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider');
    }
    return context;
};