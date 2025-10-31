// src/hooks/useAuthorization.ts
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';

export const useAuthorization = (requiredRole: string) => {
    const navigate = useNavigate();

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    const checkAccess = (userRole: string | undefined) => {
        if (userRole !== requiredRole) {
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