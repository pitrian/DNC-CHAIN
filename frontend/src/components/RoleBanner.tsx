import { shortenAddress } from '../utils/hash';
import RoleBadge from './RoleBadge';

export default function RoleBanner({
  address,
  isEducation,
  isScienceTech,
  isAuthority,
  accent = 'emerald',
}: {
  address: string;
  isEducation: boolean;
  isScienceTech: boolean;
  isAuthority: boolean;
  accent?: 'emerald' | 'blue' | 'amber';
}) {
  const walletIconColor = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="card mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center">
            <svg className={`w-5 h-5 ${walletIconColor[accent]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500">V\xed kết nối</p>
            <p className="text-base font-mono font-bold text-slate-100">
              {shortenAddress(address)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RoleBadge label="EDUCATION" active={isEducation} color="emerald" />
          <RoleBadge label="SCIENCE & TECH" active={isScienceTech} color="blue" />
          <RoleBadge label="AUTHORITY" active={isAuthority} color="amber" />
        </div>
      </div>
    </div>
  );
}
