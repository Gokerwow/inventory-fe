// src/hooks/useAuthorization.ts
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';

export const useAuthorization = (requiredRole: string | string[]) => {
    const navigate = useNavigate();

    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    const checkAccess = (userRole: string | undefined) => {
        if (!userRole || !rolesArray.includes(userRole)) {
            navigate(PATHS.UNAUTHORIZED, { replace: true });
            return false;
        }
        return true;
    };

    const hasAccess = (userRole: string | undefined) => {
        return userRole === requiredRole;
    };

    return { checkAccess, hasAccess };
};