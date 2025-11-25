import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi } from "../api/authApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("AUTH_LOCAL_PARSE_ERROR:", e);
      return null;
    }
  });

  const isAuthenticated = !!user;

  // 🔥 Универсальное обновление данных пользователя
  async function refreshUser() {
    if (!user?.id) return;

    try {
      const r = await fetch(`/api/admin/user?id=${user.id}`);
      if (!r.ok) {
        console.warn("REFRESH_USER: no response", r.status);
        return;
      }

      const fresh = await r.json();

      if (fresh) {
        setUser(fresh);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      }
    } catch (e) {
      console.error("REFRESH_USER_ERROR:", e);
    }
  }

  // 🔥 Первичная подгрузка актуального пользователя при загрузке сайта
  useEffect(() => {
    if (user?.id) {
      refreshUser();
    }
  }, [user?.id]);

  // 🔥 Автообновление после события "balance-updated"
  useEffect(() => {
    const handler = () => refreshUser();
    window.addEventListener("balance-updated", handler);
    return () => window.removeEventListener("balance-updated", handler);
  }, [user?.id]);

  // LOGIN
  async function login(username, password) {
    const authUser = await loginApi(username, password);

    if (authUser) {
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));

      // Подтягиваем самые новые данные
      refreshUser();
    }

    return authUser;
  }

  // REGISTER
  async function register(username, password) {
    return await registerApi(username, password);
  }

  // LOGOUT
  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        isAuthenticated,
        refreshUser, // экспортируем
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
