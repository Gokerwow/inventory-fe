import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/api';

const SSOCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 1. Gunakan useRef untuk menandai apakah proses sudah berjalan
    // Ini solusi ampuh untuk mencegah double-call di React.StrictMode
    const isProcessing = useRef(false);

    useEffect(() => {
        const token = searchParams.get('token');

        const processLogin = async () => {
            // 2. Cek Guard: Jika tidak ada token atau SEDANG memproses, hentikan.
            if (!token || isProcessing.current) return;

            // Tandai bahwa proses sedang berjalan
            isProcessing.current = true;

            try {
                console.log("🔄 Memproses login SSO...");

                // Simpan token sementara
                localStorage.setItem('access_token', token);

                // Fetch data user
                const response = await apiClient.get('/api/me');
                const userData = response.data;

                console.log("✅ Data user didapat:", userData);

                // Simpan data final
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('login_success', 'true');

                // Redirect ke dashboard
                // window.location.href lebih aman di sini untuk memastikan state aplikasi bersih
                window.location.href = '/';

            } catch (err) {
                console.error('❌ Gagal mengambil profil user:', err);

                // Bersihkan sampah token jika gagal
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');

                // PENTING: Jangan langsung redirect ke '/' jika gagal, 
                // karena bisa memicu looping ke SSO lagi.
                // Lebih baik arahkan ke halaman error atau Unauthorized.
                navigate('/unauthorized', { replace: true });
            }
        };

        if (token) {
            processLogin();
        } else {
            // Jika token kosong dari awal, jangan ke '/' (karena bakal dilempar ke SSO lagi)
            // Arahkan ke Unauthorized atau Login manual
            navigate('/unauthorized', { replace: true });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Kosongkan dependency array agar effect hanya jalan saat mount (sekali)

    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-700">
                    Memverifikasi Akun...
                </h2>
                <p className="text-gray-500">
                    Mohon tunggu sebentar...
                </p>
            </div>
        </div>
    );
};

export default SSOCallback;