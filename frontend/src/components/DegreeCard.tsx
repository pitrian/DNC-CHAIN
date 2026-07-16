import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  useReadContract,
  useWatchContractEvent,
} from 'wagmi';
import { useContracts, DEGREE_ABI } from '../hooks/useContract';
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

  useWatchContractEvent({
    address: degreeAddress,
    abi: DEGREE_ABI,
    eventName: 'DegreeMinted',
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
    query: { enabled: !!address },
  });

  return (
    <div className="space-y-4">
      {address && userDegrees && userDegrees.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-dnc-blue-900 mb-3">
            My Degrees ({userDegrees.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {userDegrees.map((tokenId) => (
              <span
                key={tokenId.toString()}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                Degree #{tokenId.toString()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-dnc-blue-900 mb-3">
          Recent Minted Degrees
        </h3>
        {degrees.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">
            Waiting for new degrees...
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {degrees.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-dnc-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-dnc-blue-600 font-bold text-xs">
                      #{d.tokenId.toString()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      To: {shortenAddress(d.recipient)}
                    </p>
                    <p className="text-xs text-gray-500">
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
