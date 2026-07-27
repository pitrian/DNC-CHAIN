import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../../components/FileUploader';
import ProtectedRoute from '../../components/ProtectedRoute';
import IssuerLayout from '../../components/IssuerLayout';
import RoleBanner from '../../components/RoleBanner';
import BatchIssuance from '../../components/BatchIssuance';
import { useIsAuthority, useIsEducation, useIsScienceTech, useDegreeContract } from '../../hooks/useContract';

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

  const handleMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!recipient || !recipient.startsWith('0x') || recipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui l\xf2ng nh\u1eadp \u0111\u1ecba ch\u1ec9 v\xed ng\u01b0\u1eddi nh\u1eadn h\u1ee3p l\u1ec7' });
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">C\u1ea5p v\u0103n b\u1eb1ng h\u1ecdc thu\u1eadt</h1>
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
            <h2 className="text-lg font-bold text-slate-100">C\u1ea5p v\u0103n b\u1eb1ng h\u1ecdc thu\u1eadt</h2>
            <p className="text-xs text-slate-400">Ph\xe1t h\xe0nh v\u0103n b\u1eb1ng t\u1ed1t nghi\u1ec7p, ch\u1ee9ng ch\u1ec9</p>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 mb-6">
          <p className="text-sm text-emerald-300/80 flex items-start space-x-2">
            <span className="mt-0.5 shrink-0">\u2139\ufe0f</span>
            <span>Ph\u1ea1m vi: Ch\u1ec9 c\u1ea5p b\u1eb1ng trong ph\u1ea1m vi tr\u01b0\u1eddng. Ch\u1ec9 thu h\u1ed3i \u0111\u01b0\u1ee3c v\u0103n b\u1eb1ng do m\xecnh ph\xe1t h\xe0nh.</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">\u0110\u1ecba ch\u1ec9 ng\u01b0\u1eddi nh\u1eadn</label>
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
