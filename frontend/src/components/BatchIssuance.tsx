import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt } from 'wagmi';
import { useDegreeContract } from '../hooks/useContract';

export default function BatchIssuance({ metadataType, accent = 'emerald' }: { metadataType: string; accent?: 'emerald' | 'amber' }) {
  const btnColors = accent === 'amber'
    ? 'bg-amber-500 text-black font-semibold hover:bg-amber-400'
    : 'bg-emerald-600 text-white hover:bg-emerald-700';
  const dotColors = accent === 'amber' ? 'bg-amber-500' : 'bg-emerald-500';
  const barColors = accent === 'amber' ? 'bg-amber-500' : 'bg-emerald-600';
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
      setStatus({ type: 'success', message: `Batch hoàn tất: ${batchStatus.completed} thành công, ${batchStatus.failed} thất bại` });
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
      setStatus({ type: 'error', message: 'Không tìm thấy địa chỉ hợp lệ' });
      return;
    }
    setBatchStatus({ total: parsed.length, completed: 0, failed: 0, running: true });
    setCurrentIndex(0);
    setStatus({ type: 'info', message: `Batch mint ${parsed.length} văn bằng...` });
  };

  const preview = getAddresses(input);

  return (
    <div className="mt-6 border-t border-slate-700/50 pt-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className={`w-3 h-3 ${dotColors} rounded-full`} />
        <h3 className="font-semibold text-slate-100">Batch Issuance · Hàng loạt</h3>
      </div>
      <p className="text-sm text-slate-400 mb-4">
        Dán danh sách địa chỉ (mỗi dòng một địa chỉ) hoặc upload file CSV.
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
        <span className="text-xs text-slate-500">CSV (cột "address") hoặc TXT</span>
      </div>

      {preview.length > 0 && (
        <div className="mb-4 p-3 bg-slate-800/60 rounded-lg">
          <p className="text-sm font-medium text-slate-300 mb-2">
            {preview.length} địa chỉ:
          </p>
          <div className="max-h-24 overflow-y-auto space-y-1">
            {preview.slice(0, 20).map((addr, i) => (
              <div key={i} className="text-xs font-mono text-slate-400">{addr}</div>
            ))}
            {preview.length > 20 && (
              <div className="text-xs text-slate-500">...và {preview.length - 20} địa chỉ khác</div>
            )}
          </div>
        </div>
      )}

      {batchStatus.running && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Tiến độ:</span>
            <span className="font-medium text-slate-100">{batchStatus.completed + batchStatus.failed} / {batchStatus.total}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`${barColors} h-2 rounded-full transition-all duration-300`}
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
        className={`w-full py-2 ${btnColors} rounded-lg text-sm font-medium disabled:opacity-50 transition-colors`}
      >
        {batchStatus.running ? `Đang mint (${batchStatus.completed + batchStatus.failed}/${batchStatus.total})...` : 'Batch Mint'}
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
