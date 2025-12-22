import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SSOCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const userString = searchParams.get('user');

        if (token && userString) {
            try {
                // 1. Simpan Token & User ke LocalStorage
                localStorage.setItem('token', token);
                localStorage.setItem('currentUser', userString);

                // 2. Redirect ke Root ("/") dengan Jeda Sedikit
                // Jeda 100ms penting agar browser selesai menulis ke storage
                // Kita lempar ke "/" agar RootHandler di App.tsx yang menentukan
                // user ini harus ke dashboard, penerimaan, atau yang lain.
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);

            } catch (err) {
                console.error("Gagal parsing data login", err);
                // Jika error, kembalikan ke root (nanti dipaksa login lagi)
                navigate('/', { replace: true });
            }
        } else {
            // Jika data tidak lengkap, kembalikan ke root
            navigate('/', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-100">
            <div className="text-center">
                <h2 className="text-xl font-bold text-gray-700">Memproses Login SSO...</h2>
                <p className="text-gray-500">Mohon tunggu sebentar, sedang mengalihkan.</p>
            </div>
        </div>
    );
};

export default SSOCallback;