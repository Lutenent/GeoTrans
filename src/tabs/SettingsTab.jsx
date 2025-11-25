export default function SettingsTab() {
  return (
    <div className="space-y-6 px-3 py-4 sm:px-4 sm:py-5 lg:px-0">
      {/* Безопасность */}
      <div className="rounded-2xl p-4 sm:p-5 bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)] shadow-[0_24px_70px_rgba(0,0,0,0.9)]">
        <h3 className="text-sm text-zinc-400 mb-4">Безопасность</h3>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <span className="text-sm text-zinc-400">Двухфакторная аутентификация</span>
          <button className="px-3 py-1 text-xs font-semibold text-white bg-[#eb5a5a] rounded-xl shadow-[0_12px_30px_rgba(255,77,77,0.5)]">
            Включить
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-xs text-zinc-400">Новый пароль</label>
          <input
            type="password"
            placeholder="Введите новый пароль"
            className="w-full rounded-lg bg-[rgba(8,9,14,0.95)] border border-[rgba(255,255,255,0.16)] px-3 py-2 text-sm outline-none focus:border-[#e04646]"
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-xs text-zinc-400">Подтвердите пароль</label>
          <input
            type="password"
            placeholder="Подтвердите новый пароль"
            className="w-full rounded-lg bg-[rgba(8,9,14,0.95)] border border-[rgba(255,255,255,0.16)] px-3 py-2 text-sm outline-none focus:border-[#e04646]"
          />
        </div>

        <button className="w-full text-center text-xs font-medium rounded-lg bg-[#e04646] text-white py-2 shadow-[0_14px_36px_rgba(224,70,70,0.55)]">
          Сохранить
        </button>
      </div>

      {/* Профиль */}
      <div className="rounded-2xl p-4 sm:p-5 bg-[rgba(12,13,20,0.96)] border border-[rgba(255,255,255,0.06)] shadow-[0_24px_70px_rgba(0,0,0,0.9)]">
        <h3 className="text-sm text-zinc-400 mb-4">Профиль</h3>

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-xs text-zinc-400">Таймзона</label>
          <select className="w-full rounded-lg bg-[rgba(8,9,14,0.95)] border border-[rgba(255,255,255,0.16)] px-3 py-2 text-sm outline-none focus:border-[#e04646]">
            <option>Europe/Moscow</option>
            <option>America/New_York</option>
            <option>Asia/Tokyo</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-xs text-zinc-400">Язык</label>
          <select className="w-full rounded-lg bg-[rgba(8,9,14,0.95)] border border-[rgba(255,255,255,0.16)] px-3 py-2 text-sm outline-none focus:border-[#e04646]">
            <option>ru</option>
            <option>en</option>
            <option>fr</option>
          </select>
        </div>

        <button className="w-full text-center text-xs font-medium rounded-lg bg-[#e04646] text-white py-2 shadow-[0_14px_36px_rgba(224,70,70,0.55)]">
          Сохранить
        </button>
      </div>
    </div>
  );
}
