import { useState } from "react";

export default function DepositModal({ onClose, onNext }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const wallet = "TDpyYzGT3cHHqdt6FeVkK4fxcJ18nyAU9D";

  const handleSubmit = () => {
    const num = Number(amount);

    if (!num || num <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    if (num < 100) {
      setError("Минимальная сумма пополнения — 100 USDT");
      return;
    }

    setError("");
    onNext(amount, wallet);
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[rgba(10,11,17,0.98)] border border-[rgba(255,255,255,0.08)] rounded-3xl p-6 w-full max-w-md shadow-[0_28px_90px_rgba(0,0,0,0.95)]">
        <div className="text-lg font-semibold mb-4 text-zinc-100">
          Пополнение GeoTransfer
        </div>

        <div className="mb-3">
          <label className="text-sm text-zinc-400">Сумма пополнения</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[rgba(5,6,10,0.95)] border border-[rgba(255,255,255,0.14)] p-2 rounded-lg mt-1 text-sm text-zinc-100 outline-none focus:border-[#e04646] focus:ring-1 focus:ring-[#e04646]"
            type="number"
            placeholder="0.00"
          />
        </div>

        {error && (
          <div className="text-[#ff9b9b] text-xs mb-3">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="text-sm text-zinc-400">Кошелёк USDT (TRC20)</label>
          <input
            value={wallet}
            readOnly
            className="w-full bg-[rgba(5,6,10,0.95)] border border-[rgba(255,255,255,0.14)] p-2 rounded-lg mt-1 font-mono text-sm text-zinc-100"
          />
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
            onClick={handleSubmit}
          >
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}
