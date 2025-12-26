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
                localStorage.setItem('access_token', token); // Pastikan key sesuai dengan AuthProvider ('access_token')
                localStorage.setItem('user', userString);

                localStorage.setItem('login_success', 'true');

                setTimeout(() => {
                    window.location.href = '/';
                }, 100);

            } catch (err) {
                console.error('Gagal memproses login SSO', err);
                navigate('/', { replace: true });
            }
        } else {
            navigate('/', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-700">
                    Memproses Login...
                </h2>
                <p className="text-gray-500">
                    Mohon tunggu sebentar...
                </p>
            </div>
        </div>
    );
};

export default SSOCallback;