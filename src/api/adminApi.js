// src/api/adminApi.js

const API = "/api/admin";

// ===================================================
//               СТРАХОВОЙ ЛИМИТ
// ===================================================
export async function fetchInsuranceLimit() {
  const res = await fetch(`${API}/config`);
  if (!res.ok) throw new Error("Failed to load insurance config");
  return await res.json(); // { insuranceLimit }
}

export async function updateInsuranceLimit(value) {
  const res = await fetch(`${API}/config/limit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ insuranceLimit: value }),
  });
  if (!res.ok) throw new Error("Failed to update insurance limit");
  return await res.json();
}

// ===================================================
//             ТОРГОВЫЕ ВОЗНАГРАЖДЕНИЯ
// ===================================================
export async function fetchRewards() {
  const res = await fetch(`${API}/rewards`);
  if (!res.ok) throw new Error("Failed to load rewards");
  return await res.json(); // { rewards: [...] }
}

export async function addReward(name, percent) {
  const res = await fetch(`${API}/rewards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, percent }),
  });
  if (!res.ok) throw new Error("Failed to add reward");
  return await res.json();
}

export async function deleteReward(id) {
  const res = await fetch(`${API}/rewards/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete reward");
  return await res.json();
}

// ===================================================
//                   ИНВАЙТ-ТОКЕНЫ
// ===================================================

// Получить список токенов
export async function fetchTokens() {
  const res = await fetch(`${API}/tokens`);
  if (!res.ok) throw new Error("Failed to load tokens");
  return await res.json(); // { tokens: ["AAA111", ...] }
}

// Добавить вручную
export async function createToken(token) {
  const res = await fetch(`${API}/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Failed to create token");
  return await res.json();
}

// Авто-генерация токена
export async function createAutoToken() {
  const res = await fetch(`${API}/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ auto: true }),
  });
  if (!res.ok) throw new Error("Failed to auto-create token");
  return await res.json(); // { ok: true, token: "TKN-XXXX" }
}

// Удалить один токен
export async function deleteToken(token) {
  const res = await fetch(`${API}/tokens/${token}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete token");
  return await res.json();
}

// Удалить ВСЕ токены
export async function deleteAllTokens() {
  const res = await fetch(`${API}/tokens`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete all tokens");
  return await res.json();
}
