function titleByTab(activeTab) {
  switch (activeTab) {
    case 'home':
      return 'Главная — GeoTransfer';
    case 'deals':
      return 'Сделки GeoTransfer';
    case 'stats':
      return 'Статистика';
    case 'details':
      return 'Реквизиты';
    case 'employees':
      return 'Сотрудники';
    case 'settings':
      return 'Настройки';
    case 'disputes':
      return 'Споры';
    default:
      return 'GeoTransfer';
  }
}

export default function Header({ activeTab }) {
  const headerTitle = titleByTab(activeTab);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        
          <img
            src="/bull-logo.png"
            alt="GeoTransfer"
            className="w-8 h-8 object-contain"
          />
        
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-zinc-50">
            {headerTitle}
          </h1>
          <span className="text-[11px] text-zinc-500">
            Платёжный кабинет GeoTransfer
          </span>
        </div>
      </div>
    </header>
  );
}
