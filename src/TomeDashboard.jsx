import { useState } from 'react';
import { useAuth } from "./auth/AuthContext";
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ModalTransfer from './components/ModalTransfer';

import HomeTab from './tabs/HomeTab';
import DealsTab from './tabs/DealsTab';
import StatsTab from './tabs/StatsTab';
import DetailsTab from './tabs/DetailsTab';
import EmployeesTab from './tabs/EmployeesTab';
import SettingsTab from './tabs/SettingsTab';
import DisputesTab from './tabs/DisputesTab';

import DepositModal from "./components/DepositModal";
import DepositConfirmModal from "./components/DepositConfirmModal";

import { txs } from './data/transactions';
import { useTweenNumber } from './hooks/useTweenNumber';
import { TARGET_BALANCE } from './utils/constants';

export default function TomeDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [modal, setModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [depositAmount, setDepositAmount] = useState(null);
  const [depositWallet, setDepositWallet] = useState(null);

  const { user, logout } = useAuth();

  const mainBalance = user?.balance?.main ?? 0;
  const displayBalance = useTweenNumber(mainBalance, {
    from: 0,
    duration: 800
  });

  const tabs = [
    { id: 'home', label: 'Главная', icon: '🏠' },
    { id: 'deals', label: 'Сделки', icon: '💳' },
    { id: 'stats', label: 'Статистика', icon: '📊' },
    { id: 'details', label: 'Реквизиты', icon: '📄' },
    { id: 'employees', label: 'Сотрудники', icon: '👥' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
  ];

  const openDeposit = () => {
    setModal("deposit1");
  };

  const openWithdraw = () => {
    setModal("withdraw");
  };

  const handleDepositNext = (amount, wallet) => {
    setDepositAmount(amount);
    setDepositWallet(wallet);
    setModal("deposit2");
  };

  return (
    <div className="w-full h-screen flex overflow-hidden relative bg-transparent">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-[240px] shrink-0 h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onDeposit={openDeposit}
          onWithdraw={openWithdraw}
          targetBalance={TARGET_BALANCE}
          handleLogout={logout}
        />
      </div>

      {/* MOBILE BURGER BUTTON */}
      <button
        onClick={() => setMenuOpen(true)}
        className="
          md:hidden 
          fixed top-4 left-4 
          z-40
          w-10 h-10
          rounded-xl 
          bg-[rgba(10,11,17,0.98)] border border-[rgba(255,255,255,0.12)]
          flex items-center justify-center
          text-2xl text-zinc-100
          shadow-[0_18px_40px_rgba(0,0,0,0.9)]
        "
      >
        ☰
      </button>

      {/* MOBILE SIDEBAR */}
      <div
        className={`
          fixed inset-y-0 left-0 w-[240px] z-50
          bg-[rgba(10,11,17,0.98)] border-r border-[rgba(255,255,255,0.12)]
          transform transition-transform duration-300
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(v) => { setActiveTab(v); setMenuOpen(false); }}
          onDeposit={openDeposit}
          onWithdraw={openWithdraw}
          targetBalance={TARGET_BALANCE}
          handleLogout={logout}
        />
      </div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6">
        <div
          className="
            relative rounded-[32px] p-4 md:p-6 
            bg-[rgba(10,11,17,0.98)]
            border border-[rgba(255,255,255,0.06)] 
            shadow-[0_32px_90px_rgba(0,0,0,0.95)]
            min-h-full overflow-hidden
          "
        >
          {/* мягкое красное свечение в фоне */}
          <div className="pointer-events-none absolute inset-0 rounded-[32px] opacity-50
  bg-[radial-gradient(circle_at_top,_rgba(224,70,70,0.08),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(224,70,70,0.06),_transparent_55%)]" />

          <div className="relative z-10">
            <Header activeTab={activeTab} />

            <section className="mt-6">
              {activeTab === 'home' && <HomeTab balance={displayBalance} txs={txs} user={user} />}
              {activeTab === 'deals' && <DealsTab />}
              {activeTab === 'stats' && <StatsTab />}
              {activeTab === 'details' && <DetailsTab />}
              {activeTab === 'employees' && <EmployeesTab />}
              {activeTab === 'settings' && <SettingsTab />}
              {activeTab === 'disputes' && <DisputesTab />}
            </section>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div
        className="
          md:hidden
          fixed bottom-0 left-0 right-0 z-50
          h-16
          bg-[rgba(10,11,17,0.98)] border-t border-[rgba(255,255,255,0.12)]
          flex justify-between px-2
        "
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`
              flex flex-col items-center justify-center flex-1
              text-xs transition
              ${activeTab === t.id ? 'text-[#eb5a5a]' : 'text-zinc-400'}
            `}
          >
            <div className="text-lg">{t.icon}</div>
            {t.label}
          </button>
        ))}
      </div>

      {/* ========= МОДАЛКИ ========= */}
      {modal === "deposit1" && (
        <DepositModal
          onClose={() => setModal(null)}
          onNext={handleDepositNext}
        />
      )}

      {modal === "deposit2" && (
        <DepositConfirmModal
          amount={depositAmount}
          wallet={depositWallet}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "withdraw" && (
        <ModalTransfer
          type="withdraw"
          balance={displayBalance}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
