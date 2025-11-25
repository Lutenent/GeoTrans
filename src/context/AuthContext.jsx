import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginApi, registerApi, validateToken } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Восстанавливаем сессию из localStorage
useEffect(() => {
  async function refresh() {
    if (!user) return;

    try {
      const res = await fetch(`/api/user/me?userId=${user.id}`);
      const data = await res.json();

      if (data && data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error("REFRESH USER ERROR:", e);
    }
  }

  window.addEventListener("balance-updated", refresh);
  return () => window.removeEventListener("balance-updated", refresh);
}, [user]);


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
