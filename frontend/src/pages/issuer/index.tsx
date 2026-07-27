import { useAccount } from 'wagmi';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import IssuerLayout from '../../components/IssuerLayout';
import RoleBanner from '../../components/RoleBanner';
import { useIsAuthority, useIsEducation, useIsScienceTech } from '../../hooks/useContract';

const roles = [
  {
    key: 'education',
    label: 'C\u1ea5p v\u0103n b\u1eb1ng h\u1ecdc thu\u1eadt',
    desc: 'Ph\xe1t h\xe0nh v\u0103n b\u1eb1ng t\u1ed1t nghi\u1ec7p, ch\u1ee9ng ch\u1ec9 h\u1ecdc thu\u1eadt',
    icon: '\ud83c\udf93',
    href: '/issuer/education',
    color: 'emerald',
    check: (e: boolean, _s: boolean, _a: boolean) => e,
  },
  {
    key: 'science',
    label: '\u0110\u0103ng k\xfd h\u1ed3 s\u01a1 khoa h\u1ecdc',
    desc: '\u0110\u0103ng k\xfd b\u1eb1ng ch\u1ee9ng t\u1ed3n t\u1ea1i t\xe0i li\u1ec7u, h\u1ed3 s\u01a1',
    icon: '\ud83d\udd2c',
    href: '/issuer/science',
    color: 'blue',
    check: (_e: boolean, s: boolean, _a: boolean) => s,
  },
  {
    key: 'authority',
    label: 'Qu\u1ea3n l\xfd c\u1ea5p Th\xe0nh ph\u1ed1',
    desc: 'C\u1ea5p ch\u1ee9ng nh\u1eadn, thu h\u1ed3i v\u0103n b\u1eb1ng, qu\u1ea3n l\xfd to\xe0n di\u1ec7n',
    icon: '\ud83c\udfdb\ufe0f',
    href: '/issuer/authority',
    color: 'amber',
    check: (_e: boolean, _s: boolean, a: boolean) => a,
  },
];

function HubPage() {
  const { address, isConnected } = useAccount();
  const { isEducation } = useIsEducation(address);
  const { isScienceTech } = useIsScienceTech(address);
  const { isAuthority } = useIsAuthority(address);
  const hasAnyRole = isEducation || isScienceTech || isAuthority;

  const colorClasses: Record<string, { border: string; glow: string; bg: string; text: string; btn: string }> = {
    emerald: {
      border: 'border-emerald-500/20', glow: 'glow-emerald', bg: 'bg-emerald-500/10',
      text: 'text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-700',
    },
    blue: {
      border: 'border-blue-500/20', glow: 'glow-blue', bg: 'bg-blue-500/10',
      text: 'text-blue-400', btn: 'bg-blue-600 hover:bg-blue-700',
    },
    amber: {
      border: 'border-amber-500/20', glow: 'glow-amber', bg: 'bg-amber-500/10',
      text: 'text-amber-400', btn: 'bg-amber-600 hover:bg-amber-700',
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">C\u1ed5ng C\xe1n B\u1ed9</h1>
        <p className="section-subtitle">Ch\u1ecdn ch\u1ee9c n\u0103ng theo quy\u1ec1n h\u1ea1n c\u1ee7a b\u1ea1n</p>
      </div>

      {isConnected && (
        <RoleBanner
          address={address!}
          isEducation={isEducation}
          isScienceTech={isScienceTech}
          isAuthority={isAuthority}
        />
      )}

      {isConnected && !hasAnyRole && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Kh\xf4ng c\xf3 quy\u1ec1n truy c\u1eadp</h3>
          <p className="text-slate-400">V\xed c\u1ee7a b\u1ea1n ch\u01b0a \u0111\u01b0\u1ee3c c\u1ea5p quy\u1ec1n. Vui l\xf2ng li\xean h\u1ec7 qu\u1ea3n tr\u1ecb vi\xean (DEFAULT_ADMIN).</p>
        </div>
      )}

      {isConnected && hasAnyRole && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const active = role.check(isEducation, isScienceTech, isAuthority);
            if (!active) return null;
            const cc = colorClasses[role.color];
            return (
              <Link key={role.key} href={role.href} className="block group">
                <div className={`card ${cc.border} ${cc.glow} h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1 cursor-pointer`}>
                  <div className={`w-12 h-12 ${cc.bg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {role.icon}
                  </div>
                  <h3 className={`text-lg font-bold ${cc.text} mb-2`}>{role.label}</h3>
                  <p className="text-sm text-slate-400 mb-4">{role.desc}</p>
                  <span className={`inline-block px-4 py-2 ${cc.btn} text-white text-sm font-medium rounded-lg transition-colors`}>
                    Truy c\u1eadp \u2192
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!isConnected && (
        <div className="card text-center py-12">
          <p className="text-slate-400 mb-4">K\u1ebft n\u1ed1i v\xed \u0111\u1ec3 truy c\u1eadp c\u1ed5ng C\xe1n B\u1ed9.</p>
        </div>
      )}
    </div>
  );
}

export default function ProtectedHubPage() {
  return (
    <IssuerLayout>
      <ProtectedRoute requiredRole="issuer">
        <HubPage />
      </ProtectedRoute>
    </IssuerLayout>
  );
}
