// src/hooks/useUsdtRubRate.js
import { useEffect, useState } from "react";

// Автоматически выбираем API в зависимости от среды
const API_URL =
  import.meta.env.PROD
    ? "https://geo-transfer.ru/api/usdt-rate" // на сервере
    : "http://127.0.0.1:5000/api/usdt-rate"; // локально

export function useUsdtRubRate(pollInterval = 60000) {
  const [rate, setRate] = useState(null);
  const [error, setError] = useState(null);

  async function loadRate() {
    try {
      const res = await fetch(API_URL);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      // ожидается { ok: true, rate: ЧИСЛО }
      const value = Number(json.rate);

      if (!value || isNaN(value)) {
        throw new Error("Некорректный формат курса");
      }

      setRate(value);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки курса:", err);
      setError(err);
    }
  }

  useEffect(() => {
    loadRate(); // первый запрос
    const timer = setInterval(loadRate, pollInterval); // периодические обновления
    return () => clearInterval(timer);
  }, [pollInterval]);

  return { rate, error };
}
