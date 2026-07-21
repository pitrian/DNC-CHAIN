import React, { useState, useEffect } from 'react';
import EventStream from '../components/EventStream';
import DegreeCard from '../components/DegreeCard';
import ProofRegistryCard from '../components/ProofRegistryCard';
import Analytics from '../components/Analytics';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import {
  useIsAuthority, useIsAdmin, useIsEducation, useIsScienceTech,
  useAccessControl, usePauseControl, useIsSystemPaused,
  useRevokeDegree, useRevokeProof,
} from '../hooks/useContract';
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
        <h3 className="font-semibold text-dnc-blue-900">System Governance · RBAC Control</h3>
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

function EmergencyControl() {
  const { pause, unpause, txHash } = usePauseControl();
  const { isPaused, isLoading } = useIsSystemPaused();
  const [status, setStatus] = useState<ActionState | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [actionTxHash, setActionTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: actionTxHash });

  useEffect(() => {
    if (txHash) setActionTxHash(txHash);
  }, [txHash]);

  useEffect(() => {
    if (isConfirmed && pendingAction) {
      setStatus({ type: 'success', message: `✅ ${pendingAction} thành công` });
      setPendingAction(null);
      setActionTxHash(undefined);
    }
  }, [isConfirmed, pendingAction]);

  if (isLoading) return null;

  return (
    <div className={`card border-2 ${isPaused ? 'border-red-300 bg-red-50/50' : 'border-green-200 bg-green-50/50'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          <h3 className="font-semibold text-dnc-blue-900">Emergency Stop · Circuit Breaker</h3>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          isPaused ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {isPaused ? 'PAUSED' : 'ACTIVE'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {isPaused
          ? 'Hệ thống đang tạm dừng. Tất cả mint và register operations đã bị chặn.'
          : 'Hệ thống đang hoạt động bình thường.'}
      </p>
      <div className="flex space-x-3">
        <button
          onClick={() => { setPendingAction('Pause'); pause(); setStatus({ type: 'info', message: '⏳ Đang pause...' }); }}
          disabled={isPaused || isConfirming}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {isConfirming && pendingAction === 'Pause' ? '...' : '⏹ Emergency Stop'}
        </button>
        <button
          onClick={() => { setPendingAction('Unpause'); unpause(); setStatus({ type: 'info', message: '⏳ Đang resume...' }); }}
          disabled={!isPaused || isConfirming}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isConfirming && pendingAction === 'Unpause' ? '...' : '▶ Resume'}
        </button>
      </div>
      {status && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200'
            : status.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

function RevocationPanel() {
  const { burnDegree, txHash: burnTxHash } = useRevokeDegree();
  const { revokeProof, txHash: revokeTxHash } = useRevokeProof();
  const [mode, setMode] = useState<'degree' | 'proof'>('degree');
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<ActionState | null>(null);
  const [pending, setPending] = useState(false);
  const [actionTxHash, setActionTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: actionTxHash });

  useEffect(() => {
    if (burnTxHash) setActionTxHash(burnTxHash);
  }, [burnTxHash]);

  useEffect(() => {
    if (revokeTxHash) setActionTxHash(revokeTxHash);
  }, [revokeTxHash]);

  useEffect(() => {
    if (isConfirmed) {
      setStatus({
        type: 'success',
        message: `✅ Thu hồi ${mode === 'degree' ? 'văn bằng' : 'hồ sơ'} thành công`,
      });
      setInputValue('');
      setPending(false);
      setActionTxHash(undefined);
    }
  }, [isConfirmed, mode]);

  const handleRevoke = () => {
    const val = inputValue.trim();
    if (!val) {
      setStatus({ type: 'error', message: '❌ Vui lòng nhập giá trị' });
      return;
    }
    setPending(true);
    setStatus({ type: 'info', message: `⏳ Đang thu hồi...` });
    if (mode === 'degree') {
      burnDegree(BigInt(val));
    } else {
      revokeProof(val as `0x${string}`);
    }
  };

  return (
    <div className="card border-2 border-orange-200 bg-orange-50/50">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-orange-500 rounded-full" />
        <h3 className="font-semibold text-dnc-blue-900">Revocation Management</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Thu hồi văn bằng (EDUCATION_ROLE) hoặc hồ sơ (SCIENCE_TECH_ROLE).
      </p>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setMode('degree')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            mode === 'degree' ? 'bg-orange-600 text-white' : 'bg-white/60 text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎓 Thu hồi văn bằng
        </button>
        <button
          onClick={() => setMode('proof')}
          className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
            mode === 'proof' ? 'bg-orange-600 text-white' : 'bg-white/60 text-gray-600 hover:bg-gray-100'
          }`}
        >
          📄 Thu hồi hồ sơ
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'degree' ? 'Token ID' : 'FileHash (0x...)'}
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={mode === 'degree' ? 'Nhập token ID...' : '0x...'}
          className="input-field font-mono text-sm"
        />
      </div>

      <button
        onClick={handleRevoke}
        disabled={!inputValue || isConfirming || pending}
        className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {isConfirming ? '⏳ Đang xử lý...' : '🗑 Xác nhận thu hồi'}
      </button>

      {status && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200'
            : status.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

function DashboardPage() {
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
        <h1 className="section-title">System Governance Dashboard</h1>
        <p className="section-subtitle">
          Real-time on-chain monitoring, RBAC management & analytics for DNC-CertiTrust
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <EventStream />

        <div className="space-y-6">
          {isConnected && isAdmin && (
            <>
              <AdminPanel />
              <EmergencyControl />
              <RevocationPanel />
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

export default function ProtectedDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardPage />
    </ProtectedRoute>
  );
}
