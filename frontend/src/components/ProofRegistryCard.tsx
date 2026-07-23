import React, { useState } from 'react';
import { useContracts, PROOF_REGISTRY_ABI, useProofData } from '../hooks/useContract';
import { useEventPoller } from '../hooks/useEventPoller';
import { shortenAddress, formatTimestamp, truncateHash } from '../utils/hash';

interface RegisteredProof {
  fileHash: string;
  issuer: string;
  timestamp: bigint;
}

interface VerifiedEvent {
  fileHash: string;
  verifier: string;
  valid: boolean;
}

export default function ProofRegistryCard() {
  const { proofRegistryAddress } = useContracts();
  const [proofs, setProofs] = useState<RegisteredProof[]>([]);
  const [verifiedEvents, setVerifiedEvents] = useState<VerifiedEvent[]>([]);
  const [lookupHash, setLookupHash] = useState('');
  const [activeLookup, setActiveLookup] = useState<`0x${string}` | undefined>();

  useEventPoller({
    address: proofRegistryAddress,
    abi: PROOF_REGISTRY_ABI,
    eventName: 'DocumentRegistered',
    interval: 2000,
    enabled: true,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args) {
          const fileHash = log.args.fileHash as string;
          if (!fileHash) return;
          setProofs((prev) => {
            if (prev.some((p) => p.fileHash === fileHash)) return prev;
            return [
              {
                fileHash,
                issuer: (log.args.issuer as string) || '',
                timestamp: (log.args.timestamp as bigint) || 0n,
              },
              ...prev,
            ].slice(0, 50);
          });
        }
      });
    },
  });

  useEventPoller({
    address: proofRegistryAddress,
    abi: PROOF_REGISTRY_ABI,
    eventName: 'DocumentVerified',
    interval: 2000,
    enabled: true,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args) {
          const fileHash = log.args.fileHash as string;
          if (!fileHash) return;
          setVerifiedEvents((prev) =>
            [
              {
                fileHash,
                verifier: (log.args.verifier as string) || '',
                valid: log.args.valid as boolean,
              },
              ...prev,
            ].slice(0, 50),
          );
        }
      });
    },
  });

  const { proof, isLoading, error } = useProofData(activeLookup);

  const handleLookup = () => {
    const trimmed = lookupHash.trim();
    if (!trimmed.startsWith('0x') || trimmed.length !== 66) return;
    setActiveLookup(trimmed as `0x${string}`);
  };

  const latestVerified = (fileHash: string) =>
    verifiedEvents.find((v) => v.fileHash === fileHash);

  return (
    <div className="card space-y-6">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
        <h3 className="font-semibold text-slate-100">Proof Registry</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Lookup Proof by File Hash
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={lookupHash}
            onChange={(e) => setLookupHash(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="0x... (file hash)"
            className="input-field font-mono text-sm flex-1"
          />
          <button
            onClick={handleLookup}
            disabled={!lookupHash.trim().startsWith('0x')}
            className="btn-primary text-sm"
          >
            Lookup
          </button>
        </div>
        {activeLookup && (
          <div className="mt-3 p-3 bg-slate-800/60 rounded-lg text-sm">
            {isLoading ? (
              <p className="text-slate-400">Loading...</p>
            ) : error ? (
              <p className="text-red-400 font-medium">Proof not found or not registered</p>
            ) : proof ? (
              <div className="space-y-1 font-mono text-xs">
                <p><span className="text-slate-400">Hash:</span> <span className="text-slate-200">{truncateHash(proof.fileHash, 16)}</span></p>
                <p><span className="text-slate-400">Issuer:</span> <span className="text-slate-200">{shortenAddress(proof.issuer)}</span></p>
                <p><span className="text-slate-400">Time:</span> <span className="text-slate-200">{formatTimestamp(proof.timestamp)}</span></p>
                <p>
                  <span className="text-slate-400">Status:</span>{' '}
                  <span className={proof.revoked ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>
                    {proof.revoked ? 'Revoked' : 'Valid'}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-2">
          Recent Registrations ({proofs.length})
        </h4>
        {proofs.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No proofs registered yet.</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {proofs.map((p, i) => {
              const v = latestVerified(p.fileHash);
              return (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-800/60 rounded-lg text-xs">
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="font-mono text-slate-300 truncate">{truncateHash(p.fileHash, 10)}</p>
                    <p className="text-slate-500">by {shortenAddress(p.issuer)}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-slate-500">{formatTimestamp(p.timestamp)}</span>
                    {v && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        v.valid ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {v.valid ? 'Valid' : 'Invalid'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {verifiedEvents.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-2">
            Recent Verifications ({verifiedEvents.length})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {verifiedEvents.slice(0, 10).map((v, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-slate-800/60 rounded-lg text-xs">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-mono text-slate-300 truncate">{truncateHash(v.fileHash, 10)}</p>
                  <p className="text-slate-500">by {shortenAddress(v.verifier)}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                  v.valid ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {v.valid ? 'Valid' : 'Invalid'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
