export default function RoleBadge({
  label,
  active,
  color,
}: {
  label: string;
  active: boolean;
  color: 'emerald' | 'blue' | 'amber';
}) {
  const activeMap: Record<string, string> = {
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        active
          ? activeMap[color]
          : 'bg-slate-800 text-slate-600 border-slate-700/50'
      } transition-all duration-200`}
    >
      {label}
    </span>
  );
}
