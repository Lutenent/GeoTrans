import { useState, useEffect } from "react";

export default function AdminPage() {
  const [adminPass, setAdminPass] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [tokens, setTokens] = useState([]);
  const [newToken, setNewToken] = useState("");

  const [users, setUsers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [insuranceInputs, setInsuranceInputs] = useState({});

  const [newRewardName, setNewRewardName] = useState("");
  const [newRewardPercent, setNewRewardPercent] = useState("");

  const [error, setError] = useState("");
  const [balanceInputs, setBalanceInputs] = useState({});


  const API = "/api/admin";

  // =====================================================
  //      ВОССТАНОВЛЕНИЕ СЕССИИ
  // =====================================================
  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "1") {
      setIsAuthorized(true);
    }
  }, []);

  // =====================================================
  //                    ЛОГИН
  // =====================================================
  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === "GetAdm") {
      localStorage.setItem("admin_auth", "1");
      setIsAuthorized(true);
    } else {
      setError("Неверный пароль администратора");
      setTimeout(() => setError(""), 1500);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthorized(false);
  };

  // =====================================================
  //            ЗАГРУЗКА ВСЕХ ДАННЫХ
  // =====================================================
  const loadAll = async () => {
    try {
      const [u, r, t] = await Promise.all([
        fetch(`${API}/users`).then((r) => r.json()),
        fetch(`${API}/rewards`).then((r) => r.json()),
        fetch(`${API}/tokens`).then((r) => r.json()),
      ]);

      setUsers(u.users || []);
      setRewards(r.rewards || []);
      setTokens(t.tokens || []);


    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    if (isAuthorized) loadAll();
  }, [isAuthorized]);

  // =====================================================
  // =====================================================
  //            ИЗМЕНЕНИЕ БАЛАНСА ПОЛЬЗОВАТЕЛЯ
  // =====================================================
  const setUserBalance = async (userId) => {
    const raw = balanceInputs[userId];
    const amount = Number(raw);

    if (!Number.isFinite(amount) || amount < 0) {
      alert("Введите корректную сумму (0 или больше)");
      return;
    }

    try {
      await fetch(`${API}/users/setBalance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });

      // очищаем поле ввода только для этого пользователя
      setBalanceInputs((prev) => ({
        ...prev,
        [userId]: "",
      }));

      // перезагружаем данные
      await loadAll();
      window.dispatchEvent(new Event("balance-updated"));
    } catch (err) {
      console.error("SET BALANCE ERROR:", err);
      alert("Ошибка при обновлении баланса");
    }
  };
  // =====================================================
  //        ИЗМЕНЕНИЕ СТРАХОВОГО ЛИМИТА ПОЛЬЗОВАТЕЛЯ
  // =====================================================
  const setUserInsuranceLimit = async (userId) => {
    const raw = insuranceInputs[userId];
    const limit = Number(raw);

    if (!Number.isFinite(limit) || limit < 0) {
      alert("Введите корректный лимит (0 или больше)");
      return;
    }

    try {
      await fetch(`${API}/users/insurance-limit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, insuranceLimit: limit }),
      });

      setInsuranceInputs((prev) => ({
        ...prev,
        [userId]: "",
      }));

      await loadAll();
      window.dispatchEvent(new Event("balance-updated"));
    } catch (err) {
      console.error("SET INSURANCE LIMIT ERROR:", err);
      alert("Ошибка при обновлении страхового лимита");
    }
  };



  //                     TOKENS
  // =====================================================
  const createToken = async () => {
    const token = newToken.trim();
    if (!token) return;

    await fetch(`${API}/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    setNewToken("");
    loadAll();
  };

  const autoToken = async () => {
    const res = await fetch(`${API}/tokens/auto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    console.log("Created auto token:", json.token);

    loadAll();
  };

  const deleteToken = async (token) => {
    await fetch(`${API}/tokens/${token}`, { method: "DELETE" });
    loadAll();
  };

  // =====================================================
  //                    USERS
  // =====================================================
  const deleteUser = async (id) => {
    await fetch(`${API}/users/${id}`, { method: "DELETE" });
    loadAll();
  };

  // =====================================================
  //              INSURANCE LIMIT
  // =====================================================
  const saveInsurance = async () => {
    await fetch(`${API}/config/limit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insuranceLimit }),
    });
    loadAll();
  };

  // =====================================================
  //                    REWARDS
  // =====================================================
  const addReward = async () => {
    if (!newRewardName.trim() || !newRewardPercent) return;

    await fetch(`${API}/rewards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newRewardName.trim(),
        percent: Number(newRewardPercent),
      }),
    });

    setNewRewardName("");
    setNewRewardPercent("");
    loadAll();
  };

  const deleteReward = async (id) => {
    await fetch(`${API}/rewards/${id}`, { method: "DELETE" });
    loadAll();
  };

  // =====================================================
  //                    LOGIN SCREEN
  // =====================================================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0d12] text-zinc-200 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-6 rounded-2xl"
        >
          <h1 className="text-xl font-bold mb-4 text-center">Вход в админ-панель</h1>

          <input
            type="password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="Введите пароль администратора"
            className="w-full bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.12)] px-3 py-2 rounded-lg mb-3 text-sm"
          />

          {error && <div className="text-red-400 text-xs mb-3">{error}</div>}

          <button
            type="submit"
            className="w-full bg-[#00a8ff] py-2 rounded-lg text-sm font-semibold"
          >
            Войти
          </button>
        </form>
      </div>
    );
  }

  // =====================================================
  //                FULL ADMIN PANEL
  // =====================================================
  return (
    <div className="min-h-screen bg-[#0b0d12] text-zinc-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Админ-панель</h1>

        <button
          onClick={logoutAdmin}
          className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg"
        >
          Выйти из админки
        </button>
      </div>

      {/* =====================================================
                        TOKENS
      ===================================================== */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">Инвайт-токены</h2>

        <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              placeholder="Введите токен вручную"
              className="flex-1 bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] px-3 py-2 rounded-lg text-sm"
            />

            <button
              onClick={createToken}
              className="bg-[#00a8ff] px-4 rounded-lg text-sm font-semibold"
            >
              Добавить
            </button>

            <button
              onClick={autoToken}
              className="bg-green-500/30 border border-green-500/40 text-green-300 px-4 rounded-lg text-sm font-semibold"
            >
              Авто-токен
            </button>
          </div>

          {/* TOKENS LIST */}
          <div className="space-y-2">
            {tokens.map((token, index) => (
              <div
                key={token + index}
                className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-2 rounded-lg"
              >
                <div className="text-sm font-mono">{token}</div>

                <button
                  onClick={() => deleteToken(token)}
                  className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg hover:bg-red-500/30"
                >
                  Удалить
                </button>
              </div>
            ))}

            {tokens.length === 0 && (
              <div className="text-zinc-500 text-sm">Токенов нет…</div>
            )}
          </div>
        </div>
      </section>

      {/* USERS */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">Пользователи</h2>

        <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center border-b border-[rgba(255,255,255,0.05)] py-2"
            >
              <div>
                <div className="text-sm font-medium">{u.name}</div>
                <div className="text-xs text-zinc-400">{u.email}</div>

                {/* 🔥 Добавлено: отображение пароля */}
                <div className="text-xs text-zinc-500 mt-1">
                  Пароль: <span className="text-zinc-300 font-mono">{u.password}</span>
                </div>
                {u.balance && (
                  <div className="text-xs text-zinc-500 mt-1">
                    Баланс:{" "}
                    <span className="text-zinc-300 font-mono">
                      {u.balance.main ?? 0} USDT (страховой: {u.balance.insurance ?? 0} / лимит {u.insuranceLimit ?? 0})
                    </span>
                  </div>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Сумма пополнения"
                    value={balanceInputs[u.id] ?? ""}
                    onChange={(e) =>
                      setBalanceInputs((prev) => ({
                        ...prev,
                        [u.id]: e.target.value,
                      }))
                    }
                    className="w-40 bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.15)] px-2 py-1 rounded-md text-xs"
                  />
            
                  <button
                  className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg hover:bg-emerald-500/30"
                    onClick={async () => {
                      await setUserBalance(u.id);
                      await loadAll();
                      //await loadUsers();   // ← ДОБАВИЛИ
                    }}
                  >
                    Обновить баланс
                  </button>

                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Страховой лимит"
                    value={insuranceInputs[u.id] ?? ""}
                    onChange={(e) =>
                      setInsuranceInputs((prev) => ({
                        ...prev,
                        [u.id]: e.target.value,
                      }))
                    }
                    className="w-40 bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.15)] px-2 py-1 rounded-md text-xs"
                  />
                  <button
                    onClick={() => setUserInsuranceLimit(u.id)}
                    className="px-3 py-1 bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs rounded-lg hover:bg-sky-500/30"
                  >
                    Обновить лимит
                  </button>
                </div>


              </div>

              <button
                onClick={() => deleteUser(u.id)}
                className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg hover:bg-red-500/30"
              >
                Удалить
              </button>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-zinc-500 text-sm">Пользователей нет…</div>
          )}
        </div>
      </section>



      {/* REWARDS */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Торговые вознаграждения</h2>

        <div className="rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] p-4">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Название"
              value={newRewardName}
              onChange={(e) => setNewRewardName(e.target.value)}
              className="flex-1 bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] px-3 py-2 rounded-lg text-sm"
            />

            <input
              type="number"
              placeholder="%"
              value={newRewardPercent}
              onChange={(e) => setNewRewardPercent(e.target.value)}
              className="w-20 bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] px-3 py-2 rounded-lg text-sm"
            />

            <button
              onClick={addReward}
              className="bg-[#00a8ff] px-4 rounded-lg text-sm font-semibold"
            >
              Добавить
            </button>
          </div>

          <div className="space-y-2">
            {rewards.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center bg-[rgba(255,255,255,0.05)] p-2 rounded-lg"
              >
                <div className="text-sm">
                  {r.name} — {r.percent}%
                </div>

                <button
                  onClick={() => deleteReward(r.id)}
                  className="px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg hover:bg-red-500/30"
                >
                  Удалить
                </button>
              </div>
            ))}

            {rewards.length === 0 && (
              <div className="text-zinc-500 text-sm">
                Вознаграждений нет…
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}