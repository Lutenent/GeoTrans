import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { fmt } from "../utils/format";
import { APP_VERSION } from "../utils/constants";
import { useUsdtRubRate } from "../hooks/useUsdtRubRate";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar({
  activeTab,
  setActiveTab,
  onDeposit,
  onWithdraw,
  targetBalance,
  handleLogout,
}) {
  const navItems = [
    { id: "home", title: "Главная", icon: "🏠" },
    { id: "deals", title: "Сделки", icon: "🔁" },
    { id: "stats", title: "Статистика", icon: "📊" },
    { id: "details", title: "Реквизиты", icon: "📄" },
    { id: "employees", title: "Сотрудники", icon: "👥" },
    { id: "settings", title: "Настройки", icon: "⚙️" },
  ];

  const [mode, setMode] = useState("in");

  const { rate: usdtRub, error } = useUsdtRubRate();
  const { user } = useAuth();

  const mainBalance =
    (user && user.balance && typeof user.balance === "object"
      ? user.balance.main
      : user && typeof user.balance === "number"
        ? user.balance
        : 0) ?? 0;

  return (
    <aside
      className="
        flex flex-col justify-between
        h-full p-4 rounded-3xl
        bg-[rgba(10,10,15,0.98)] border border-[rgba(255,255,255,0.06)]
        backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.95)]
      "
    >
      {/* === ВЕРХ === */}
      <div>
        {/* Логотип / бренд */}
        <div className="flex items-center gap-3 mb-4">
          
            <img
              src="/bull-logo.png"
              alt="GeoTransfer"
              className="w-5 h-5 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-50">
              GeoTransfer
            </span>
            <span className="text-[11px] text-zinc-500">
              Платёжный кабинет
            </span>
          </div>
       

        {/* Навигация */}
        <nav className="flex flex-col gap-1 relative">
          {navItems.map(({ id, title, icon }) => {
            const isActive = activeTab === id;

            return (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  relative flex items-center gap-3 px-3 py-2 rounded-lg
                  text-sm transition-all duration-200
                  ${isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100"}
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.96 }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-nav"
                      className="absolute inset-0 rounded-lg bg-[rgba(224,70,70,0.16)] border border-[rgba(255,255,255,0.2)]"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10 text-lg">{icon}</span>
                <span className="relative z-10">{title}</span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* === НИЗ === */}
      <div className="flex flex-col gap-4 mt-6">
        {/* Переключатель Приём / Выплаты */}
        <div className="flex items-center justify-between gap-3 px-1">
          <button
            onClick={() => setMode("in")}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition
              ${mode === "in"
                ? "bg-[#e04646] text-white shadow-[0_0_18px_rgba(224,70,70,0.7)]"
                : "bg-[rgba(255,255,255,0.04)] text-zinc-400 hover:text-zinc-200"
              }
            `}
          >
            <span
              className={`
                w-4 h-4 rounded-full transition
                ${mode === "in" ? "bg-white" : "bg-zinc-600"}
              `}
            />
            Приём
          </button>

          <button
            onClick={() => setMode("out")}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition
              ${mode === "out"
                ? "bg-[#ff5a5a] text-white shadow-[0_0_18px_rgba(226,110,110,0.7)]"
                : "bg-[rgba(255,255,255,0.04)] text-zinc-400 hover:text-zinc-200"
              }
            `}
          >
            <span
              className={`
                w-4 h-4 rounded-full transition
                ${mode === "out" ? "bg-white" : "bg-zinc-600"}
              `}
            />
            Выплаты
          </button>
        </div>

        {/* Курс USDT */}
        <div className="rounded-2xl bg-[rgba(16,17,23,0.98)] border border-[rgba(255,255,255,0.06)] px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-400">Курс Tether TRC20</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(5,6,10,0.9)] text-zinc-400">
              1 USDT
            </span>
          </div>
          <div className="text-sm font-semibold text-zinc-100">
            {error && "Ошибка загрузки"}
            {!error && usdtRub === null && "Загрузка…"}
            {!error && usdtRub !== null && `${usdtRub.toFixed(2)} RUB`}
          </div>
        </div>

        {/* Баланс */}
        <div className="rounded-2xl bg-[rgba(16,17,23,0.98)] border border-[rgba(255,255,255,0.06)] px-4 py-3">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs text-zinc-400">Баланс</span>
    <span className="text-sm font-semibold text-[#15803d]">
      {fmt(mainBalance)} USDT
    </span>
  </div>
  <div className="flex gap-2">
    <button
      onClick={onDeposit}
      className="
        flex-1 px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.16)]
        bg-[rgba(255,255,255,0.02)] text-xs text-zinc-100
        hover:bg-[rgba(255,255,255,0.06)]
      "
    >
      Пополнить
    </button>
    <button
      onClick={onWithdraw}
      className="
        flex-1 px-3 py-2 rounded-lg bg-[#e04646]
        text-xs font-semibold text-white shadow-[0_10px_30px_rgba(224,70,70,0.65)]
        hover:bg-[#eb5a5a]
      "
    >
      Вывести
    </button>
  </div>
</div>


        {/* Кнопка выхода */}
        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full px-3 py-2 rounded-xl
            bg-[rgba(255,255,255,0.02)]
            border border-[rgba(255,255,255,0.08)]
            text-zinc-300 text-sm
            hover:bg-[rgba(255,255,255,0.06)]
            transition
          "
        >
          Выйти
        </button>

        {/* Версия */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
          <span>GeoTransfer · v{APP_VERSION}</span>
          <button className="w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-zinc-300 text-sm">
            ?
          </button>
        </div>
      </div>
    </aside>
  );
}
