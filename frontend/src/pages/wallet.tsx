import React, { useState, useEffect } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { QRCodeSVG } from 'qrcode.react';
import ProtectedRoute from '../components/ProtectedRoute';
import CitizenLayout from '../components/CitizenLayout';
import { useContracts, DEGREE_ABI } from '../hooks/useContract';
import { shortenAddress, formatTimestamp } from '../utils/hash';

interface DegreeMeta {
  tokenId: bigint;
  uri: string;
  metadata: { name?: string; description?: string; image?: string } | null;
  loading: boolean;
}

function WalletPage() {
  const { address, isConnected } = useAccount();
  const { degreeAddress } = useContracts();
  const [degrees, setDegrees] = useState<DegreeMeta[]>([]);
  const [selectedToken, setSelectedToken] = useState<bigint | null>(null);

  const { data: userDegrees } = useReadContracts({
    contracts: address
      ? [
          {
            address: degreeAddress,
            abi: DEGREE_ABI,
            functionName: 'getDegreesByOwner',
            args: [address],
          },
        ]
      : [],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  const tokenIds: bigint[] =
    (userDegrees?.[0]?.result as bigint[]) || [];

  const { data: tokenUris } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: degreeAddress,
      abi: DEGREE_ABI,
      functionName: 'tokenURI',
      args: [id],
    })),
    query: { enabled: tokenIds.length > 0 },
  });

  useEffect(() => {
    if (!tokenUris || tokenIds.length === 0) return;

    const metas: DegreeMeta[] = tokenIds.map((id, i) => {
      const uri = (tokenUris[i]?.result ?? '') as string;
      return { tokenId: id, uri, metadata: null, loading: true };
    });
    setDegrees(metas);

    metas.forEach((m, i) => {
      if (!m.uri) return;
      fetch(m.uri)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          setDegrees((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], metadata: data, loading: false };
            return next;
          });
        })
        .catch(() => {
          setDegrees((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], loading: false };
            return next;
          });
        });
    });
  }, [tokenUris, tokenIds.length]);

  const selected = degrees.find((d) => d.tokenId === selectedToken);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-2xl mb-4">
          <img src="/assets/logo.svg" alt="DNC" className="h-10" />
        </div>
        <h1 className="section-title">Citizen Digital Passport</h1>
        <p className="section-subtitle">
          Quản lý tập trung văn bằng, chứng chỉ số (Soulbound Tokens) của bạn trên DNC-Chain
        </p>
        <div className="inline-flex items-center space-x-1.5 mt-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full">
          <span>🔒</span>
          <span>Zero PII On-Chain · SHA-256 Hash Anchor Only</span>
        </div>
      </div>

      {!isConnected && (
        <div className="card text-center py-12">
          <p className="text-slate-400 mb-4">
            Kết nối ví để xem văn bằng, chứng chỉ của bạn.
          </p>
        </div>
      )}

      {isConnected && (
        <div className="grid lg:grid-cols-5 gap-6 animate-fade-in-up stagger-1">
          <div className="lg:col-span-2 space-y-3">
            <div className="card glow-blue">
              <h3 className="font-semibold text-slate-100 mb-3">
                Văn bằng của tôi
              </h3>
              {tokenIds.length === 0 ? (
                <p className="text-slate-400 text-sm py-4 text-center">
                  Chưa có văn bằng nào.
                </p>
              ) : (
                <div className="space-y-2">
                  {degrees.map((d) => (
                    <button
                      key={d.tokenId.toString()}
                      onClick={() => setSelectedToken(d.tokenId)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                        selectedToken === d.tokenId
                          ? 'bg-blue-500/10 border-2 border-blue-500/30'
                          : 'bg-slate-800/60 hover:bg-slate-700/60 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-100">
                          #{d.tokenId.toString()}
                        </span>
                        <span className="text-xs text-slate-400">
                          {d.loading
                            ? '...'
                            : d.metadata
                            ? '✅'
                            : ''}
                        </span>
                      </div>
                      {d.metadata && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {d.metadata.name || 'DNC University Diploma'}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {!selected && (
              <div className="card text-center py-16">
                <p className="text-slate-400">
                  Chọn một văn bằng bên trái để xem chi tiết.
                </p>
              </div>
            )}

            {selected && (
              <div className="card glow-blue">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-100">
                    Degree #{selected.tokenId.toString()}
                  </h3>
                  <a
                    href={selected.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Xem metadata
                  </a>
                </div>

                {selected.loading && (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    Đang tải metadata...
                  </div>
                )}

                {!selected.loading && selected.metadata?.image && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-slate-700 bg-slate-800/60 p-4 flex justify-center">
                    <img
                      src={selected.metadata.image}
                      alt={selected.metadata.name || 'Diploma'}
                      className="max-h-64 object-contain"
                    />
                  </div>
                )}

                {!selected.loading && selected.metadata && (
                  <div className="space-y-2 text-sm border-t border-slate-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tên:</span>
                      <span className="font-medium text-slate-200">
                        {selected.metadata.name || 'DNC University Diploma'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Số hiệu:</span>
                      <span className="font-mono text-slate-200">
                        #{selected.tokenId.toString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ví chủ:</span>
                      <span className="font-mono text-slate-200">
                        {shortenAddress(address!)}
                      </span>
                    </div>
                  </div>
                )}

                {!selected.loading && !selected.metadata && (
                  <p className="text-slate-400 text-sm py-4 text-center">
                    Không thể tải metadata.
                  </p>
                )}

                <div className="border-t border-slate-700 mt-4 pt-4 flex items-center justify-center">
                  <div className="text-center">
                    <QRCodeSVG
                      value={`${window.location.origin}/verifier?hash=${selected.uri.split('/').pop() || ''}`}
                      size={120}
                      level="M"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Quét để xác thực
                    </p>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/verifier?hash=${selected.uri.split('/').pop() || ''}`;
                        navigator.clipboard.writeText(link);
                        alert('Đã sao chép link kiểm chứng!');
                      }}
                      className="mt-2 text-xs text-blue-400 hover:underline"
                    >
                      📋 Sao chép link kiểm chứng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtectedWalletPage() {
  return (
    <CitizenLayout>
      <ProtectedRoute requiredRole="any">
        <WalletPage />
      </ProtectedRoute>
    </CitizenLayout>
  );
}
