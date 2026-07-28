import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../../components/FileUploader';
import ProtectedRoute from '../../components/ProtectedRoute';
import IssuerLayout from '../../components/IssuerLayout';
import RoleBanner from '../../components/RoleBanner';
import BatchIssuance from '../../components/BatchIssuance';
import { useIsAuthority, useIsEducation, useIsScienceTech, useDegreeContract, useProofRegistry, useDegreesByOwner, useRevokeDegree, useDegreeTokenURI, useDegreeLocked, useProofData, useRevokeProof } from '../../hooks/useContract';

type Tab = 'certificate' | 'education' | 'proof';

function AuthorityPage() {
  const { address, isConnected } = useAccount();
  const { isEducation } = useIsEducation(address);
  const { isScienceTech } = useIsScienceTech(address);
  const { isAuthority } = useIsAuthority(address);
  const { mintDegree, txHash: degreeTxHash } = useDegreeContract();
  const { registerProof, txHash: proofTxHash } = useProofRegistry();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('certificate');
  const [recipient, setRecipient] = useState('');

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (degreeTxHash) setTxHash(degreeTxHash);
  }, [degreeTxHash]);

  useEffect(() => {
    if (proofTxHash) setTxHash(proofTxHash);
  }, [proofTxHash]);

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

  const handleCertificateMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui lòng nhập địa chỉ người nhận hợp lệ' });
      return;
    }
    setIsSubmitting(true);
    try {
      const metadataUri = `${window.location.origin}/api/metadata/${hash}?type=CITY_CERTIFICATE`;
      mintDegree(recipient as `0x${string}`, metadataUri);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Giao dịch thất bại'}` });
      setIsSubmitting(false);
    }
  };

  const handleEducationMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui lòng nhập địa chỉ người nhận hợp lệ' });
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

  const handleProofRegister = async (hash: `0x${string}`, _file: File) => {
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

  const handleDegreeLookup = () => {
    if (!lookupOwner.startsWith('0x') || lookupOwner.length !== 42) {
      setBurnStatus({ type: 'error', message: 'Vui lòng nhập địa chỉ ví hợp lệ' });
      return;
    }
    setBurnStatus(null);
    setSearchOwner(lookupOwner as `0x${string}`);
  };

  const handleRevokeDegree = async (tokenId: bigint) => {
    setBurnStatus(null);
    try {
      burnDegree(tokenId);
    } catch (error) {
      setBurnStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Thu hồi thất bại'}` });
    }
  };

  const [lookupHash, setLookupHash] = useState('');
  const [searchHash, setSearchHash] = useState<`0x${string}` | undefined>();
  const { proof, isLoading: isLoadingProof } = useProofData(searchHash);
  const [proofLookupStatus, setProofLookupStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
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

  const handleProofLookup = () => {
    if (!lookupHash.startsWith('0x') || lookupHash.length !== 66) {
      setProofLookupStatus({ type: 'error', message: 'Vui lòng nhập hash hợp lệ (0x + 64 ký tự hex)' });
      return;
    }
    setProofLookupStatus(null);
    setSearchHash(lookupHash as `0x${string}`);
  };

  const handleRevokeProofAction = async () => {
    if (!proof || proof.revoked || !searchHash) return;
    setRevokeStatus(null);
    try {
      revokeProof(searchHash);
    } catch (error) {
      setRevokeStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Thu hồi thất bại'}` });
    }
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'certificate', label: 'Chứng nhận cấp TP', icon: '🏆' },
    { key: 'education', label: 'Văn bằng học thuật', icon: '🎓' },
    { key: 'proof', label: 'Đăng ký hồ sơ', icon: '📄' },
  ];

  const getFileUploader = () => {
    switch (activeTab) {
      case 'certificate':
        return (
          <FileUploader onHashGenerated={handleCertificateMint} isUploading={isSubmitting} />
        );
      case 'education':
        return (
          <FileUploader onHashGenerated={handleEducationMint} isUploading={isSubmitting} />
        );
      case 'proof':
        return (
          <FileUploader onHashGenerated={handleProofRegister} isUploading={isSubmitting} />
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
          </svg>
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">AUTHORITY · Full Access</span>
        </div>
        <h1 className="section-title">Cổng Quản lý Cấp Thành phố</h1>
        <p className="section-subtitle">City Authority Management Portal</p>
      </div>

      {isConnected && (
        <RoleBanner
          address={address!}
          isEducation={isEducation}
          isScienceTech={isScienceTech}
          isAuthority={isAuthority}
          accent="amber"
        />
      )}

      <div className="card border-amber-500/20 glow-amber animate-fade-in-up">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Quản lý Toàn diện</h2>
            <p className="text-xs text-slate-400">Cấp chứng nhận, văn bằng và đăng ký hồ sơ</p>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mb-6">
          <p className="text-sm text-amber-300/80 flex items-start space-x-2">
            <span className="mt-0.5 shrink-0">⚠️</span>
            <span>Phạm vi: Toàn thành phố. Có thể thu hồi mọi văn bằng đã cấp và thực hiện tất cả chức năng cấp phát.</span>
          </p>
        </div>

        <div className="flex space-x-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setStatus(null); }}
              className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'proof' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Địa chỉ người nhận
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

        {activeTab === 'proof' && (
          <p className="text-sm text-slate-400 mb-4">
            Tải lên tài liệu để đăng ký hash trên blockchain làm bằng chứng tồn tại.
          </p>
        )}

        {getFileUploader()}

        <div className="mt-6 border-t border-amber-500/10 pt-6">
          <BatchIssuance metadataType={activeTab === 'education' ? 'ACADEMIC_DEGREE' : 'CITY_CERTIFICATE'} accent="amber" />
        </div>
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

      <div className="mt-8 space-y-6">
        <div className="card border-amber-500/20 animate-fade-in-up">
          <details className="group">
            <summary className="flex items-center space-x-2 cursor-pointer list-none">
              <svg className="w-5 h-5 text-amber-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  onClick={handleDegreeLookup}
                  disabled={isLoadingDegrees}
                  className="px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
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
                        <div key={id.toString()} className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-3">
                          <DegreeInfo tokenId={id} />
                          <button
                            onClick={() => handleRevokeDegree(id)}
                            disabled={!!burnTxHash_ && isBurnConfirming}
                            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-30 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Thu hồi
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </details>
        </div>

        {burnStatus && (
          <div className={`p-4 rounded-lg text-sm animate-fade-in ${
            burnStatus.type === 'success'
              ? 'bg-green-500/10 text-green-300 border border-green-500/20'
              : burnStatus.type === 'error'
              ? 'bg-red-500/10 text-red-300 border border-red-500/20'
              : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
          }`}>
            {burnStatus.message}
          </div>
        )}

        <div className="card border-amber-500/20 animate-fade-in-up">
          <details className="group">
            <summary className="flex items-center space-x-2 cursor-pointer list-none">
              <svg className="w-5 h-5 text-amber-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <h3 className="text-lg font-bold text-slate-100">Tra cứu & Thu hồi bằng chứng hồ sơ</h3>
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
                  onClick={handleProofLookup}
                  disabled={isLoadingProof}
                  className="px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  {isLoadingProof ? 'Đang tra...' : 'Tra cứu'}
                </button>
              </div>

              {proofLookupStatus && (
                <div className={`p-3 rounded-lg text-sm ${
                  proofLookupStatus.type === 'error'
                    ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                    : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                }`}>
                  {proofLookupStatus.message}
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
                            onClick={handleRevokeProofAction}
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
          <div className={`p-4 rounded-lg text-sm animate-fade-in ${
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
    </div>
  );
}

function DegreeInfo({ tokenId }: { tokenId: bigint }) {
  const { uri } = useDegreeTokenURI(tokenId);
  const { locked } = useDegreeLocked(tokenId);
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-mono text-amber-300">#{tokenId.toString()}</span>
      {uri && <span className="text-xs text-slate-500 truncate max-w-[200px]">{uri}</span>}
      <span className={`text-xs px-2 py-0.5 rounded-full ${locked ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
        {locked ? 'Đã khóa' : 'Hoạt động'}
      </span>
    </div>
  );
}

export default function ProtectedAuthorityPage() {
  return (
    <IssuerLayout>
      <ProtectedRoute requiredRole="authority">
        <AuthorityPage />
      </ProtectedRoute>
    </IssuerLayout>
  );
}
