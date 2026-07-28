import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../../components/FileUploader';
import ProtectedRoute from '../../components/ProtectedRoute';
import IssuerLayout from '../../components/IssuerLayout';
import RoleBanner from '../../components/RoleBanner';
import BatchIssuance from '../../components/BatchIssuance';
import { useIsAuthority, useIsEducation, useIsScienceTech, useDegreeContract, useDegreesByOwner, useRevokeDegree, useDegreeTokenURI, useDegreeLocked } from '../../hooks/useContract';

function EducationPage() {
  const { address, isConnected } = useAccount();
  const { isEducation } = useIsEducation(address);
  const { isAuthority } = useIsAuthority(address);
  const { isScienceTech } = useIsScienceTech(address);
  const { mintDegree, txHash: degreeTxHash } = useDegreeContract();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [recipient, setRecipient] = useState('');

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (degreeTxHash) setTxHash(degreeTxHash);
  }, [degreeTxHash]);

  useEffect(() => {
    if (isConfirmed) {
      setStatus({ type: 'success', message: 'Giao dịch đã được xác nhận thành công!' });
      setIsSubmitting(false);
      setTxHash(undefined);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (txHash && isConfirming) {
      setStatus({ type: 'info', message: `Đang chờ xác nhận... ${txHash.slice(0, 10)}...` });
    }
  }, [txHash, isConfirming]);

  const handleMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui lòng nhập địa chỉ ví người nhận hợp lệ' });
      return;
    }
    setIsSubmitting(true);
    try {
      const metadataUri = `${window.location.origin}/api/metadata/${hash}?type=ACADEMIC_DEGREE`;
      mintDegree(recipient as `0x${string}`, metadataUri);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Giao dịch thất bại'}` });
      setIsSubmitting(false);
    }
  };

  const [lookupOwner, setLookupOwner] = useState('');
  const [searchOwner, setSearchOwner] = useState<`0x${string}` | undefined>();
  const { tokenIds, isLoading: isLoadingDegrees } = useDegreesByOwner(searchOwner);
  const { burnDegree, txHash: burnTxHash } = useRevokeDegree();
  const [burnTxHash_, setBurnTxHash_] = useState<`0x${string}` | undefined>();
  const [burnStatus, setBurnStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const { isLoading: isBurnConfirming, isSuccess: isBurnConfirmed } =
    useWaitForTransactionReceipt({ hash: burnTxHash_ });

  useEffect(() => {
    if (burnTxHash) setBurnTxHash_(burnTxHash);
  }, [burnTxHash]);

  useEffect(() => {
    if (isBurnConfirmed) {
      setBurnStatus({ type: 'success', message: 'Đã thu hồi văn bằng thành công!' });
      setBurnTxHash_(undefined);
    }
  }, [isBurnConfirmed]);

  useEffect(() => {
    if (burnTxHash_ && isBurnConfirming) {
      setBurnStatus({ type: 'info', message: `Đang chờ xác nhận thu hồi... ${burnTxHash_.slice(0, 10)}...` });
    }
  }, [burnTxHash_, isBurnConfirming]);

  const handleLookup = () => {
    if (!lookupOwner.startsWith('0x') || lookupOwner.length !== 42) {
      setBurnStatus({ type: 'error', message: 'Vui lòng nhập địa chỉ ví hợp lệ' });
      return;
    }
    setBurnStatus(null);
    setSearchOwner(lookupOwner as `0x${string}`);
  };

  const handleRevoke = async (tokenId: bigint) => {
    setBurnStatus(null);
    try {
      burnDegree(tokenId);
    } catch (error) {
      setBurnStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Thu hồi thất bại'}` });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">Cấp văn bằng học thuật</h1>
        <p className="section-subtitle">Academic Degree Issuance</p>
      </div>

      {isConnected && (
        <RoleBanner
          address={address!}
          isEducation={isEducation}
          isScienceTech={isScienceTech}
          isAuthority={isAuthority}
          accent="emerald"
        />
      )}

      <div className="card border-emerald-500/20 glow-emerald animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Cấp văn bằng học thuật</h2>
            <p className="text-xs text-slate-400">Phát hành văn bằng tốt nghiệp, chứng chỉ</p>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300/80 flex items-start space-x-2">
            <span className="mt-0.5 shrink-0">ℹ️</span>
            <span>Phạm vi: Chỉ cấp bằng trong phạm vi trường. Chỉ thu hồi được văn bằng do mình phát hành.</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">Địa chỉ người nhận</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="input-field font-mono text-sm"
          />
        </div>

        <FileUploader onHashGenerated={handleMint} isUploading={isSubmitting} />

        <BatchIssuance metadataType="ACADEMIC_DEGREE" />
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

      <div className="mt-8 card border-emerald-500/20 animate-fade-in-up">
        <details className="group">
          <summary className="flex items-center space-x-2 cursor-pointer list-none">
            <svg className="w-5 h-5 text-emerald-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h3 className="text-lg font-bold text-slate-100">Tra cứu & Thu hồi văn bằng</h3>
          </summary>
          <div className="mt-4 space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={lookupOwner}
                onChange={(e) => setLookupOwner(e.target.value)}
                placeholder="Địa chỉ ví người sở hữu (0x...)"
                className="input-field font-mono text-sm flex-1"
              />
              <button
                onClick={handleLookup}
                disabled={isLoadingDegrees}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {isLoadingDegrees ? 'Đang tra...' : 'Tra cứu'}
              </button>
            </div>

            {searchOwner && !isLoadingDegrees && (
              <div className="bg-slate-800/60 rounded-lg p-4">
                {tokenIds.length === 0 ? (
                  <p className="text-sm text-slate-400">Không tìm thấy văn bằng nào.</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400 mb-2">Tìm thấy {tokenIds.length} văn bằng:</p>
                    {tokenIds.map((id) => (
                      <DegreeRow
                        key={id.toString()}
                        tokenId={id}
                        onRevoke={handleRevoke}
                        disabled={!!burnTxHash_ && isBurnConfirming}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </details>
      </div>

      {burnStatus && (
        <div className={`mt-4 p-4 rounded-lg text-sm animate-fade-in ${
          burnStatus.type === 'success'
            ? 'bg-green-500/10 text-green-300 border border-green-500/20'
            : burnStatus.type === 'error'
            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
        }`}>
          {burnStatus.message}
        </div>
      )}
    </div>
  );
}

function DegreeRow({ tokenId, onRevoke, disabled }: { tokenId: bigint; onRevoke: (id: bigint) => void; disabled: boolean }) {
  const { uri } = useDegreeTokenURI(tokenId);
  const { locked } = useDegreeLocked(tokenId);
  return (
    <div className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-3">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-mono text-emerald-300">#{tokenId.toString()}</span>
        {uri && <span className="text-xs text-slate-500 truncate max-w-[200px]">{uri}</span>}
        <span className={`text-xs px-2 py-0.5 rounded-full ${locked ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
          {locked ? 'Đã khóa' : 'Hoạt động'}
        </span>
      </div>
      <button
        onClick={() => onRevoke(tokenId)}
        disabled={disabled || locked}
        className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-30 text-white text-xs font-medium rounded-lg transition-colors"
      >
        Thu hồi
      </button>
    </div>
  );
}

export default function ProtectedEducationPage() {
  return (
    <IssuerLayout>
      <ProtectedRoute requiredRole="education">
        <EducationPage />
      </ProtectedRoute>
    </IssuerLayout>
  );
}
