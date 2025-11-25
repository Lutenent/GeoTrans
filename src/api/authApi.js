// src/api/authApi.js
const API = "/api";

export async function validateToken(token) {
  const res = await fetch(`${API}/check-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  const data = await res.json();
  return !!data.valid;
}

export async function registerApi({ name, email, password, token }) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, token })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data.user;
}


export async function loginApi(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка входа');
  return data.user; // {id, name, email}
}
