import React from "react";

// Фильтры статистики — отключены до страхового лимита
export function StatsFilters() {
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)] shadow-[0_24px_70px_rgba(0,0,0,0.9)]">

      {/* Поля фильтров */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr_1.1fr] gap-4 mb-4">

        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-400">От даты</label>
          <input
            disabled
            type="datetime-local"
            className="w-full rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.06)]
                       px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-400">До даты</label>
          <input
            disabled
            type="datetime-local"
            className="w-full rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.06)]
                       px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-400">Способы оплаты</label>
          <select
            disabled
            className="w-full rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.06)]
                       px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
          >
            <option>Все способы</option>
          </select>
        </div>

      </div>

      {/* Нижняя строка */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr_auto_auto] gap-4 items-end">

        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-400">Тип оплаты</label>
          <select
            disabled
            className="w-full rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.06)]
                       px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
          >
            <option>Все типы</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-400">Устройства</label>
          <select
            disabled
            className="w-full rounded-xl bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.06)]
                       px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
          >
            <option>Все устройства</option>
          </select>
        </div>

        {/* ==== КНОПКА Применить ==== */}
        <div className="relative group">
          <button
            disabled
            className="h-10 px-5 rounded-xl bg-[rgba(60,60,60,0.4)]
                       text-sm font-semibold text-zinc-500 cursor-not-allowed
                       border border-[rgba(255,255,255,0.06)]"
          >
            Применить
          </button>

          <div
            className="absolute left-1/2 -translate-x-1/2 mt-2 w-52
                       bg-[rgba(20,20,25,0.95)] border border-[rgba(255,255,255,0.08)]
                       px-3 py-2 rounded-xl text-[11px] text-zinc-300 text-center
                       shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          >
            ⚠ Недоступно до полного страхового лимита
          </div>
        </div>

        {/* ==== КНОПКА Сбросить ==== */}
        <div className="relative group">
          <button
            disabled
            className="h-10 px-5 rounded-xl bg-[rgba(255,255,255,0.02)]
                       border border-[rgba(255,255,255,0.08)]
                       text-sm text-zinc-500 cursor-not-allowed"
          >
            Сбросить
          </button>

          <div
            className="absolute left-1/2 -translate-x-1/2 mt-2 w-52
                       bg-[rgba(20,20,25,0.95)] border border-[rgba(255,255,255,0.08)]
                       px-3 py-2 rounded-xl text-[11px] text-zinc-300 text-center
                       shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          >
            ⚠ Недоступно до полного страхового лимита
          </div>
        </div>

      </div>
    </div>
  );
}

export default function StatsTab() {
  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl font-semibold text-zinc-100">Статистика</h1>

      <StatsFilters />

       <div className="rounded-2xl p-4 sm:p-6 bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)] shadow-[0_24px_70px_rgba(0,0,0,0.9)]">
        <div className="text-sm text-zinc-400">
          Здесь будет детализированная статистика по операциям GeoTransfer.
        </div>
      </div>
    </div>
  );
}
