import { useEffect, useState } from "react";
import { fmt } from "../utils/format";
import { WALLET_SHORT } from "../utils/constants";
import { allTransactions } from "../data/allTransactions";
import { fetchRewards } from "../api/adminApi";

// ----------------- HOME OVERVIEW -----------------
export function HomeOverview({ balance, user }) {
  const [rewards, setRewards] = useState([]);

  const insuranceLimit = user?.insuranceLimit ?? 0;
  const insuranceBalance = user?.balance?.insurance ?? 0;

  useEffect(() => {
    async function load() {
      try {
        const rewardsData = await fetchRewards();
        setRewards(
          rewardsData && Array.isArray(rewardsData.rewards)
            ? rewardsData.rewards
            : []
        );
      } catch (e) {
        console.error("Ошибка загрузки HomeTab:", e);
      }
    }
    load();
  }, []);

  return (
    <div className="relative rounded-2xl p-4 sm:p-5 bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)] shadow-[0_24px_70px_rgba(0,0,0,0.9)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          {/* Баланс + логотип быка */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[rgba(255,255,255,0.2)]
                            bg-[rgba(224,70,70,0.18)]
                            flex items-center justify-center
                            shadow-[0_8px_18px_rgba(0,0,0,0.75)]">
              <img
                src="/bull-logo.png"
                alt="GeoTransfer"
                className="w-7 h-7 md:w-8 md:h-8 object-contain"
              />
            </div>

            <div>
              <div className="text-xs text-zinc-400 uppercase tracking-wide">
                Текущий баланс GeoTransfer
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-zinc-50">{fmt(balance)}</div>
                <div className="text-sm text-zinc-400">USDT</div>
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                Кошелёк: <span className="text-zinc-200">{WALLET_SHORT}</span>
              </div>
            </div>
          </div>

          {/* Лимиты */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 mt-2 sm:mt-0">
            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(224,70,70,0.16)] text-xs">
                  🛡️
                </span>
                Страховой лимит
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-100">
                {`${fmt(insuranceBalance)} / ${fmt(insuranceLimit)} USDT`}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255,123,123,0.2)] text-xs">
                  🔒
                </span>
                Заблокировано
              </div>
              <div className="mt-1 text-sm font-semibold text-[#ff9b9b]">
                {fmt(insuranceBalance)} <span className="text-xs text-zinc-400">USDT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Вознаграждения */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Программы вознаграждений</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {rewards.length === 0 && (
              <span className="text-xs text-zinc-500">Нет вознаграждений…</span>
            )}

            {rewards.map((r) => (
              <span
                key={r.id}
                className="px-3 py-1 rounded-lg bg-[rgba(22,23,32,0.98)] border border-[rgba(255,255,255,0.06)] text-xs text-zinc-100"
              >
                {r.name}: {r.percent}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- TRANSACTIONS LIST -----------------
export function TransactionsList({ items, page, totalPages, setPage }) {
  return (
    <div
      className="relative rounded-2xl p-4 sm:p-5 
                 bg-[rgba(12,13,20,0.96)]
                 border border-[rgba(255,255,255,0.06)]
                 shadow-[0_24px_70px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="font-semibold text-lg text-zinc-50">
          История операций GeoTransfer
        </div>
      </div>

      <ul className="space-y-3 select-none">
        {items.map((tx) => (
          <li
            key={tx.id}
            className="flex items-center justify-between 
                       p-4 rounded-xl
                       bg-[rgba(18,19,27,0.98)]
                       border border-[rgba(255,255,255,0.06)]
                       shadow-[0_18px_40px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl
                           bg-[rgba(30,31,40,0.98)]
                           border border-[rgba(255,255,255,0.12)]
                           flex items-center justify-center text-xl"
              >
                {tx.type === "Вход" ? "⬇" : "⬆"}
              </div>

              <div>
                <div className="font-medium text-zinc-50 text-[15px]">
                  {tx.type} — {tx.dest}
                </div>
                <div className="text-xs text-zinc-500">
                  {Math.abs(tx.amount)} USDT · {tx.date}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`font-semibold ${
                  tx.amount > 0 ? "text-emerald-300" : "text-[#ff9b9b]"
                }`}
              >
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount} USDT
              </div>
              <div className="text-xs text-zinc-500">Статус: {tx.status}</div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-2 mt-5">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded-lg bg-[rgba(40,18,22,0.9)] text-xs text-zinc-100 border border-[rgba(255,255,255,0.12)] disabled:opacity-30"
        >
          ← Назад
        </button>

        <span className="text-zinc-400 text-sm">
          Страница {page} из {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded-lg bg-[rgba(40,18,22,0.9)] text-xs text-zinc-100 border border-[rgba(255,255,255,0.12)] disabled:opacity-30"
        >
          Далее →
        </button>
      </div>
    </div>
  );
}

// ----------------- HOME TAB -----------------
export default function HomeTab({ balance, txs, user }) {
  const [page, setPage] = useState(1);
  const perPage = 20;

  const sourceItems =
    allTransactions && allTransactions.length > 0 ? allTransactions : txs || [];

  const totalPages = Math.max(1, Math.ceil(sourceItems.length / perPage));
  const paginatedItems = sourceItems.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 sm:py-5 lg:px-0">
      <HomeOverview balance={balance} user={user} />
      <TransactionsList
        items={paginatedItems}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </div>
  );
}
