import { useState, useMemo, useRef } from 'react';
import { useContracts, DEGREE_ABI, PROOF_REGISTRY_ABI } from './useContract';
import { useEventPoller } from './useEventPoller';
import { type Log } from 'viem';

type LogWithArgs = Log & { args: Record<string, unknown> };

export interface MonthlyDataPoint {
  month: string;
  degrees: number;
  proofs: number;
}

export function useAnalyticsData(enabled: boolean) {
  const { degreeAddress, proofRegistryAddress } = useContracts();
  const [degreeEvents, setDegreeEvents] = useState<LogWithArgs[]>([]);
  const [proofEvents, setProofEvents] = useState<LogWithArgs[]>([]);
  const [verifyEvents, setVerifyEvents] = useState<LogWithArgs[]>([]);

  const degreeProcessed = useRef(new Set<string>());
  const proofProcessed = useRef(new Set<string>());
  const verifyProcessed = useRef(new Set<string>());

  useEventPoller({
    address: degreeAddress,
    abi: DEGREE_ABI,
    eventName: 'DegreeMinted',
    enabled,
    onLogs: (logs) => {
      const newLogs = logs.filter(log => {
        const key = `${log.blockNumber}-${log.logIndex}`;
        if (degreeProcessed.current.has(key)) return false;
        degreeProcessed.current.add(key);
        return true;
      });
      if (newLogs.length > 0) setDegreeEvents(prev => [...prev, ...newLogs]);
    },
  });

  useEventPoller({
    address: proofRegistryAddress,
    abi: PROOF_REGISTRY_ABI,
    eventName: 'DocumentRegistered',
    enabled,
    onLogs: (logs) => {
      const newLogs = logs.filter(log => {
        const key = `${log.blockNumber}-${log.logIndex}`;
        if (proofProcessed.current.has(key)) return false;
        proofProcessed.current.add(key);
        return true;
      });
      if (newLogs.length > 0) setProofEvents(prev => [...prev, ...newLogs]);
    },
  });

  useEventPoller({
    address: proofRegistryAddress,
    abi: PROOF_REGISTRY_ABI,
    eventName: 'DocumentVerified',
    enabled,
    onLogs: (logs) => {
      const newLogs = logs.filter(log => {
        const key = `${log.blockNumber}-${log.logIndex}`;
        if (verifyProcessed.current.has(key)) return false;
        verifyProcessed.current.add(key);
        return true;
      });
      if (newLogs.length > 0) setVerifyEvents(prev => [...prev, ...newLogs]);
    },
  });

  const monthlyData = useMemo<MonthlyDataPoint[]>(() => {
    const map = new Map<string, MonthlyDataPoint>();

    const addToMap = (arr: LogWithArgs[], dataKey: 'degrees' | 'proofs') => {
      arr.forEach(e => {
        const ts = Number((e.args as Record<string, unknown>).timestamp as bigint) * 1000;
        const d = new Date(ts);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!map.has(key)) map.set(key, { month: key, degrees: 0, proofs: 0 });
        map.get(key)![dataKey]++;
      });
    };

    addToMap(degreeEvents, 'degrees');
    addToMap(proofEvents, 'proofs');

    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [degreeEvents, proofEvents]);

  return {
    monthlyData,
    totalDegrees: degreeEvents.length,
    totalProofs: proofEvents.length,
    totalVerifications: verifyEvents.length,
  };
}
