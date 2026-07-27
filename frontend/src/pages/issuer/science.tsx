import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../../components/FileUploader';
import ProtectedRoute from '../../components/ProtectedRoute';
import IssuerLayout from '../../components/IssuerLayout';
import RoleBanner from '../../components/RoleBanner';
import { useIsAuthority, useIsEducation, useIsScienceTech, useProofRegistry } from '../../hooks/useContract';

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
      setStatus({ type: 'success', message: '\u0110\xe3 \u0111\u0103ng k\xfd h\u1ed3 s\u01a1 th\xe0nh c\xf4ng!' });
      setIsSubmitting(false);
      setTxHash(undefined);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (txHash && isConfirming) {
      setStatus({ type: 'info', message: `\u0110ang ch\u1edd x\xe1c nh\u1eadn... ${txHash.slice(0, 10)}...` });
    }
  }, [txHash, isConfirming]);

  const handleRegister = async (hash: `0x${string}`, _file: File) => {
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">\u0110\u0103ng k\xfd H\u1ed3 s\u01a1 Khoa h\u1ecdc</h1>
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
            <h2 className="text-lg font-bold text-slate-100">\u0110\u0103ng k\xfd H\u1ed3 s\u01a1</h2>
            <p className="text-xs text-slate-400">T\u1ea1o b\u1eb1ng ch\u1ee9ng t\u1ed3n t\u1ea1i cho t\xe0i li\u1ec7u</p>
          </div>
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-300/80 flex items-start space-x-2">
            <span className="mt-0.5 shrink-0">\u2139\ufe0f</span>
            <span>T\u1ea3i l\xean t\xe0i li\u1ec7u (PDF/PNG/JPEG) \u0111\u1ec3 t\u1ea1o hash v\xe0 \u0111\u0103ng k\xfd tr\xean blockchain l\xe0m b\u1eb1ng ch\u1ee9ng t\u1ed3n t\u1ea1i. H\xe0nh \u0111\u1ed9ng n\xe0y kh\xf4ng th\u1ec3 ho\xe0n t\xe1c.</span>
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
