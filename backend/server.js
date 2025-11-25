// backend/server.js

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// БАЗОВАЯ НАСТРОЙКА
// ---------------------------------------------------------------------------

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешаем запросы с фронта (dev и прод)
app.use(
  cors({
    origin: "*", // можно сузить до ['http://localhost:5173', 'https://new-tome.ru'] если нужно
  })
);
app.use(express.json());

// __dirname в режиме ES-модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Все JSON-файлы лежат в backend/data
const DATA_DIR = path.join(__dirname, "data");

// Пути к файлам
const USERS_PATH = path.join(DATA_DIR, "users.json");
const TOKENS_PATH = path.join(DATA_DIR, "token.json");
const CONFIG_PATH = path.join(DATA_DIR, "config.json");
const REWARDS_PATH = path.join(DATA_DIR, "rewards.json");

// ---------------------------------------------------------------------------
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ РАБОТЫ С JSON
// ---------------------------------------------------------------------------

function ensureFile(file, fallback) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  }
}

function readJson(file, fallback) {
  try {
    ensureFile(file, fallback);
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  ensureFile(file, data);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---------------------------------------------------------------------------
// ПАРСЕР КУРСА USDT/RUB С HTX
// ---------------------------------------------------------------------------
// Берём отсюда: https://www.htx.com/ru-ru/price/usdt/
// Блок: <div class="market_item-name__1qaKt">Текущая цена</div>
// рядом <div class="market_item-price__V8sme"><span>80.96</span></div>
// ---------------------------------------------------------------------------

async function getUsdtRate() {
  try {
    const url = "https://www.htx.com/ru-ru/price/usdt/";
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/123.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!resp.ok) {
      console.error("HTX HTTP error:", resp.status);
      return null;
    }

    const html = await resp.text();
    const $ = cheerio.load(html);

    let priceText = null;

    $(".market_item___qsfk").each((_, el) => {
      const label = $(el)
        .find(".market_item-name__1qaKt")
        .text()
        .trim();

      if (label.includes("Текущая цена")) {
        priceText = $(el)
          .find(".market_item-price__V8sme span")
          .first()
          .text()
          .trim();
      }
    });

    if (!priceText) {
      console.log("Не нашли блок 'Текущая цена'");
      return null;
    }

    const normalized = priceText.replace(",", ".").replace(/\s+/g, "");
    const rate = parseFloat(normalized);

    if (isNaN(rate)) {
      console.log("Не удалось распарсить курс:", priceText);
      return null;
    }

    console.log("HTX USDT/RUB:", rate);
    return rate;
  } catch (err) {
    console.error("Ошибка парсинга HTX:", err);
    return null;
  }
}

// Эндпоинт для фронта
app.get("/api/usdt-rate", async (_req, res) => {
  const rate = await getUsdtRate();
  if (!rate) {
    return res.status(500).json({ ok: false, error: "Парсер вернул null" });
  }
  res.json({ ok: true, rate });
});

// ---------------------------------------------------------------------------
// СЕРВИСНЫЙ ЭНДПОИНТ
// ---------------------------------------------------------------------------

app.get("/health", (_req, res) => res.json({ ok: true }));

// ---------------------------------------------------------------------------
// ПРОВЕРКА ТОКЕНА /data/token
// ---------------------------------------------------------------------------

app.post("/data/token", (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ message: "Токен обязателен" });
  }

  const { tokens = [] } = readJson(TOKENS_PATH, { tokens: [] });

  if (tokens.includes(token)) {
    return res.json({ ok: true, message: "Токен принят" });
  }

  return res.status(400).json({ message: "Неверный токен" });
});

// ---------------------------------------------------------------------------
// РЕГИСТРАЦИЯ БЕЗ ХЭША ПАРОЛЯ + ПРОВЕРКА НА 6 СИМВОЛОВ
// ---------------------------------------------------------------------------

app.post("/api/register", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "Укажите имя и пароль" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Пароль должен быть не менее 6 символов" });
  }

  const db = readJson(USERS_PATH, { users: [] });

  if (db.users.some((u) => u.username === username)) {
    return res.status(409).json({ message: "Пользователь уже существует" });
  }

  // ❗ Пароль сохраняем в чистом виде по твоей просьбе
  db.users.push({
    id: Date.now(),
    username,
    password,
  });

  writeJson(USERS_PATH, db);

  res.json({ ok: true, message: "Регистрация прошла успешно" });
});

// ---------------------------------------------------------------------------
// ЛОГИН
// ---------------------------------------------------------------------------

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  const db = readJson(USERS_PATH, { users: [] });
  const user = db.users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Неверный логин или пароль" });
  }

  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// ADMIN API: USERS / TOKENS / CONFIG / REWARDS
// ---------------------------------------------------------------------------

// USERS (для админки — здесь и видно пароль)
// Один пользователь по ID
app.get("/api/admin/user", (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const db = readJson(USERS_PATH, { users: [] });
  const user = db.users.find(u => String(u.id) === String(id));

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});


// TOKENS
app.get("/api/admin/tokens", (_req, res) => {
  const db = readJson(TOKENS_PATH, { tokens: [] });
  res.json(db.tokens || []);
});

app.post("/api/admin/tokens", (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: "token required" });

  const db = readJson(TOKENS_PATH, { tokens: [] });
  if (!db.tokens.includes(token)) {
    db.tokens.push(token);
  }

  writeJson(TOKENS_PATH, db);
  res.json({ ok: true });
});

// CONFIG
app.get("/api/admin/config", (_req, res) => {
  const cfg = readJson(CONFIG_PATH, { insuranceLimit: 100 });
  res.json(cfg);
});

app.post("/api/admin/config", (req, res) => {
  writeJson(CONFIG_PATH, req.body || {});
  res.json({ ok: true });
});

// REWARDS
app.get("/api/admin/rewards", (_req, res) => {
  const r = readJson(REWARDS_PATH, { rewards: [] });
  res.json(r.rewards || []);
});

app.post("/api/admin/rewards", (req, res) => {
  const r = readJson(REWARDS_PATH, { rewards: [] });
  r.rewards.push(req.body || {});
  writeJson(REWARDS_PATH, r);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// START
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Backend запущен → http://localhost:${PORT}`);
});
