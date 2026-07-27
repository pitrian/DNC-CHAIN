import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../../components/FileUploader';
import ProtectedRoute from '../../components/ProtectedRoute';
import IssuerLayout from '../../components/IssuerLayout';
import RoleBanner from '../../components/RoleBanner';
import BatchIssuance from '../../components/BatchIssuance';
import { useIsAuthority, useIsEducation, useIsScienceTech, useDegreeContract, useProofRegistry } from '../../hooks/useContract';

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
      setStatus({ type: 'success', message: 'Giao d\u1ecbch \u0111\xe3 \u0111\u01b0\u1ee3c x\xe1c nh\u1eadn th\xe0nh c\xf4ng!' });
      setIsSubmitting(false);
      setTxHash(undefined);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (txHash && isConfirming) {
      setStatus({ type: 'info', message: `\u0110ang ch\u1edd x\xe1c nh\u1eadn... ${txHash.slice(0, 10)}...` });
    }
  }, [txHash, isConfirming]);

  const handleCertificateMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui l\xf2ng nh\u1eadp \u0111\u1ecba ch\u1ec9 ng\u01b0\u1eddi nh\u1eadn h\u1ee3p l\u1ec7' });
      return;
    }
    setIsSubmitting(true);
    try {
      const metadataUri = `${window.location.origin}/api/metadata/${hash}?type=CITY_CERTIFICATE`;
      mintDegree(recipient as `0x${string}`, metadataUri);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Giao d\u1ecbch th\u1ea5t b\u1ea1i'}` });
      setIsSubmitting(false);
    }
  };

  const handleEducationMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui l\xf2ng nh\u1eadp \u0111\u1ecba ch\u1ec9 ng\u01b0\u1eddi nh\u1eadn h\u1ee3p l\u1ec7' });
      return;
    }
    setIsSubmitting(true);
    try {
      const metadataUri = `${window.location.origin}/api/metadata/${hash}?type=ACADEMIC_DEGREE`;
      mintDegree(recipient as `0x${string}`, metadataUri);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Giao d\u1ecbch th\u1ea5t b\u1ea1i'}` });
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
      setStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Giao d\u1ecbch th\u1ea5t b\u1ea1i'}` });
      setIsSubmitting(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'certificate', label: 'Ch\u1ee9ng nh\u1eadn c\u1ea5p TP', icon: '\ud83c\udfc6' },
    { key: 'education', label: 'V\u0103n b\u1eb1ng h\u1ecdc thu\u1eadt', icon: '\ud83c\udf93' },
    { key: 'proof', label: '\u0110\u0103ng k\xfd h\u1ed3 s\u01a1', icon: '\ud83d\udcc4' },
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
        <h1 className="section-title">C\u1ed5ng Qu\u1ea3n l\xfd C\u1ea5p Th\xe0nh ph\u1ed1</h1>
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
            <h2 className="text-lg font-bold text-slate-100">Qu\u1ea3n l\xfd To\xe0n di\u1ec7n</h2>
            <p className="text-xs text-slate-400">C\u1ea5p ch\u1ee9ng nh\u1eadn, v\u0103n b\u1eb1ng v\xe0 \u0111\u0103ng k\xfd h\u1ed3 s\u01a1</p>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mb-6">
          <p className="text-sm text-amber-300/80 flex items-start space-x-2">
            <span className="mt-0.5 shrink-0">\u26a0\ufe0f</span>
            <span>Ph\u1ea1m vi: To\xe0n th\xe0nh ph\u1ed1. C\xf3 th\u1ec3 thu h\u1ed3i m\u1ecdi v\u0103n b\u1eb1ng \u0111\xe3 c\u1ea5p v\xe0 th\u1ef1c hi\u1ec7n t\u1ea5t c\u1ea3 ch\u1ee9c n\u0103ng c\u1ea5p ph\xe1t.</span>
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
              \u0110\u1ecba ch\u1ec9 ng\u01b0\u1eddi nh\u1eadn
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
            T\u1ea3i l\xean t\xe0i li\u1ec7u \u0111\u1ec3 \u0111\u0103ng k\xfd hash tr\xean blockchain l\xe0m b\u1eb1ng ch\u1ee9ng t\u1ed3n t\u1ea1i.
          </p>
        )}

        {getFileUploader()}

        <div className="mt-6 border-t border-amber-500/10 pt-6">
          <BatchIssuance metadataType={activeTab === 'education' ? 'ACADEMIC_DEGREE' : 'CITY_CERTIFICATE'} />
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
