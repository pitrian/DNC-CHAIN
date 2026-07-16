import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { useProofData } from '../hooks/useContract';
import { truncateHash, formatTimestamp, shortenAddress } from '../utils/hash';

export default function VerifierPage() {
  const [currentHash, setCurrentHash] = useState<`0x${string}` | undefined>();
  const [manualHash, setManualHash] = useState('');
  const { proof, isLoading } = useProofData(currentHash);

  const exists = !!proof && proof.fileHash !== '0x0000000000000000000000000000000000000000000000000000000000000000';

  const handleHashGenerated = (hash: `0x${string}`, _file: File) => {
    setCurrentHash(hash);
  };

  const handleManualVerify = () => {
    const h = manualHash.trim() as `0x${string}`;
    if (!h.startsWith('0x') || h.length !== 66) {
      alert('Please enter a valid 64-character hex hash prefixed with 0x');
      return;
    }
    setCurrentHash(h);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="section-title">Document Verification</h1>
        <p className="section-subtitle">
          Verify the authenticity of any document by checking its hash on the blockchain
        </p>
      </div>

      <div className="space-y-8">
        <div className="card">
          <h3 className="font-semibold text-dnc-blue-900 mb-4">
            Upload Document to Verify
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop the document file. The system will compute its SHA-256 hash
            and check it against the blockchain registry.
          </p>
          <FileUploader
            onHashGenerated={handleHashGenerated}
            isUploading={isLoading}
          />
        </div>

        <div className="card">
          <h3 className="font-semibold text-dnc-blue-900 mb-4">
            Or Enter Hash Manually
          </h3>
          <div className="flex space-x-3">
            <input
              type="text"
              value={manualHash}
              onChange={(e) => setManualHash(e.target.value)}
              placeholder="0x..."
              className="input-field font-mono text-sm flex-1"
            />
            <button
              onClick={handleManualVerify}
              disabled={isLoading || !manualHash}
              className="btn-primary text-sm whitespace-nowrap"
            >
              {isLoading ? 'Checking...' : 'Verify'}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="card text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-dnc-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Checking document hash on blockchain...</p>
          </div>
        )}

        {!isLoading && currentHash && (
          <div
            className={`card border-2 ${
              exists ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  exists ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {exists ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold ${
                    exists ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {exists
                    ? 'Document is authentic'
                    : 'Document not found in registry'}
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hash:</span>
                    <span className="font-mono text-gray-800">
                      {truncateHash(currentHash)}
                    </span>
                  </div>
                  {exists && proof?.issuer && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Issuer:</span>
                      <span className="font-mono text-gray-800">
                        {shortenAddress(proof.issuer)}
                      </span>
                    </div>
                  )}
                  {exists && proof?.timestamp && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Registered:</span>
                      <span className="text-gray-800">
                        {formatTimestamp(proof.timestamp)}
                      </span>
                    </div>
                  )}
                  {exists && proof?.revoked !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={
                          proof.revoked
                            ? 'text-red-600 font-medium'
                            : 'text-green-600 font-medium'
                        }
                      >
                        {proof.revoked ? 'Revoked' : 'Active'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
