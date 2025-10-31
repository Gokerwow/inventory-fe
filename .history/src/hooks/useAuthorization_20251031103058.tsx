// src/hooks/useAuthorization.ts
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../Routes/path';

export const useAuthorization = (requiredRole: string) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // ← Ambil loading state

  const checkAccess = (userRole: string | undefined) => {
    // Jangan check jika masih loading
    if (loading) return true;
    
    if (userRole !== requiredRole) {
      navigate(PATHS.UNAUTHORIZED, { replace: true });
      return false;
    }
    return true;
  };

  const hasAccess = (userRole: string | undefined) => {
    // Jangan block render selama loading
    if (loading) return true;
    return userRole === requiredRole;
  };

  return { checkAccess, hasAccess };
};