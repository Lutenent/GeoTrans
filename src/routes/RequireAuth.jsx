// src/routes/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // редиректим на статический FAQ.html
    window.location.href = '/FAQ.html';
    return null; // ничего не рендерим внутри React
  }

  return <Outlet />;
}
