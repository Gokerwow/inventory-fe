// src/hooks/useAuthorization.ts
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';
import { useCallback, useMemo } from 'react'; // <-- TAMBAHKAN useCallback dan useMemo

export const useAuthorization = (requiredRole: string | string[]) => {
    const navigate = useNavigate();

    // --- UBAHAN: Gunakan useMemo ---
    // Ini untuk memastikan 'rolesArray' tidak dibuat ulang di setiap render
    // (Seperti kartu ID untuk variabel)
    const rolesArray = useMemo(() => 
        Array.isArray(requiredRole) ? requiredRole : [requiredRole],
      [requiredRole] // Hanya akan dibuat ulang jika 'requiredRole' berubah
    );

    // --- UBAHAN: Gunakan useCallback ---
    // Ini "mengingat" fungsi 'checkAccess' dan tidak membuatnya ulang
    // (Seperti kartu ID untuk fungsi)
    const checkAccess = useCallback((userRole: string | undefined) => {
        if (!userRole || !rolesArray.includes(userRole)) {
            navigate(PATHS.UNAUTHORIZED, { replace: true });
            return false;
        }
        return true;
    }, [navigate, rolesArray]); // Dependencies: fungsi ini hanya dibuat ulang jika 'navigate' atau 'rolesArray' berubah

    // --- UBAHAN: Gunakan useCallback ---
    // Ini "mengingat" fungsi 'hasAccess'
    const hasAccess = useCallback((userRole: string | undefined) => {
        return userRole !== undefined && rolesArray.includes(userRole);
    }, [rolesArray]); // Dependencies: fungsi ini hanya dibuat ulang jika 'rolesArray' berubah

    return { checkAccess, hasAccess };
};