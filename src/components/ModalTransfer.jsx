import { fmt } from '../utils/format';
import { FULL_WALLET_ADDRESS } from '../utils/constants';

export default function ModalTransfer({ type, balance, onClose }) {
  if (!type) return null;
  const isWithdraw = type === 'withdraw';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* фон */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* карточка */}
      <div className="relative z-50 w-full max-w-xl rounded-3xl bg-[rgba(10,11,17,0.98)] border border-[rgba(255,255,255,0.08)] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.95)]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(224,70,70,0.95),_rgba(90,9,9,0.95))] flex items-center justify-center shadow-[0_16px_40px_rgba(224,70,70,0.7)] border border-[rgba(255,255,255,0.18)]">
              <img
                src="/bull-logo.png"
                alt="GeoTransfer"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-zinc-500">
                {isWithdraw ? 'Вывод средств' : 'Пополнение баланса'}
              </div>
              <div className="text-xl font-semibold leading-tight text-zinc-100">
                {fmt(balance)}{' '}
                <span className="text-sm align-middle ml-1 text-zinc-400">
                  USDT
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                GeoTransfer · USDT TRC20
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] text-zinc-300 text-sm"
          >
            ✕
          </button>
        </div>

        <form
          className="space-y-4 mt-2"
          onSubmit={e => {
            e.preventDefault();
            onClose();
          }}
        >
          {/* Сумма */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1">
              Сумма {isWithdraw ? 'к выводу' : 'пополнения'}
            </label>
            <input
              type="number"
              step="0.00000001"
              placeholder="0.00000000"
              className="w-full rounded-lg bg-[rgba(5,6,10,0.95)] border border-[rgba(255,255,255,0.14)] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
            />
            {isWithdraw && (
              <div className="mt-1 text-[11px] text-zinc-500">
                Комиссия за вывод составляет{' '}
                <span className="text-zinc-200">6.00 USDT</span>.
              </div>
            )}
          </div>

          {/* Адрес для пополнения */}
          {!isWithdraw && (
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Адрес кошелька (USDT TRC20)
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 rounded-lg bg-[rgba(5,6,10,0.95)] border border-[rgba(255,255,255,0.14)] px-3 py-2 text-sm text-zinc-100 font-mono select-all">
                  {FULL_WALLET_ADDRESS}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard &&
                    navigator.clipboard.writeText(FULL_WALLET_ADDRESS)
                  }
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-sm text-zinc-100"
                >
                  📋
                </button>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">
                Отправьте USDT TRC20 на этот адрес. Средства будут зачислены после
                подтверждения сети.
              </div>
            </div>
          )}

          {/* Адрес для вывода */}
          {isWithdraw && (
            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Адрес кошелька (USDT TRC20)
              </label>
              <input
                type="text"
                placeholder="T..."
                className="w-full rounded-lg bg-[rgba(5,6,10,0.95)] border border-[rgba(255,255,255,0.14)] px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
              />
              <div className="mt-1 text-[11px] text-zinc-500">
                Убедитесь, что адрес относится к сети{' '}
                <span className="text-zinc-200">TRC20</span>.
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.02)] text-sm text-zinc-200 hover:bg-[rgba(255,255,255,0.06)]"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#e04646] text-sm font-semibold text-white shadow-[0_12px_34px_rgba(224,70,70,0.65)] hover:bg-[#eb5a5a]"
            >
              {isWithdraw ? 'Вывести' : 'Пополнить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
