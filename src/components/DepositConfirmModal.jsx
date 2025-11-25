import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function DepositConfirmModal({ amount, wallet, onClose }) {
  const [seconds, setSeconds] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[rgba(10,11,17,0.98)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 w-full max-w-md shadow-[0_28px_90px_rgba(0,0,0,0.95)]">
        <div className="text-lg font-semibold mb-4 text-zinc-100">
          Подтверждение оплаты
        </div>

        <div className="text-sm text-zinc-400 mb-1">Сумма к оплате:</div>
        <div className="text-3xl font-bold text-zinc-50 mb-4">
          {amount} USDT
        </div>

        <div className="text-sm text-zinc-400 mb-1">Кошелёк (TRC20):</div>
        <div className="p-2 rounded-lg bg-[rgba(5,6,10,0.95)] font-mono border border-[rgba(255,255,255,0.14)] mb-4 text-zinc-100">
          {wallet}
        </div>

        <div className="w-full flex justify-center mb-4">
          <div className="p-2 rounded-2xl bg-white">
            <QRCode value={wallet} size={170} />
          </div>
        </div>

        <div className="text-center text-zinc-400 text-sm mb-1">
          Время для оплаты:
        </div>

        <div className="text-center text-3xl font-bold text-[#e04646] mb-4 tracking-[0.15em]">
          {formatTime(seconds)}
        </div>

        <div className="flex justify-between mt-4 gap-3">
          <button
            className="flex-1 px-4 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.14)] rounded-lg text-sm text-zinc-200 hover:bg-[rgba(255,255,255,0.08)]"
            onClick={onClose}
          >
            Отменить
          </button>

          <button
            className="flex-1 px-4 py-2 bg-[#e04646] rounded-lg text-sm font-semibold text-white shadow-[0_14px_36px_rgba(224,70,70,0.65)] hover:bg-[#eb5a5a]"
          >
            Я оплатил
          </button>
        </div>
      </div>
    </div>
  );
}
