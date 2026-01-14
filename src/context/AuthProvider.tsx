import { useState, useMemo, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext.tsx';
import apiClient from '../utils/api.ts';
import { debugLog } from '../utils/debugLogger.tsx';
import Loader from '../components/loader.tsx';

export function AuthProvider({ children }: { children: React.ReactNode; }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const fetchUser = useCallback(async () => {
        if (sessionStorage.getItem('logging_out') === 'true') {
            setIsLoading(false);
            return;
        }

        try {
            debugLog('fetchUser: Syncing...');
            const response = await apiClient.get('/api/v1/me');
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            debugLog('fetchUser: Error', error.response?.status);
            if (error.response?.status === 401) {
                setUser(null);
                localStorage.removeItem('user');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = useCallback(async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        sessionStorage.setItem('logging_out', 'true');

        try {
            const response = await apiClient.post('/api/v1/sso/logout');
            localStorage.clear();
            setUser(null);
            window.location.href = response.data.target_url;
        } catch (error) {
            console.log(error)
            localStorage.clear();
            setUser(null);
            window.location.href = 'http://localhost:8000/logout';
        }
    }, [isLoggingOut]);

    const value = useMemo(() => ({
        user,
        login: () => window.location.href = 'http://localhost:8001/api/sso/login',
        logout,
        isAuthenticated: !!user,
        isLoggingOut,
        isLoading,
    }), [user, logout, isLoggingOut, isLoading]);

    const showContent = user || !isLoading;

    return (
        <AuthContext.Provider value={value}>
            {showContent ? children : (
                <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className='mb-4'>
                            <Loader />
                        </div>

                        <div className="flex flex-col items-center animate-pulse">
                            <p className="text-lg font-semibold text-slate-700 tracking-wide">
                                Menyiapkan Akses
                            </p>
                            <p className="text-sm text-slate-500">
                                Sedang memverifikasi sesi anda...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}