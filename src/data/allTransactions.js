function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const allTransactions = [];

let total = 0; // сколько транзакций нужно
let currentDate = new Date();

// счётчик пополнений до следующего вывода
let nextWithdrawAfter = random(3, 7);
let depositsSinceLastWithdraw = 0;

for (let i = 1; i <= total; i++) {
  // ШАГ ДАТЫ – каждую транзакцию отнимаем от 20 до 120 минут
  currentDate = new Date(currentDate.getTime() - random(20, 120) * 60 * 1000);
  const formatted = currentDate.toISOString().slice(0, 16).replace("T", " ");

  // LOGIC: каждые 3–7 пополнений — вывод
  let isDeposit = true;

  if (depositsSinceLastWithdraw >= nextWithdrawAfter) {
    isDeposit = false; // делаем вывод
    depositsSinceLastWithdraw = 0; // сбрасываем
    nextWithdrawAfter = random(3, 7); // ставим новое условие
  }

  if (isDeposit) {
    depositsSinceLastWithdraw++;
  }

  const amount = isDeposit
    ? Number((Math.random() * (7000 - 500) + 500).toFixed(2)) // 500–7000 USDT
    : -Number((Math.random() * (15000 - 4000) + 4000).toFixed(2)); // вывод 4000–15000 USDT

  allTransactions.push({
    id: "tx_" + i,
    type: isDeposit ? "Вход" : "Вывод",
    dest: isDeposit
      ? "Пополнение USDT (TRC20)"
      : "TRC20 кошелёк " + ["TA3", "TR9", "TX1", "TW4"][random(0, 3)] + "...X" + random(10, 99),
    amount: amount,
    date: formatted,
    status: isDeposit ? "Подтверждён" : "Успешно",
  });
}
