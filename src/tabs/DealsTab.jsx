import React, { useState } from 'react';

export default function DealsTab() {
  const [active, setActive] = useState("Приём");
  const tabs = ["Приём", "Выплата", "Споры", "Все"];

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6">
      <h1 className="text-xl font-semibold text-zinc-100 mb-4">Сделки GeoTransfer</h1>

      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`
              px-4 py-2 rounded-lg text-sm border transition
              ${
                active === t
                  ? 'bg-[#e04646] text-white border-[#e04646] shadow-[0_12px_30px_rgba(224,70,70,0.6)]'
                  : 'bg-[rgba(22,23,32,0.98)] text-zinc-300 border-[rgba(255,255,255,0.16)] hover:bg-[rgba(30,31,40,0.98)]'
              }
            `}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="text-zinc-400 text-sm mt-3 sm:mt-4 bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
        Список сделок пока пуст — <span className="text-zinc-200">{active}</span>
      </div>
    </div>
  );
}
