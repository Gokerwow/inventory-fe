// src/pages/unauthorized.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/button';
import { useEffect, useMemo } from 'react';
import { DebugViewer } from '../components/debugViewer';
import { ROLE_DISPLAY_NAMES } from '../constant/roles';

const Unauthorized = () => {
    useEffect(() => {
        // Clear logout flag jika sampai di unauthorized
        sessionStorage.removeItem('logging_out');
    }, []);

    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Cek apakah role user kosong/belum diset
    const isRoleMissing = useMemo(() => {
        return !user?.role || user.role === '' || user.role === 'null';
    }, [user]);

    const goBack = () => {
        navigate(-1);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                
                {/* Header Decoration */}
                <div className={`h-2 w-full ${isRoleMissing ? 'bg-orange-500' : 'bg-red-600'}`}></div>

                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm 
                        ${isRoleMissing ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                        {isRoleMissing ? (
                            // Icon Tanda Seru / Pending untuk Role Missing
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            // Icon Gembok / Forbidden untuk Access Denied
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-9V4m0 2V4m0 2h2M9 6H7m10 4h2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2m10 0V8a4 4 0 00-4-4h-2a4 4 0 00-4 4v2h10z" />
                            </svg>
                        )}
                    </div>

                    {/* Dynamic Title & Message */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        {isRoleMissing ? "Status Akun Belum Aktif" : "Akses Ditolak"}
                    </h1>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {isRoleMissing 
                            ? "Akun Anda belum bisa diakses karena belum memiliki Role. Hubungi Superadmin untuk informasi selengkapnya."
                            : "Maaf, Anda tidak memiliki izin yang cukup untuk mengakses halaman yang Anda tuju."
                        }
                    </p>

                    {/* User Info Box */}
                    {user && (
                        <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-500 flex flex-col gap-1">
                            <div>Login sebagai: <span className="font-semibold text-gray-800">{user.name}</span></div>
                            {user.email && <div>Email: {user.email}</div>}
                            <div>Role anda: <span className="font-semibold text-gray-800">{ROLE_DISPLAY_NAMES[user.role]}</span></div>
                        </div>
                    )}

                    {/* Actions Buttons */}
                    <div className="flex flex-col gap-3">
                        {!isRoleMissing && (
                            <Button
                                onClick={goBack}
                                variant='primary'
                                className="w-full justify-center"
                            >
                                Kembali ke Halaman Sebelumnya
                            </Button>
                        )}
                        
                        <Button
                            onClick={handleLogout}
                            variant={isRoleMissing ? 'primary' : 'danger'}
                            className="w-full justify-center"
                        >
                            {isRoleMissing ? "Kembali ke Halaman Login" : "Ganti Akun / Logout"}
                        </Button>
                    </div>

                    {/* Contact Support Hint */}
                    {isRoleMissing && (
                        <p className="mt-6 text-xs text-gray-400">
                            ID Pengguna: {user?.id || '-'} • Silakan screenshot halaman ini saat melapor.
                        </p>
                    )}
                </div>
            </div>

            <DebugViewer />
        </div>
    );
};

export default Unauthorized;