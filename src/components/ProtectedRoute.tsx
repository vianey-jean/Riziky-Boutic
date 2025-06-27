
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, setRedirectAfterLogin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    // Stocker la page actuelle pour rediriger après connexion
    setRedirectAfterLogin(location.pathname);
    return <Navigate to="/login" replace />;
  }

  if ((requireAdmin || adminOnly) && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
