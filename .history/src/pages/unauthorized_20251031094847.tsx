// src/pages/Unauthorized.tsx
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../constants/paths';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Kembali ke halaman sebelumnya
    };

    const goHome = () => {
        navigate(PATHS.DASHBOARD); // atau halaman default lainnya
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Icon */}
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                        className="w-12 h-12 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-9V4m0 2V4m0 2h2M9 6H7m10 4h2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2m10 0V8a4 4 0 00-4-4h-2a4 4 0 00-4 4v2h10z"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Akses Ditolak
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-2">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                <p className="text-gray-500 text-sm mb-8">
                    Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={goBack}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={goHome}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Ke Beranda
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Tips:</strong> Pastikan Anda login dengan akun yang memiliki hak akses yang sesuai.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;