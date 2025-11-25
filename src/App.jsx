import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TomeDashboard from './TomeDashboard.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import LoginForm from './components/LoginForm.jsx';

import RequireAuth from './routes/RequireAuth.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';

import AdminPage from './pages/AdminPage.jsx'; // ← добавили

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#05070b] text-zinc-100 antialiased selection:bg-[#e04646]/30">
        <Routes>

          {/* пубичные */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />

          {/* 🔐 защищённая админ-панель */}
          <Route path="/admin" element={<AdminPage />} />

          {/* 🔐 защищённые страницы */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<TomeDashboard />} />
          </Route>

          {/* любое → на / */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </div>
    </AuthProvider>
  );
}
