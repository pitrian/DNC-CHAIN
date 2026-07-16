import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';
import WalletConnect from '../components/WalletConnect';
import FileUploader from '../components/FileUploader';
import { useIsAuthority, useProofRegistry, useDegreeContract } from '../hooks/useContract';

export default function IssuerPage() {
  const { address, isConnected } = useAccount();
  const { isAuthority, isLoading: checkingRole } = useIsAuthority(address);
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
        const metadataUri = `https://dnc-certitrust.vercel.app/api/metadata/${hash}`;
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
        <h1 className="section-title">Issuer Portal</h1>
        <p className="section-subtitle">
          For government authorities to issue and register digital diplomas
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <WalletConnect />
      </div>

      {isConnected && (
        <>
          {checkingRole ? (
            <div className="card text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-dnc-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Verifying authorization...</p>
            </div>
          ) : !isAuthority ? (
            <div className="card text-center py-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-dnc-blue-900 mb-2">
                Unauthorized
              </h3>
              <p className="text-gray-600">
                Your wallet does not have the required AUTHORITY role.
                Please contact the system administrator (DEFAULT_ADMIN).
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold text-dnc-blue-900 mb-4">
                  Authorized as Authority
                </h3>

                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setMode('degree')}
                    className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                      mode === 'degree'
                        ? 'bg-dnc-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Mint Soulbound Diploma
                  </button>
                  <button
                    onClick={() => setMode('proof')}
                    className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors ${
                      mode === 'proof'
                        ? 'bg-dnc-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Register Document Proof
                  </button>
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
