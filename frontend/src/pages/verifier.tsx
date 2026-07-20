import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { useProofData } from '../hooks/useContract';
import { formatTimestamp, shortenAddress } from '../utils/hash';

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
      alert('Vui lòng nhập hash hợp lệ (0x + 64 ký tự hex)');
      return;
    }
    setCurrentHash(h);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-4">
          <img src="/assets/logo.svg" alt="DNC" className="h-10" />
        </div>
        <h1 className="section-title">Tra cứu & Xác thực</h1>
        <p className="section-subtitle">
          Kiểm tra tính toàn vẹn của văn bằng, chứng chỉ và hồ sơ điện tử trên
          DNC-Chain. Không cần kết nối ví.
        </p>
      </div>

      <div className="space-y-8">
        <div className="card">
          <h3 className="font-semibold text-dnc-blue-900 mb-4">
            📄 Tải lên tài liệu để đối soát
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Kéo thả file PDF văn bằng hoặc hồ sơ điện tử. Hệ thống tự động tính
            mã băm SHA-256 và tra cứu trên blockchain.
          </p>
          <FileUploader
            onHashGenerated={handleHashGenerated}
            isUploading={isLoading}
          />
        </div>

        <div className="card">
          <h3 className="font-semibold text-dnc-blue-900 mb-4">
            🔑 Hoặc nhập mã băm thủ công
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
              {isLoading ? 'Đang tra cứu...' : 'Xác thực'}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="card text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-dnc-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Đang tra cứu mã băm trên DNC-Chain...</p>
          </div>
        )}

        {!isLoading && currentHash && (
          <div
            className={`card border-2 ${
              exists
                ? proof?.revoked
                  ? 'border-yellow-500'
                  : 'border-green-500'
                : 'border-red-500'
            }`}
          >
            <div className="flex flex-col items-center text-center mb-6">
              {exists && !proof?.revoked && (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800">
                    ✅ Tài liệu HỢP LỆ
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    Mã băm tồn tại trên DNC-Chain. Tài liệu chưa bị chỉnh sửa.
                  </p>
                </>
              )}
              {exists && proof?.revoked && (
                <>
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-800">
                    ⚠️ Văn bằng ĐÃ BỊ THU HỒI
                  </h3>
                  <p className="text-sm text-yellow-600 mt-1">
                    Văn bằng này đã bị cơ quan ban hành thu hồi và không còn giá
                    trị pháp lý.
                  </p>
                </>
              )}
              {!exists && (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-800">
                    ❌ KHÔNG TÌM THẤY
                  </h3>
                  <p className="text-sm text-red-600 mt-1">
                    Mã băm không tồn tại trên DNC-Chain. Tài liệu không có giá trị
                    pháp lý hoặc đã bị chỉnh sửa.
                  </p>
                </>
              )}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã băm (file hash):</span>
                <span className="font-mono text-xs text-gray-800 break-all max-w-[50%] text-right">
                  {currentHash}
                </span>
              </div>
              {exists && proof?.issuer && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Ký bởi:</span>
                  <span className="font-mono text-gray-800">
                    {shortenAddress(proof.issuer)}
                  </span>
                </div>
              )}
              {exists && proof?.timestamp && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Thời gian ký:</span>
                  <span className="text-gray-800">
                    {formatTimestamp(proof.timestamp)}
                  </span>
                </div>
              )}
              {exists && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái:</span>
                  <span
                    className={`font-medium ${
                      proof?.revoked
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {proof?.revoked ? '🟡 Đã thu hồi' : '🟢 Còn hiệu lực'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
