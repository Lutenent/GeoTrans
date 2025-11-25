import React from "react";
import LockedFeature from "../components/LockedFeature";

export default function EmployeesTab() {
  const emptyRows = Array.from({ length: 10 });

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl font-semibold text-zinc-100">Сотрудники GeoTransfer</h1>

      {/* Кнопка добавления — заблокирована */}
      <LockedFeature title="Добавить сотрудника" />

      {/* Таблица сотрудников */}
      <div className="overflow-x-auto rounded-2xl bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)]">
        <table className="w-full table-auto text-center">
          <thead className="bg-[rgba(255,255,255,0.03)]">
            <tr>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Имя</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Email</th>
              <th className="px-4 py-2 text-xs text-zinc-400 text-center">Действия</th>
            </tr>
          </thead>

          <tbody>
            {emptyRows.map((_, index) => (
              <tr
                key={index}
                className="border-t border-[rgba(255,255,255,0.02)]"
              >
                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">
                  —
                </td>

                <td className="px-4 py-3 text-sm text-zinc-600 text-center align-middle">
                  —
                </td>

                <td className="px-4 py-3 text-sm text-center align-middle">

                  {/* Кнопка + тултип */}
                  <div className="relative group inline-block">
                    <button
                      disabled
                      className="text-zinc-600 cursor-not-allowed relative"
                    >
                      Редактировать
                    </button>

                    {/* Тултип */}
                    <div
                      className="
                        absolute left-1/2 -translate-x-1/2 mt-2
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-200
                        pointer-events-none
                        bg-[rgba(20,20,25,0.95)]
                        border border-[rgba(255,255,255,0.08)]
                        px-3 py-2 rounded-xl
                        text-[11px] text-zinc-300
                        shadow-lg whitespace-normal w-40 z-20
                      "
                    >
                      ⚠ Недоступно. Функция будет разблокирована позже
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
