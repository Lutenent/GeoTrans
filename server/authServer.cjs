const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const https = require('https');

// ------------------------
// Базовые настройки
// ------------------------
const PORT = process.env.PORT || 5000;

// Корень проекта = папка, где лежит package.json
const ROOT_DIR = path.resolve(__dirname, '..');
// Все рабочие json-файлы храним тут:
const DATA_DIR = path.join(ROOT_DIR, 'backend', 'data');

const USERS_PATH   = path.join(DATA_DIR, 'users.json');
const TOKENS_PATH  = path.join(DATA_DIR, 'token.json');
const REWARDS_PATH = path.join(DATA_DIR, 'rewards.json');
const CONFIG_PATH  = path.join(DATA_DIR, 'config.json');

// ------------------------
// Вспомогательные функции для работы с JSON
// ------------------------
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function ensureFile(filePath, defaultData) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

async function ensureAllFiles() {
  await ensureDir(DATA_DIR);
  await Promise.all([
    ensureFile(USERS_PATH,   { users: [] }),
    ensureFile(TOKENS_PATH,  { tokens: [] }),
    ensureFile(REWARDS_PATH, { rewards: [] }),
    ensureFile(CONFIG_PATH,  { insuranceLimit: 0 }),
  ]);
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('readJson error for', filePath, e);
    return fallback;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function safeUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,

    // пароль — если надо для админки
    password: u.password,

    // добавляем поддержку баланса ↓↓↓
    balance: u.balance || {
      main: 0,
      insurance: 0
    },

    // добавляем страховой лимит
    insuranceLimit: u.insuranceLimit || 0
  };
}


// ------------------------
// Инициализация Express
// ------------------------
const app = express();

app.use(cors());
app.use(express.json());

// ------------------------
// Healthcheck
// ------------------------
app.get('/api/health', async (_req, res) => {
  await ensureAllFiles();
  res.json({ ok: true });
});

// ------------------------
// Auth / регистрация
// ------------------------
async function handleCheckToken(req, res) {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ message: 'Токен обязателен' });
  }

  await ensureAllFiles();
  const { tokens = [] } = await readJson(TOKENS_PATH, { tokens: [] });
  const valid = tokens.includes(token);
  return res.json({ valid });
}

app.post('/api/check-token', handleCheckToken);
app.post('/check-token', handleCheckToken);

async function handleRegister(req, res) {
  const { name, email, password, token } = req.body || {};

  if (!name || !email || !password || !token) {
    return res.status(400).json({ message: 'Заполните все поля и токен' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Пароль должен быть минимум 6 символов' });
  }

  await ensureAllFiles();

  // проверяем токен
  const tokensData = await readJson(TOKENS_PATH, { tokens: [] });
  if (!tokensData.tokens.includes(token)) {
    return res.status(400).json({ message: 'Неверный или уже использованный токен' });
  }

  // проверяем email
  const usersData = await readJson(USERS_PATH, { users: [] });
  if (usersData.users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
  }

  // ❗❗❗ БЕЗ ХЭШИРОВАНИЯ — СОХРАНЯЕМ ПАРОЛЬ ТАК КАК ЕСТЬ ❗❗❗
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,       // ← ПАРОЛЬ В ЧИСТОМ ВИДЕ
    createdAt: new Date().toISOString(),
  };

  usersData.users.push(newUser);
  await writeJson(USERS_PATH, usersData);

  // токен одноразовый — удаляем
  tokensData.tokens = tokensData.tokens.filter((t) => t !== token);
  await writeJson(TOKENS_PATH, tokensData);

  return res.json({ user: safeUser(newUser) });
}

app.post('/api/register', handleRegister);
app.post('/register', handleRegister);

async function handleLogin(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Введите email и пароль' });
  }

  await ensureAllFiles();

  const usersData = await readJson(USERS_PATH, { users: [] });
  const user = usersData.users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  // ❗❗❗ СРАВНИВАЕМ ЧИСТЫЕ ПАРОЛИ ❗❗❗
  if (user.password !== password) {
    return res.status(401).json({ message: 'Неверный логин или пароль' });
  }

  return res.json({ user: safeUser(user) });
}

app.post('/api/login', handleLogin);
app.post('/login', handleLogin);

// ------------------------
// Admin-роуты
// ------------------------

// Получить актуального пользователя по ID
app.get('/api/user/me', async (req, res) => {
  try {
    const userId = Number(req.query.userId);

    if (!Number.isFinite(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    await ensureAllFiles();
    const data = await readJson(USERS_PATH, { users: [] });
    const users = data.users || [];
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user: safeUser(user) });
  } catch (e) {
    console.error('GET /api/user/me error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

const adminRouter = express.Router();

// USERS
adminRouter.get('/users', async (_req, res) => {
  await ensureAllFiles();
  const data = await readJson(USERS_PATH, { users: [] });
  res.json({ users: data.users.map(safeUser) });
});

adminRouter.delete('/users/:id', async (req, res) => {
  await ensureAllFiles();
  const id = Number(req.params.id);
  const data = await readJson(USERS_PATH, { users: [] });
  const before = data.users.length;
  data.users = data.users.filter((u) => u.id !== id);
  if (data.users.length === before) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }
  await writeJson(USERS_PATH, data);
  res.json({ ok: true });
});


// ADMIN: установить баланс пользователя (сначала страховой лимит, остаток — на баланс)
// ADMIN: установить баланс пользователя (страховой → основной)
adminRouter.post('/users/setBalance', async (req, res) => {
  try {
    const { userId, amount } = req.body || {};

    const numericAmount = Number(amount);
    const numericId = Number(userId);

    if (!Number.isFinite(numericAmount) || numericAmount < 0 || !Number.isFinite(numericId)) {
      return res.status(400).json({ message: 'Неверные параметры' });
    }

    await ensureAllFiles();

    const data = await readJson(USERS_PATH, { users: [] });
    const users = data.users || [];

    const user = users.find((u) => u.id === numericId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Извлекаем значения
    const limit = Number(user.insuranceLimit ?? 0);
    const insurance = Number(user.balance?.insurance ?? 0);
    const main = Number(user.balance?.main ?? 0);

    let remaining = numericAmount;

    // ======= 1. Заполняем страховой лимит =======
    let insuranceToAdd = 0;

    if (limit > insurance) {
      const need = limit - insurance;
      insuranceToAdd = Math.min(need, remaining);
      remaining -= insuranceToAdd;
    }

    const newInsurance = insurance + insuranceToAdd;

    // ======= 2. Остаток — в основной баланс =======
    const newMain = main + remaining;

    // Сохраняем
    user.balance = {
      main: newMain,
      insurance: newInsurance
    };

    await writeJson(USERS_PATH, data);

    return res.json({
      ok: true,
      user: safeUser(user)
    });

  } catch (e) {
    console.error('admin /users/setBalance error:', e);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ADMIN: установить индивидуальный страховой лимит пользователя
adminRouter.post('/users/insurance-limit', async (req, res) => {
  try {
    const { userId, insuranceLimit } = req.body || {};

    const numericLimit = Number(insuranceLimit);
    const numericId = Number(userId);

    if (!Number.isFinite(numericLimit) || numericLimit < 0 || !Number.isFinite(numericId)) {
      return res.status(400).json({ message: 'Неверные параметры' });
    }

    await ensureAllFiles();

    const data = await readJson(USERS_PATH, { users: [] });
    const users = data.users || [];

    const user = users.find((u) => u.id === numericId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.insuranceLimit = numericLimit;

    await writeJson(USERS_PATH, data);

    return res.json({
      ok: true,
      user: safeUser(user),
    });
  } catch (e) {
    console.error('admin /users/insurance-limit error:', e);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});




// CONFIG
adminRouter.get('/config', async (_req, res) => {
  await ensureAllFiles();
  const cfg = await readJson(CONFIG_PATH, { insuranceLimit: 0 });
  res.json({ insuranceLimit: cfg.insuranceLimit ?? 0 });
});

adminRouter.patch('/config/limit', async (req, res) => {
  await ensureAllFiles();
  const { insuranceLimit, value } = req.body || {};
  const newLimit = Number(
    typeof insuranceLimit !== 'undefined' ? insuranceLimit : value,
  );
  if (!Number.isFinite(newLimit) || newLimit < 0) {
    return res.status(400).json({ message: 'Некорректное значение лимита' });
  }
  const cfg = await readJson(CONFIG_PATH, { insuranceLimit: 0 });
  cfg.insuranceLimit = newLimit;
  await writeJson(CONFIG_PATH, cfg);
  res.json({ insuranceLimit: cfg.insuranceLimit });
});

// REWARDS
adminRouter.get('/rewards', async (_req, res) => {
  await ensureAllFiles();
  const data = await readJson(REWARDS_PATH, { rewards: [] });
  res.json({ rewards: data.rewards });
});

adminRouter.post('/rewards', async (req, res) => {
  await ensureAllFiles();
  const { name, percent } = req.body || {};
  if (!name) {
    return res.status(400).json({ message: 'Название обязательно' });
  }
  const pct = Number(percent);
  if (!Number.isFinite(pct)) {
    return res.status(400).json({ message: 'Процент должен быть числом' });
  }
  const data = await readJson(REWARDS_PATH, { rewards: [] });
  const reward = {
    id: Date.now(),
    name,
    percent: pct,
  };
  data.rewards.push(reward);
  await writeJson(REWARDS_PATH, data);
  res.json({ reward });
});

adminRouter.delete('/rewards/:id', async (req, res) => {
  await ensureAllFiles();
  const id = Number(req.params.id);
  const data = await readJson(REWARDS_PATH, { rewards: [] });
  const before = data.rewards.length;
  data.rewards = data.rewards.filter((r) => r.id !== id);
  if (data.rewards.length === before) {
    return res.status(404).json({ message: 'Награда не найдена' });
  }
  await writeJson(REWARDS_PATH, data);
  res.json({ ok: true });
});

// TOKENS
adminRouter.get('/tokens', async (_req, res) => {
  await ensureAllFiles();
  const data = await readJson(TOKENS_PATH, { tokens: [] });
  res.json({ tokens: data.tokens });
});

adminRouter.post('/tokens', async (req, res) => {
  await ensureAllFiles();
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ message: 'Токен обязателен' });
  }
  const data = await readJson(TOKENS_PATH, { tokens: [] });
  if (!data.tokens.includes(token)) {
    data.tokens.push(token);
    await writeJson(TOKENS_PATH, data);
  }
  res.json({ tokens: data.tokens });
});

function generateTokenString() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString(36).slice(-4).toUpperCase();
  return `TKN-${rand}${ts}`;
}

adminRouter.post('/tokens/auto', async (_req, res) => {
  await ensureAllFiles();
  const data = await readJson(TOKENS_PATH, { tokens: [] });
  const token = generateTokenString();
  data.tokens.push(token);
  await writeJson(TOKENS_PATH, data);
  res.json({ token });
});

adminRouter.delete('/tokens/:token', async (req, res) => {
  await ensureAllFiles();
  const token = req.params.token;
  const data = await readJson(TOKENS_PATH, { tokens: [] });
  const before = data.tokens.length;
  data.tokens = data.tokens.filter((t) => t !== token);
  if (data.tokens.length === before) {
    return res.status(404).json({ message: 'Токен не найден' });
  }
  await writeJson(TOKENS_PATH, data);
  res.json({ ok: true });
});

adminRouter.delete('/tokens', async (_req, res) => {
  await ensureAllFiles();
  const data = { tokens: [] };
  await writeJson(TOKENS_PATH, data);
  res.json({ ok: true });
});

// Курс USDT/RUB
function fetchUsdtRubRate() {
  // Берём курс с Rapira: https://api.rapira.net/open/market/rates
  const url = 'https://api.rapira.net/open/market/rates';

  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Accept: 'application/json',
          },
        },
        (resp) => {
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () => {
            try {
              const json = JSON.parse(data);

              if (!json || !Array.isArray(json.data)) {
                return reject(new Error('Bad Rapira response schema'));
              }

              const usdtRub = json.data.find(
                (item) => item.symbol === 'USDT/RUB'
              );

              if (!usdtRub || typeof usdtRub.close !== 'number') {
                return reject(new Error('USDT/RUB pair not found'));
              }

              // close — актуальная цена USDT в RUB
              resolve(usdtRub.close);
            } catch (e) {
              reject(e);
            }
          });
        }
      )
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function handleUsdtRate(_req, res) {
  try {
    const rate = await fetchUsdtRubRate();

    const correctedRate = rate;   // <<< УМЕНЬШАЕМ КУРС НА 10 РУБЛЕЙ

    res.json({ rate: correctedRate });
  } catch (e) {
    console.error('USDT rate error', e);
    res.status(500).json({ message: 'Не удалось получить курс', rate: null });
  }
}


app.get('/api/usdt-rate', handleUsdtRate);
app.get('/usdt-rate', handleUsdtRate);

// Вешаем админ-роутер
app.use('/api/admin', adminRouter);
app.use('/admin', adminRouter);

// ------------------------
// Запуск сервера
// ------------------------
async function start() {
  await ensureAllFiles();
  app.listen(PORT, () => {
    console.log(`Auth/ADMIN API server is running on port ${PORT}`);
    console.log(`Data directory: ${DATA_DIR}`);
  });
}

start().catch((e) => {
  console.error('Failed to start server', e);
  process.exit(1);
});