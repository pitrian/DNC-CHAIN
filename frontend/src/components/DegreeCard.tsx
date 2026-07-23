import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useContracts, DEGREE_ABI } from '../hooks/useContract';
import { useEventPoller } from '../hooks/useEventPoller';
import { shortenAddress, formatTimestamp } from '../utils/hash';

interface DegreeEvent {
  tokenId: bigint;
  recipient: `0x${string}`;
  issuer: `0x${string}`;
  uri: string;
  timestamp: bigint;
}

export default function DegreeCard() {
  const { address } = useAccount();
  const { degreeAddress } = useContracts();
  const [degrees, setDegrees] = useState<DegreeEvent[]>([]);

  useEventPoller({
    address: degreeAddress,
    abi: DEGREE_ABI,
    eventName: 'DegreeMinted',
    interval: 2000,
    enabled: true,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args) {
          const ev = {
            tokenId: log.args.tokenId as bigint,
            recipient: log.args.recipient as `0x${string}`,
            issuer: log.args.issuer as `0x${string}`,
            uri: (log.args.uri as string) || '',
            timestamp: log.args.timestamp as bigint,
          };
          setDegrees((prev) => [ev, ...prev].slice(0, 50));
        }
      });
    },
  });

  const { data: userDegrees } = useReadContract({
    address: degreeAddress,
    abi: DEGREE_ABI,
    functionName: 'getDegreesByOwner',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 3000 },
  });

  return (
    <div className="space-y-4">
      {address && userDegrees && userDegrees.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-100 mb-3">
            My Degrees ({userDegrees.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {userDegrees.map((tokenId) => (
              <span
                key={tokenId.toString()}
                className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium"
              >
                Degree #{tokenId.toString()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-slate-100 mb-3">
          Recent Minted Degrees
        </h3>
        {degrees.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">
            Waiting for new degrees...
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {degrees.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-800/60 rounded-lg text-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-xs">
                      #{d.tokenId.toString()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">
                      To: {shortenAddress(d.recipient)}
                    </p>
                    <p className="text-xs text-slate-400">
                      By: {shortenAddress(d.issuer)} •{' '}
                      {formatTimestamp(d.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
