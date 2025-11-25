import React from "react";
import LockedFeature from "../components/LockedFeature";

export default function DetailsTab() {
  const emptyRows = Array.from({ length: 10 }); // 10 пустых строк

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl font-semibold text-zinc-100 mb-2">Реквизиты GeoTransfer</h1>


      {/* Заблокированная кнопка */}
      <LockedFeature title="Добавить реквизит" />

      {/* Таблица реквизитов */}
      
      <div className="overflow-x-auto rounded-2xl bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)]">
        <table className="w-full table-auto text-center">
          <thead className="bg-[rgba(255,255,255,0.03)]">
            <tr>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Реквизит</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Устройство</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Группа</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Лимиты по суммам</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">По объёму</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">По кол.</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Одновременно</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Статус</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Действия</th>
            </tr>
          </thead>

          <tbody>
            {emptyRows.map((_, index) => (
              <tr
                key={index}
                className="border-t border-[rgba(255,255,255,0.02)]"
              >
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">—</td>
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">—</td>
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">—</td>
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">—</td>
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">—</td>
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">—</td>
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">—</td>
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">Неактивен</td>

                <td className="px-4 py-3 text-sm text-center align-middle">

                  {/* Две кнопки с тултипами */}
                  <div className="flex justify-center gap-3">

                    {/* Редактировать */}
                    <div className="relative group inline-block">
                      <button
                        disabled
                        className="text-zinc-600 cursor-not-allowed"
                      >
                        Редактировать
                      </button>

                      <div
                        className="
                          absolute left-1/2 -translate-x-1/2 mt-2
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-200
                          pointer-events-none
                          bg-[rgba(20,20,25,0.95)]
                          border border-[rgba(255,255,255,0.08)]
                          px-3 py-2 rounded-xl w-44 text-[11px]
                          text-zinc-300 shadow-lg z-20
                        "
                      >
                        ⚠ Недоступно. Функция доступна при полном страховом лимите
                      </div>
                    </div>

                    {/* Удалить */}
                    <div className="relative group inline-block">
                      <button
                        disabled
                        className="text-zinc-600 cursor-not-allowed"
                      >
                        Удалить
                      </button>

                      <div
                        className="
                          absolute left-1/2 -translate-x-1/2 mt-2
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-200
                          pointer-events-none
                          bg-[rgba(20,20,25,0.95)]
                          border border-[rgba(255,255,255,0.08)]
                          px-3 py-2 rounded-xl w-44 text-[11px]
                          text-zinc-300 shadow-lg z-20
                        "
                      >
                        ⚠ Удаление заблокировано до полного страхового лимита
                      </div>
                    </div>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
