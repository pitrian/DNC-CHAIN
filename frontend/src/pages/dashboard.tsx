import React, { useState, useEffect } from 'react';
import WalletConnect from '../components/WalletConnect';
import EventStream from '../components/EventStream';
import DegreeCard from '../components/DegreeCard';
import ProofRegistryCard from '../components/ProofRegistryCard';
import Analytics from '../components/Analytics';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useIsAuthority, useIsAdmin, useIsEducation, useIsScienceTech, useAccessControl } from '../hooks/useContract';
import { shortenAddress } from '../utils/hash';

interface ActionState {
  type: 'success' | 'error' | 'info';
  message: string;
}

function AdminPanel() {
  const {
    grantAuthorityRole, revokeAuthorityRole,
    grantEducationRole, revokeEducationRole,
    grantScienceTechRole, revokeScienceTechRole,
    txHash,
  } = useAccessControl();
  const [targetAddress, setTargetAddress] = useState('');
  const [status, setStatus] = useState<ActionState | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isConfirmed && pending && targetAddress) {
      setStatus({ type: 'success', message: `✅ Thành công: ${pending} cho ${shortenAddress(targetAddress as `0x${string}`)}` });
      setTargetAddress('');
      setPending(null);
    }
  }, [isConfirmed, pending, targetAddress]);

  const validate = (): `0x${string}` | null => {
    const addr = targetAddress.trim() as `0x${string}`;
    if (!addr.startsWith('0x') || addr.length !== 42) {
      setStatus({ type: 'error', message: '❌ Địa chỉ ví không hợp lệ' });
      return null;
    }
    return addr;
  };

  const actions: { label: string; grant: (a: `0x${string}`) => void; revoke: (a: `0x${string}`) => void }[] = [
    { label: 'AUTHORITY', grant: grantAuthorityRole, revoke: revokeAuthorityRole },
    { label: 'EDUCATION', grant: grantEducationRole, revoke: revokeEducationRole },
    { label: 'SCIENCE_TECH', grant: grantScienceTechRole, revoke: revokeScienceTechRole },
  ];

  return (
    <div className="card border-2 border-amber-200 bg-amber-50/50">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-amber-500 rounded-full" />
        <h3 className="font-semibold text-dnc-blue-900">Quản lý phân quyền</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Quản lý vai trò cho các Sở ban ngành. Nhập địa chỉ ví sau đó chọn thao tác.
      </p>
      <div className="space-y-3">
        <input
          type="text"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
          placeholder="0x... (địa chỉ ví)"
          className="input-field font-mono text-sm"
        />
        <div className="space-y-2">
          {actions.map((a) => (
            <div key={a.label} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
              <span className="text-sm font-medium text-gray-700 min-w-[120px]">{a.label}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => { const addr = validate(); if (addr) { setPending(`Cấp ${a.label}`); a.grant(addr); setStatus({ type: 'info', message: `⏳ Đang cấp ${a.label}...` }); } }}
                  disabled={!targetAddress || isConfirming}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isConfirming && pending === `Cấp ${a.label}` ? '...' : 'Cấp'}
                </button>
                <button
                  onClick={() => { const addr = validate(); if (addr) { setPending(`Thu hồi ${a.label}`); a.revoke(addr); setStatus({ type: 'info', message: `⏳ Đang thu hồi ${a.label}...` }); } }}
                  disabled={!targetAddress || isConfirming}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isConfirming && pending === `Thu hồi ${a.label}` ? '...' : 'Thu hồi'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {status && (
          <div className={`p-3 rounded-lg text-sm ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : status.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { isAuthority } = useIsAuthority(address);
  const { isAdmin } = useIsAdmin(address);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <h1 className="section-title">Live Dashboard</h1>
        <p className="section-subtitle">
          Real-time blockchain event monitoring for DNC-CertiTrust
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <WalletConnect />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <EventStream />

        <div className="space-y-6">
          {isConnected && (
            <>
              <div className="card">
                <h3 className="font-semibold text-dnc-blue-900 mb-3">Account Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span className="font-mono text-gray-800">
                      {shortenAddress(address!)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium text-gray-800">
                      {isAdmin ? 'DEFAULT_ADMIN' : isAuthority ? 'AUTHORITY' : 'USER'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Authority:</span>
                    <span className={`font-medium ${isAuthority ? 'text-green-600' : 'text-gray-400'}`}>
                      {isAuthority ? 'Yes ✓' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Admin:</span>
                    <span className={`font-medium ${isAdmin ? 'text-amber-600' : 'text-gray-400'}`}>
                      {isAdmin ? 'Yes ⚙' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {isAdmin && <AdminPanel />}
            </>
          )}

          <DegreeCard />

          <ProofRegistryCard />

          <div className="card">
            <h3 className="font-semibold text-dnc-blue-900 mb-3">
              Network Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Network:</span>
                <span className="text-gray-800 font-medium">Anvil (Local)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chain ID:</span>
                <span className="text-gray-800 font-medium">31337</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Standard:</span>
                <span className="text-gray-800 font-medium">
                  ERC-5192 (Soulbound)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {isConnected && <Analytics />}
      </div>
    </div>
  );
}
