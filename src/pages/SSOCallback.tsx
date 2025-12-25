import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/api';

const SSOCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // mencegah double-call di React.StrictMode
    const isProcessing = useRef(false);

    useEffect(() => {
        const token = searchParams.get('token');

        const processLogin = async () => {
            // 2. Cek Guard: Jika tidak ada token atau SEDANG memproses, hentikan.
            if (!token || isProcessing.current) return;

            isProcessing.current = true;

            try {
                console.log("🔄 Memproses login SSO...");

                localStorage.setItem('access_token', token);

                const response = await apiClient.get('/api/me');
                const userData = response.data;

                console.log("✅ Data user didapat:", userData);

                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('login_success', 'true');

                window.location.href = '/';

            } catch (err) {
                console.error('❌ Gagal mengambil profil user:', err);

                localStorage.removeItem('access_token');
                localStorage.removeItem('user');

                navigate('/unauthorized', { replace: true });
            }
        };

        if (token) {
            processLogin();
        } else {
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