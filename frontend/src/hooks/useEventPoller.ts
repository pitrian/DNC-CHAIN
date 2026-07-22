import { useEffect, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { type Address, type Log, getAbiItem, type Abi } from 'viem';

type LogWithArgs = Log & { args: Record<string, unknown> };

export function useEventPoller({
  address,
  abi,
  eventName,
  interval = 2000,
  enabled = true,
  onLogs,
}: {
  address: Address;
  abi: Abi;
  eventName: string;
  interval?: number;
  enabled?: boolean;
  onLogs: (logs: LogWithArgs[]) => void;
}) {
  const client = usePublicClient();
  const lastBlockRef = useRef(0n);
  const isFirstRef = useRef(true);
  const onLogsRef = useRef(onLogs);
  useEffect(() => {
    onLogsRef.current = onLogs;
  }, [onLogs]);

  useEffect(() => {
    if (!enabled || !client) return;

    let active = true;
    const event = getAbiItem({ abi, name: eventName });

    const poll = async () => {
      try {
        const fromBlock = isFirstRef.current ? 0n : lastBlockRef.current + 1n;
        isFirstRef.current = false;

        const raw = await client.getLogs({
          address,
          event: event as never,
          fromBlock,
          toBlock: 'latest',
        });
        const logs = raw as unknown as LogWithArgs[];
        if (!active) return;

        if (logs.length > 0) {
          const maxBlock = logs.reduce<bigint>(
            (max, l) => (l.blockNumber && l.blockNumber > max ? l.blockNumber : max),
            0n,
          );
          if (maxBlock > lastBlockRef.current) {
            lastBlockRef.current = maxBlock;
          }
          onLogsRef.current(logs);
        }
      } catch (err) {
        if (active) console.error(`[useEventPoller:${eventName}]`, err);
      }
    };

    poll();
    const id = setInterval(poll, interval);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [client, address, abi, eventName, interval, enabled]);
}
