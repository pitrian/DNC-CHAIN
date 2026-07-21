import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../components/FileUploader';
import ProtectedRoute from '../components/ProtectedRoute';
import { useIsAuthority, useIsEducation, useIsScienceTech, useProofRegistry, useDegreeContract } from '../hooks/useContract';

function BatchIssuance() {
  const { mintDegree, txHash } = useDegreeContract();
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [batchStatus, setBatchStatus] = useState<{
    total: number; completed: number; failed: number; running: boolean;
  }>({ total: 0, completed: 0, failed: 0, running: false });
  const [actionTxHash, setActionTxHash] = useState<`0x${string}` | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<string[]>([]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: actionTxHash });

  useEffect(() => {
    if (txHash) setActionTxHash(txHash);
  }, [txHash]);

  useEffect(() => {
    if (!batchStatus.running || !addresses.length) return;
    if (currentIndex >= addresses.length) {
      setBatchStatus(prev => ({ ...prev, running: false }));
      setStatus({ type: 'success', message: `✅ Batch mint hoàn tất: ${batchStatus.completed} thành công, ${batchStatus.failed} thất bại` });
      return;
    }
    if (!isConfirming && !txHash) {
      const addr = addresses[currentIndex].trim() as `0x${string}`;
      if (addr.startsWith('0x') && addr.length === 42) {
        const metadataUri = `${window.location.origin}/api/metadata/batch-${currentIndex}`;
        mintDegree(addr, metadataUri);
      } else {
        setBatchStatus(prev => ({ ...prev, failed: prev.failed + 1 }));
        setCurrentIndex(prev => prev + 1);
      }
    }
  }, [batchStatus.running, currentIndex, isConfirming, txHash, addresses, mintDegree]);

  useEffect(() => {
    if (isConfirmed && batchStatus.running) {
      setBatchStatus(prev => ({ ...prev, completed: prev.completed + 1 }));
      setCurrentIndex(prev => prev + 1);
      setActionTxHash(undefined);
    }
  }, [isConfirmed, batchStatus.running]);

  const parseAddresses = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.startsWith('0x') && l.length === 42);
    setAddresses(lines);
    return lines;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setInput(text);
      parseAddresses(text);
    };
    reader.readAsText(file);
  };

  const handleStartBatch = () => {
    const parsed = parseAddresses(input);
    if (!parsed.length) {
      setStatus({ type: 'error', message: '❌ Không tìm thấy địa chỉ hợp lệ nào' });
      return;
    }
    setBatchStatus({ total: parsed.length, completed: 0, failed: 0, running: true });
    setCurrentIndex(0);
    setStatus({ type: 'info', message: `🚀 Bắt đầu batch mint ${parsed.length} văn bằng...` });
  };

  const preview = parseAddresses(input);

  return (
    <div className="card border-2 border-blue-200 bg-blue-50/50 mt-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-blue-500 rounded-full" />
        <h3 className="font-semibold text-dnc-blue-900">Batch Issuance · Hàng loạt</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Dán danh sách địa chỉ (mỗi dòng một địa chỉ) hoặc upload file CSV để cấp văn bằng hàng loạt.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="0x1234...&#10;0x5678...&#10;0x9abc..."
        rows={5}
        className="input-field font-mono text-sm mb-3"
      />

      <div className="flex items-center space-x-3 mb-4">
        <label className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-300 transition-colors">
          📁 Upload CSV
          <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
        <span className="text-xs text-gray-500">CSV với cột "address" hoặc TXT mỗi dòng một địa chỉ</span>
      </div>

      {preview.length > 0 && (
        <div className="mb-4 p-3 bg-white/60 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Tìm thấy {preview.length} địa chỉ:
          </p>
          <div className="max-h-24 overflow-y-auto space-y-1">
            {preview.slice(0, 20).map((addr, i) => (
              <div key={i} className="text-xs font-mono text-gray-600">{addr}</div>
            ))}
            {preview.length > 20 && (
              <div className="text-xs text-gray-400">...và {preview.length - 20} địa chỉ khác</div>
            )}
          </div>
        </div>
      )}

      {batchStatus.running && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Tiến độ:</span>
            <span className="font-medium text-dnc-blue-900">{batchStatus.completed + batchStatus.failed} / {batchStatus.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((batchStatus.completed + batchStatus.failed) / batchStatus.total) * 100}%` }}
            />
          </div>
          <div className="flex space-x-4 mt-1 text-xs text-gray-500">
            <span>✅ {batchStatus.completed}</span>
            <span>❌ {batchStatus.failed}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleStartBatch}
        disabled={!preview.length || batchStatus.running}
        className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {batchStatus.running ? `⏳ Đang mint (${batchStatus.completed + batchStatus.failed}/${batchStatus.total})...` : '🚀 Batch Mint'}
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

function IssuerPage() {
  const { address, isConnected } = useAccount();
  const { isAuthority } = useIsAuthority(address);
  const { isEducation } = useIsEducation(address);
  const { isScienceTech } = useIsScienceTech(address);
  const canMint = isEducation || isAuthority;
  const canRegister = isScienceTech || isAuthority;
  const isAllowed = canMint || canRegister;
  const { registerProof, txHash: proofTxHash } = useProofRegistry();
  const { mintDegree, txHash: degreeTxHash } = useDegreeContract();

  const [mode, setMode] = useState<'proof' | 'degree'>('degree');
  const [recipient, setRecipient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (proofTxHash) setTxHash(proofTxHash);
  }, [proofTxHash]);

  useEffect(() => {
    if (degreeTxHash) setTxHash(degreeTxHash);
  }, [degreeTxHash]);

  useEffect(() => {
    if (isConfirmed) {
      setStatus({
        type: 'success',
        message: `Transaction confirmed successfully! ${mode === 'degree' ? 'Diploma minted.' : 'Document proof registered.'}`,
      });
      setIsSubmitting(false);
      setTxHash(undefined);
    }
  }, [isConfirmed, mode]);

  useEffect(() => {
    if (txHash && isConfirming) {
      setStatus({
        type: 'info',
        message: `Transaction submitted. Waiting for confirmation... Tx: ${txHash.slice(0, 10)}...`,
      });
    }
  }, [txHash, isConfirming]);

  const handleHashGenerated = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);

    if (!isAuthority) {
      setStatus({
        type: 'error',
        message: 'Your wallet does not have AUTHORITY role. Only government authorities can issue diplomas.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'proof') {
        registerProof(hash);
      } else {
        if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
          setStatus({
            type: 'error',
            message: 'Please enter a valid recipient address (0x...)',
          });
          setIsSubmitting(false);
          return;
        }
        const metadataUri = `${window.location.origin}/api/metadata/${hash}`;
        mintDegree(recipient as `0x${string}`, metadataUri);
      }
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Transaction failed. Please try again.';
      setStatus({ type: 'error', message });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">Issuing Authority Portal</h1>
        <p className="section-subtitle">
          For authorized government entities to mint Soulbound Degree NFTs and register document proofs
        </p>
      </div>

      {isConnected && (
        <>
          {!isAllowed ? (
            <div className="card text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-dnc-blue-900 mb-2">
                Không có quyền truy cập
              </h3>
              <p className="text-gray-600">
                Ví của bạn chưa được cấp quyền. Vui lòng liên hệ quản trị viên (DEFAULT_ADMIN).
              </p>
              <div className="mt-3 text-xs text-gray-400 space-y-1">
                <p>• <strong>EDUCATION_ROLE</strong>: Cấp văn bằng (Sở GD&ĐT)</p>
                <p>• <strong>SCIENCE_TECH_ROLE</strong>: Đăng ký hồ sơ (Sở KH&CN)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-dnc-blue-900 mb-4">
                  {isEducation && isScienceTech
                    ? 'Có quyền: Sở GD&ĐT + Sở KH&CN'
                    : isEducation
                    ? 'Có quyền: Sở GD&ĐT (EDUCATION_ROLE)'
                    : isScienceTech
                    ? 'Có quyền: Sở KH&CN (SCIENCE_TECH_ROLE)'
                    : 'Có quyền: AUTHORITY_ROLE'}
                </h3>

                <div className="flex space-x-4 mb-6">
                  {(canMint) && (
                    <button
                      onClick={() => setMode('degree')}
                      className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                        mode === 'degree'
                          ? 'bg-dnc-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      🎓 Cấp văn bằng
                    </button>
                  )}
                  {(canRegister) && (
                    <button
                      onClick={() => setMode('proof')}
                      className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                        mode === 'proof'
                          ? 'bg-dnc-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      📄 Đăng ký hồ sơ
                    </button>
                  )}
                </div>

                {mode === 'degree' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x..."
                      className="input-field font-mono text-sm"
                    />
                  </div>
                )}

                <FileUploader
                  onHashGenerated={handleHashGenerated}
                  isUploading={isSubmitting}
                />
              </div>

              {canMint && <BatchIssuance />}

              {status && (
                <div
                  className={`p-4 rounded-lg text-sm ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : status.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  {status.message}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!isConnected && (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">
            Connect your wallet to access the Issuer Portal.
          </p>
          <p className="text-sm text-gray-400">
            Only authorized government wallets (AUTHORITY role) can mint diplomas.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProtectedIssuerPage() {
  return (
    <ProtectedRoute requiredRole="issuer">
      <IssuerPage />
    </ProtectedRoute>
  );
}
