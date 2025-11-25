export default function NavButton({ id, active, onClick, children, title }) {
  const base =
    'w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all duration-200 text-zinc-300';
  const activeClasses =
    ' bg-[rgba(224,70,70,0.16)] shadow-[0_10px_30px_rgba(0,0,0,0.75)] border border-[rgba(255,255,255,0.18)]';
  const inactiveClasses =
    ' hover:bg-[rgba(255,255,255,0.03)] border border-transparent';

  const iconBase =
    'w-9 h-9 rounded-full flex items-center justify-center text-lg';
  const iconActive =
    ' bg-[radial-gradient(circle_at_top,_rgba(224,70,70,0.95),_rgba(90,9,9,0.95))] text-white shadow-[0_0_18px_rgba(224,70,70,0.8)]';
  const iconInactive =
    ' bg-[rgba(255,255,255,0.06)] text-zinc-200';

  const labelClass =
    'text-sm ' + (active ? 'text-white font-medium' : 'text-zinc-300');

  return (
    <button
      onClick={onClick}
      title={title}
      className={base + (active ? activeClasses : inactiveClasses)}
      aria-pressed={active}
    >
      <span className={iconBase + (active ? iconActive : iconInactive)}>
        {children}
      </span>
      <span className={labelClass}>{title}</span>
    </button>
  );
}
