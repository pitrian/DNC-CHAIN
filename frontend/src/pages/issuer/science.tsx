import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../../components/FileUploader';
import ProtectedRoute from '../../components/ProtectedRoute';
import IssuerLayout from '../../components/IssuerLayout';
import RoleBanner from '../../components/RoleBanner';
import { useIsAuthority, useIsEducation, useIsScienceTech, useProofRegistry, useProofData, useRevokeProof } from '../../hooks/useContract';

function SciencePage() {
  const { address, isConnected } = useAccount();
  const { isScienceTech } = useIsScienceTech(address);
  const { isAuthority } = useIsAuthority(address);
  const { isEducation } = useIsEducation(address);
  const { registerProof, txHash: proofTxHash } = useProofRegistry();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (proofTxHash) setTxHash(proofTxHash);
  }, [proofTxHash]);

  useEffect(() => {
    if (isConfirmed) {
      setStatus({ type: 'success', message: 'Đã đăng ký hồ sơ thành công!' });
      setIsSubmitting(false);
      setTxHash(undefined);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (txHash && isConfirming) {
      setStatus({ type: 'info', message: `Đang chờ xác nhận... ${txHash.slice(0, 10)}...` });
    }
  }, [txHash, isConfirming]);

  const [lookupHash, setLookupHash] = useState('');
  const [searchHash, setSearchHash] = useState<`0x${string}` | undefined>();
  const { proof, isLoading: isLoadingProof } = useProofData(searchHash);
  const [lookupStatus, setLookupStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const { revokeProof, txHash: revokeTxHash } = useRevokeProof();
  const [revokeTxHash_, setRevokeTxHash_] = useState<`0x${string}` | undefined>();
  const [revokeStatus, setRevokeStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const { isLoading: isRevokeConfirming, isSuccess: isRevokeConfirmed } =
    useWaitForTransactionReceipt({ hash: revokeTxHash_ });

  useEffect(() => {
    if (revokeTxHash) setRevokeTxHash_(revokeTxHash);
  }, [revokeTxHash]);

  useEffect(() => {
    if (isRevokeConfirmed) {
      setRevokeStatus({ type: 'success', message: 'Đã thu hồi bằng chứng thành công!' });
      setRevokeTxHash_(undefined);
    }
  }, [isRevokeConfirmed]);

  useEffect(() => {
    if (revokeTxHash_ && isRevokeConfirming) {
      setRevokeStatus({ type: 'info', message: `Đang chờ xác nhận thu hồi... ${revokeTxHash_.slice(0, 10)}...` });
    }
  }, [revokeTxHash_, isRevokeConfirming]);

  const handleLookup = () => {
    if (!lookupHash.startsWith('0x') || lookupHash.length !== 66) {
      setLookupStatus({ type: 'error', message: 'Vui lòng nhập hash hợp lệ (0x + 64 ký tự hex)' });
      return;
    }
    setLookupStatus(null);
    setSearchHash(lookupHash as `0x${string}`);
  };

  const handleRevokeProof = async () => {
    if (!proof || proof.revoked || !searchHash) return;
    setRevokeStatus(null);
    try {
      revokeProof(searchHash);
    } catch (error) {
      setRevokeStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Thu hồi thất bại'}` });
    }
  };

  const handleRegister = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    setIsSubmitting(true);
    try {
      registerProof(hash);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Giao dịch thất bại'}` });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">Đăng ký Hồ sơ Khoa học</h1>
        <p className="section-subtitle">Document Proof Registry</p>
      </div>

      {isConnected && (
        <RoleBanner
          address={address!}
          isEducation={isEducation}
          isScienceTech={isScienceTech}
          isAuthority={isAuthority}
          accent="blue"
        />
      )}

      <div className="card border-blue-500/20 glow-blue animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Đăng ký Hồ sơ</h2>
            <p className="text-xs text-slate-400">Tạo bằng chứng tồn tại cho tài liệu</p>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-300/80 flex items-start space-x-2">
            <span className="mt-0.5 shrink-0">ℹ️</span>
            <span>Tải lên tài liệu (PDF/PNG/JPEG) để tạo hash và đăng ký trên blockchain làm bằng chứng tồn tại. Hành động này không thể hoàn tác.</span>
          </p>
        </div>

        <FileUploader onHashGenerated={handleRegister} isUploading={isSubmitting} />
      </div>

      {status && (
        <div className={`mt-6 p-4 rounded-lg text-sm animate-fade-in ${
          status.type === 'success'
            ? 'bg-green-500/10 text-green-300 border border-green-500/20'
            : status.type === 'error'
            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
        }`}>
          {status.message}
        </div>
      )}

      <div className="mt-8 card border-blue-500/20 animate-fade-in-up">
        <details className="group">
          <summary className="flex items-center space-x-2 cursor-pointer list-none">
            <svg className="w-5 h-5 text-blue-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h3 className="text-lg font-bold text-slate-100">Tra cứu & Thu hồi bằng chứng</h3>
          </summary>
          <div className="mt-4 space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={lookupHash}
                onChange={(e) => setLookupHash(e.target.value)}
                placeholder="File hash (0x...)"
                className="input-field font-mono text-sm flex-1"
              />
              <button
                onClick={handleLookup}
                disabled={isLoadingProof}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {isLoadingProof ? 'Đang tra...' : 'Tra cứu'}
              </button>
            </div>

            {lookupStatus && (
              <div className={`p-3 rounded-lg text-sm ${
                lookupStatus.type === 'error'
                  ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                  : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              }`}>
                {lookupStatus.message}
              </div>
            )}

            {searchHash && !isLoadingProof && (
              <div className="bg-slate-800/60 rounded-lg p-4">
                {!proof || (proof.timestamp === 0n && proof.issuer === '0x0000000000000000000000000000000000000000') ? (
                  <p className="text-sm text-slate-400">Không tìm thấy bằng chứng cho hash này.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Ngày tạo</p>
                        <p className="text-slate-200 font-mono">{new Date(Number(proof.timestamp) * 1000).toLocaleString('vi-VN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Người phát hành</p>
                        <p className="text-slate-200 font-mono text-xs truncate" title={proof.issuer}>{proof.issuer}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${proof.revoked ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                        {proof.revoked ? 'Đã thu hồi' : 'Hiệu lực'}
                      </span>
                      {!proof.revoked && (
                        <button
                          onClick={handleRevokeProof}
                          disabled={!!revokeTxHash_ && isRevokeConfirming}
                          className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-30 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Thu hồi
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </details>
      </div>

      {revokeStatus && (
        <div className={`mt-4 p-4 rounded-lg text-sm animate-fade-in ${
          revokeStatus.type === 'success'
            ? 'bg-green-500/10 text-green-300 border border-green-500/20'
            : revokeStatus.type === 'error'
            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
        }`}>
          {revokeStatus.message}
        </div>
      )}
    </div>
  );
}

export default function ProtectedSciencePage() {
  return (
    <IssuerLayout>
      <ProtectedRoute requiredRole="science">
        <SciencePage />
      </ProtectedRoute>
    </IssuerLayout>
  );
}
