// src/pages/unauthorized.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Pastikan path import ini sesuai
import Button from '../components/button';
import { useEffect } from 'react';
import { DebugViewer } from '../components/debugViewer';

const Unauthorized = () => {
    useEffect(() => {
        // Clear logout flag jika sampai di unauthorized
        sessionStorage.removeItem('logging_out');
    }, []);

    const navigate = useNavigate();
    const { logout, user } = useAuth(); // Ambil fungsi logout dan data user

    const goBack = () => {
        navigate(-1); // Kembali ke halaman sebelumnya
    };

    const handleLogout = () => {
        // Panggil fungsi logout dari AuthProvider yang sudah diperbaiki
        // Ini akan membersihkan localStorage dan me-refresh halaman ke SSO
        logout();
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

                {/* User Info (Optional: membantu user sadar dia login sebagai siapa) */}
                {user && (
                    <p className="text-gray-500 text-sm mb-6 bg-gray-50 py-2 rounded">
                        Login sebagai: <span className="font-semibold text-gray-700">{user.name || 'User'}</span>
                    </p>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Button
                        onClick={goBack}
                        variant='primary'
                    >
                        Kembali
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant='danger'
                    >
                        Ganti Akun / Logout
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-xs text-yellow-800">
                        <strong>Tips:</strong> Jika Anda yakin seharusnya memiliki akses, silakan logout dan login kembali, atau hubungi administrator sistem.
                    </p>
                </div>
            </div>

            <DebugViewer />
        </div>
    );
};

export default Unauthorized;