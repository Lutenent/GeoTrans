import React from "react";

export default function LockedFeature({ title = "Создать" }) {
  return (
    <div className="mt-4 rounded-2xl px-4 py-3 bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)] shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
      <button
        disabled
        className="
          w-full px-4 py-2 rounded-lg text-sm font-semibold
          bg-[rgba(224,70,70,0.12)]
          border border-[rgba(224,70,70,0.55)]
          text-[#ff9b9b]
          cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        <span className="text-base">🔒</span>
        <span>{title}</span>
      </button>

      <div className="text-xs text-zinc-400 mt-3 flex items-start gap-2">
        <span className="text-[#ffcc66] text-lg leading-none">⚠</span>
        <span>
          Функция GeoTransfer будет доступна после достижения полного страхового
          лимита по аккаунту.
        </span>
      </div>
    </div>
  );
}
