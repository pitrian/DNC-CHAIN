import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import FileUploader from '../components/FileUploader';
import ProtectedRoute from '../components/ProtectedRoute';
import IssuerLayout from '../components/IssuerLayout';
import {
  useIsAuthority,
  useIsEducation,
  useIsScienceTech,
  useProofRegistry,
  useDegreeContract,
} from '../hooks/useContract';
import { shortenAddress } from '../utils/hash';

function RoleBadge({
  label,
  active,
  color,
}: {
  label: string;
  active: boolean;
  color: 'emerald' | 'blue' | 'amber';
}) {
  const activeMap: Record<string, string> = {
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        active
          ? activeMap[color]
          : 'bg-slate-800 text-slate-600 border-slate-700/50'
      } transition-all duration-200`}
    >
      {label}
    </span>
  );
}

function RoleBanner({
  address,
  isEducation,
  isScienceTech,
  isAuthority,
}: {
  address: string;
  isEducation: boolean;
  isScienceTech: boolean;
  isAuthority: boolean;
}) {
  return (
    <div className="card mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-slate-500">V\xed kết nối</p>
            <p className="text-base font-mono font-bold text-slate-100">
              {shortenAddress(address)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <RoleBadge label="EDUCATION" active={isEducation} color="emerald" />
          <RoleBadge label="SCIENCE & TECH" active={isScienceTech} color="blue" />
          <RoleBadge label="AUTHORITY" active={isAuthority} color="amber" />
        </div>
      </div>
    </div>
  );
}

function BatchIssuance({ metadataType }: { metadataType: string }) {
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
      setStatus({ type: 'success', message: 'Batch mint ho\xe0n t\u1ea5t: ' + batchStatus.completed + ' th\xe0nh c\xf4ng, ' + batchStatus.failed + ' th\u1ea5t b\u1ea1i' });
      return;
    }
    if (!isConfirming && !txHash) {
      const addr = addresses[currentIndex].trim() as `0x${string}`;
      if (addr.startsWith('0x') && addr.length === 42) {
        const metadataUri = `${window.location.origin}/api/metadata/batch-${currentIndex}?type=${metadataType}`;
        mintDegree(addr, metadataUri);
      } else {
        setBatchStatus(prev => ({ ...prev, failed: prev.failed + 1 }));
        setCurrentIndex(prev => prev + 1);
      }
    }
  }, [batchStatus.running, currentIndex, isConfirming, txHash, addresses, mintDegree, metadataType]);

  useEffect(() => {
    if (isConfirmed && batchStatus.running) {
      setBatchStatus(prev => ({ ...prev, completed: prev.completed + 1 }));
      setCurrentIndex(prev => prev + 1);
      setActionTxHash(undefined);
    }
  }, [isConfirmed, batchStatus.running]);

  const getAddresses = (text: string) => {
    return text.split('\n').map(l => l.trim()).filter(l => l.startsWith('0x') && l.length === 42);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setInput(text);
      setAddresses(getAddresses(text));
    };
    reader.readAsText(file);
  };

  const handleStartBatch = () => {
    const parsed = getAddresses(input);
    setAddresses(parsed);
    if (!parsed.length) {
      setStatus({ type: 'error', message: 'Kh\xf4ng t\xecm th\u1ea5y \u0111\u1ecba ch\u1ec9 h\u1ee3p l\u1ec7 n\xe0o' });
      return;
    }
    setBatchStatus({ total: parsed.length, completed: 0, failed: 0, running: true });
    setCurrentIndex(0);
    setStatus({ type: 'info', message: 'B\u1eaft \u0111\u1ea7u batch mint ' + parsed.length + ' v\u0103n b\u1eb1ng...' });
  };

  const preview = getAddresses(input);

  return (
    <div className="mt-6 border-t border-slate-700/50 pt-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
        <h3 className="font-semibold text-slate-100">Batch Issuance \xb7 H\xe0ng lo\u1ea1t</h3>
      </div>
      <p className="text-sm text-slate-400 mb-4">
        D\xe1n danh s\xe1ch \u0111\u1ecba ch\u1ec9 (m\u1ed7i d\xf2ng m\u1ed9t \u0111\u1ecba ch\u1ec9) ho\u1eb7c upload file CSV \u0111\u1ec3 c\u1ea5p v\u0103n b\u1eb1ng h\xe0ng lo\u1ea1t.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={"0x1234...\n0x5678...\n0x9abc..."}
        rows={5}
        className="input-field font-mono text-sm mb-3"
      />

      <div className="flex items-center space-x-3 mb-4">
        <label className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-600 transition-colors">
          Upload CSV
          <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
        <span className="text-xs text-slate-500">CSV v\u1edbi c\u1ed9t "address" ho\u1eb7c TXT m\u1ed7i d\xf2ng m\u1ed9t \u0111\u1ecba ch\u1ec9</span>
      </div>

      {preview.length > 0 && (
        <div className="mb-4 p-3 bg-slate-800/60 rounded-lg">
          <p className="text-sm font-medium text-slate-300 mb-2">
            T\xecm th\u1ea5y {preview.length} \u0111\u1ecba ch\u1ec9:
          </p>
          <div className="max-h-24 overflow-y-auto space-y-1">
            {preview.slice(0, 20).map((addr, i) => (
              <div key={i} className="text-xs font-mono text-slate-400">{addr}</div>
            ))}
            {preview.length > 20 && (
              <div className="text-xs text-slate-500">...v\xe0 {preview.length - 20} \u0111\u1ecba ch\u1ec9 kh\xe1c</div>
            )}
          </div>
        </div>
      )}

      {batchStatus.running && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Ti\u1ebfn \u0111\u1ed9:</span>
            <span className="font-medium text-slate-100">{batchStatus.completed + batchStatus.failed} / {batchStatus.total}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((batchStatus.completed + batchStatus.failed) / batchStatus.total) * 100}%` }}
            />
          </div>
          <div className="flex space-x-4 mt-1 text-xs text-slate-500">
            <span>{batchStatus.completed}</span>
            <span>{batchStatus.failed}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleStartBatch}
        disabled={!preview.length || batchStatus.running}
        className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {batchStatus.running ? `\u0110ang mint (${batchStatus.completed + batchStatus.failed}/${batchStatus.total})...` : 'Batch Mint'}
      </button>

      {status && (
        <div className={`mt-3 p-3 rounded-lg text-sm ${
          status.type === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20'
            : status.type === 'error' ? 'bg-red-500/10 text-red-300 border border-red-500/20'
            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
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
  const canMintEducation = isEducation || isAuthority;
  const canAuthorityAction = isAuthority || isScienceTech;
  const isAllowed = canMintEducation || canAuthorityAction;

  const { registerProof, txHash: proofTxHash } = useProofRegistry();
  const { mintDegree, txHash: degreeTxHash } = useDegreeContract();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const [educationRecipient, setEducationRecipient] = useState('');
  const [authorityTab, setAuthorityTab] = useState<'certificate' | 'proof'>('certificate');
  const [certRecipient, setCertRecipient] = useState('');

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
      setStatus({
        type: 'info',
        message: `\u0110ang ch\u1edd x\xe1c nh\u1eadn... ${txHash.slice(0, 10)}...`,
      });
    }
  }, [txHash, isConfirming]);

  const handleEducationMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!educationRecipient || !educationRecipient.startsWith('0x') || educationRecipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui l\xf2ng nh\u1eadp \u0111\u1ecba ch\u1ec9 v\xed ng\u01b0\u1eddi nh\u1eadn h\u1ee3p l\u1ec7' });
      return;
    }
    setIsSubmitting(true);
    try {
      const metadataUri = `${window.location.origin}/api/metadata/${hash}?type=ACADEMIC_DEGREE`;
      mintDegree(educationRecipient as `0x${string}`, metadataUri);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: `${error instanceof Error ? error.message : 'Giao d\u1ecbch th\u1ea5t b\u1ea1i'}` });
      setIsSubmitting(false);
    }
  };

  const handleCertificateMint = async (hash: `0x${string}`, _file: File) => {
    setStatus(null);
    if (!certRecipient || !certRecipient.startsWith('0x') || certRecipient.length !== 42) {
      setStatus({ type: 'error', message: 'Vui l\xf2ng nh\u1eadp \u0111\u1ecba ch\u1ec9 v\xed ng\u01b0\u1eddi nh\u1eadn h\u1ee3p l\u1ec7' });
      return;
    }
    setIsSubmitting(true);
    try {
      const metadataUri = `${window.location.origin}/api/metadata/${hash}?type=CITY_CERTIFICATE`;
      mintDegree(certRecipient as `0x${string}`, metadataUri);
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="section-title">Issuing Authority Portal</h1>
        <p className="section-subtitle">
          C\u1ed5ng th\xf4ng tin c\u1ea5p ph\xe1t v\u0103n b\u1eb1ng v\xe0 ch\u1ee9ng nh\u1eadn
        </p>
      </div>

      {!isConnected && (
        <div className="card text-center py-12">
          <p className="text-slate-400 mb-4">
            K\u1ebft n\u1ed1i v\xed \u0111\u1ec3 truy c\u1eadp c\u1ed5ng Issuer.
          </p>
          <p className="text-sm text-slate-500">
            Ch\u1ec9 t\xe0i kho\u1ea3n \u0111\u01b0\u1ee3c \u1ee7y quy\u1ec1n m\u1edbi c\xf3 th\u1ec3 c\u1ea5p v\u0103n b\u1eb1ng.
          </p>
        </div>
      )}

      {isConnected && !isAllowed && (
        <>
          <RoleBanner
            address={address!}
            isEducation={isEducation}
            isScienceTech={isScienceTech}
            isAuthority={isAuthority}
          />
          <div className="card text-center py-8">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">
              Kh\xf4ng c\xf3 quy\u1ec1n truy c\u1eadp
            </h3>
            <p className="text-slate-400">
              V\xed c\u1ee7a b\u1ea1n ch\u01b0a \u0111\u01b0\u1ee3c c\u1ea5p quy\u1ec1n. Vui l\xf2ng li\xean h\u1ec7 qu\u1ea3n tr\u1ecb vi\xean (DEFAULT_ADMIN).
            </p>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
              <p>\u2022 <strong>EDUCATION_ROLE</strong>: C\u1ea5p v\u0103n b\u1eb1ng (S\u1edf GD&\u0110T)</p>
              <p>\u2022 <strong>SCIENCE_TECH_ROLE</strong>: \u0110\u0103ng k\xfd h\u1ed3 s\u01a1 (S\u1edf KH&CN)</p>
              <p>\u2022 <strong>AUTHORITY_ROLE</strong>: To\xe0n quy\u1ec1n</p>
            </div>
          </div>
        </>
      )}

      {isConnected && isAllowed && (
        <div className="space-y-8">
          <RoleBanner
            address={address!}
            isEducation={isEducation}
            isScienceTech={isScienceTech}
            isAuthority={isAuthority}
          />

          {canMintEducation && (
            <div className="card border-emerald-500/20 glow-emerald animate-fade-in-up stagger-1">
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
                  <p className="text-xs text-slate-400">Academic Degree Issuance</p>
                </div>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 mb-6">
                <p className="text-sm text-emerald-300/80 flex items-start space-x-2">
                  <span className="mt-0.5 shrink-0">\u2139\ufe0f</span>
                  <span>Ph\u1ea1m vi: Ch\u1ec9 c\u1ea5p b\u1eb1ng trong ph\u1ea1m vi tr\u01b0\u1eddng. Ch\u1ec9 thu h\u1ed3i \u0111\u01b0\u1ee3c v\u0103n b\u1eb1ng do m\xecnh ph\xe1t h\xe0nh.</span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  \u0110\u1ecba ch\u1ec9 ng\u01b0\u1eddi nh\u1eadn
                </label>
                <input
                  type="text"
                  value={educationRecipient}
                  onChange={(e) => setEducationRecipient(e.target.value)}
                  placeholder="0x..."
                  className="input-field font-mono text-sm"
                />
              </div>

              <FileUploader
                onHashGenerated={handleEducationMint}
                isUploading={isSubmitting}
              />

              <BatchIssuance metadataType="ACADEMIC_DEGREE" />
            </div>
          )}

          {canAuthorityAction && (
            <div className="card border-amber-500/20 glow-amber animate-fade-in-up stagger-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Ch\u1ee9ng nh\u1eadn & H\u1ed3 s\u01a1 c\u1ea5p Th\xe0nh ph\u1ed1</h2>
                  <p className="text-xs text-slate-400">City Certificate & Document Registry</p>
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mb-6">
                <p className="text-sm text-amber-300/80 flex items-start space-x-2">
                  <span className="mt-0.5 shrink-0">\u2139\ufe0f</span>
                  <span>Ph\u1ea1m vi: To\xe0n th\xe0nh ph\u1ed1. C\xf3 th\u1ec3 thu h\u1ed3i m\u1ecdi v\u0103n b\u1eb1ng \u0111\xe3 c\u1ea5p.</span>
                </p>
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setAuthorityTab('certificate')}
                  className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                    authorityTab === 'certificate'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Ch\u1ee9ng nh\u1eadn c\u1ea5p TP
                </button>
                <button
                  onClick={() => setAuthorityTab('proof')}
                  className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                    authorityTab === 'proof'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  \u0110\u0103ng k\xfd h\u1ed3 s\u01a1
                </button>
              </div>

              {authorityTab === 'certificate' && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      \u0110\u1ecba ch\u1ec9 ng\u01b0\u1eddi nh\u1eadn
                    </label>
                    <input
                      type="text"
                      value={certRecipient}
                      onChange={(e) => setCertRecipient(e.target.value)}
                      placeholder="0x..."
                      className="input-field font-mono text-sm"
                    />
                  </div>
                  <FileUploader
                    onHashGenerated={handleCertificateMint}
                    isUploading={isSubmitting}
                  />
                </>
              )}

              {authorityTab === 'proof' && (
                <div>
                  <p className="text-sm text-slate-400 mb-4">
                    T\u1ea3i l\xean t\xe0i li\u1ec7u \u0111\u1ec3 \u0111\u0103ng k\xfd hash tr\xean blockchain l\xe0m b\u1eb1ng ch\u1ee9ng t\u1ed3n t\u1ea1i.
                  </p>
                  <FileUploader
                    onHashGenerated={handleProofRegister}
                    isUploading={isSubmitting}
                  />
                </div>
              )}
            </div>
          )}

          {status && (
            <div className={`p-4 rounded-lg text-sm animate-fade-in ${
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
      )}
    </div>
  );
}

export default function ProtectedIssuerPage() {
  return (
    <IssuerLayout>
      <ProtectedRoute requiredRole="issuer">
        <IssuerPage />
      </ProtectedRoute>
    </IssuerLayout>
  );
}
