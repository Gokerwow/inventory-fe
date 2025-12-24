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
                localStorage.setItem('access_token', token);
                localStorage.setItem('user', userString);

                setTimeout(() => {
                    navigate('/', { replace: true });
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
                <h2 className="text-xl font-bold text-gray-700">
                    Memproses Login SSO...
                </h2>
                <p className="text-gray-500">
                    Mohon tunggu sebentar, sedang mengalihkan.
                </p>
            </div>
        </div>
    );
};

export default SSOCallback;
