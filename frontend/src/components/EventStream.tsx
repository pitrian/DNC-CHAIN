import React, { useState, useEffect, useRef } from 'react';
import { useContracts, PROOF_REGISTRY_ABI, DEGREE_ABI } from '../hooks/useContract';
import { useEventPoller } from '../hooks/useEventPoller';
import { formatTimestamp, shortenAddress, truncateHash } from '../utils/hash';

interface Event {
  type: 'registered' | 'verified' | 'revoked' | 'minted';
  hash: string;
  actor: string;
  timestamp: number;
  valid?: boolean;
  tokenId?: bigint;
}

export default function EventStream() {
  const { proofRegistryAddress, degreeAddress } = useContracts();
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const listRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEventPoller({
    address: proofRegistryAddress,
    abi: PROOF_REGISTRY_ABI,
    eventName: 'DocumentRegistered',
    interval: 2000,
    enabled: true,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args) {
          setEvents((prev) => [
            {
              type: 'registered',
              hash: (log.args.fileHash as string) || '',
              actor: (log.args.issuer as string) || '',
              timestamp: Number(log.args.timestamp || 0n),
            },
            ...prev,
          ]);
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
          setEvents((prev) => [
            {
              type: 'verified',
              hash: (log.args.fileHash as string) || '',
              actor: (log.args.verifier as string) || '',
              timestamp: Date.now(),
              valid: log.args.valid as boolean,
            },
            ...prev,
          ]);
        }
      });
    },
  });

  useEventPoller({
    address: degreeAddress,
    abi: DEGREE_ABI,
    eventName: 'DegreeMinted',
    interval: 2000,
    enabled: true,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args) {
          setEvents((prev) => [
            {
              type: 'minted',
              hash: (log.args.recipient as string) || '',
              actor: (log.args.issuer as string) || '',
              timestamp: Number(log.args.timestamp || 0n),
              tokenId: log.args.tokenId as bigint,
            },
            ...prev,
          ]);
        }
      });
    },
  });

  useEffect(() => {
    if (autoScroll && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [events, autoScroll]);

  const filtered = events.filter((e) => filter === 'all' || e.type === filter);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'registered':
        return 'border-l-green-500';
      case 'verified':
        return 'border-l-blue-500';
      case 'revoked':
        return 'border-l-red-500';
      case 'minted':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'registered':
        return 'Registered';
      case 'verified':
        return 'Verified';
      case 'revoked':
        return 'Revoked';
      case 'minted':
        return 'Minted';
      default:
        return type;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">Event Stream</h3>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded"
            />
            <span>Auto-scroll</span>
          </label>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
          {['all', 'registered', 'verified', 'revoked', 'minted'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f
                ? 'bg-dnc-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div
        ref={listRef}
        className="space-y-1 max-h-96 overflow-y-auto"
      >
        {filtered.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">
            No events yet. Mint a degree or register a proof to see events.
          </p>
        ) : (
          filtered.map((event, i) => (
            <div
              key={i}
              className={`flex items-start space-x-3 p-2 border-l-4 ${getEventColor(
                event.type
              )} bg-slate-800/60 rounded-r-lg`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      event.type === 'registered'
                        ? 'bg-green-500/20 text-green-300'
                        : event.type === 'verified'
                        ? 'bg-blue-500/20 text-blue-300'
                        : event.type === 'minted'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {getEventLabel(event.type)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatTimestamp(BigInt(event.timestamp))}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {event.tokenId
                    ? `Degree #${event.tokenId.toString()}`
                    : truncateHash(event.hash)}
                </p>
                <p className="text-xs text-slate-500">
                  {shortenAddress(event.actor)}
                  {event.valid !== undefined && (
                    <span
                        className={
                          event.valid
                            ? 'text-green-400 ml-2'
                            : 'text-red-400 ml-2'
                        }
                    >
                      • {event.valid ? 'Valid' : 'Invalid'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
