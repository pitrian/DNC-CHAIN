import React, { useCallback, useRef, useState } from 'react';
import { hashFile, truncateHash } from '../utils/hash';

interface FileUploaderProps {
  onHashGenerated: (hash: `0x${string}`, file: File) => void;
  isUploading: boolean;
}

export default function FileUploader({
  onHashGenerated,
  isUploading,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file) return;

      const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, PNG, and JPEG files are allowed');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setIsHashing(true);
      try {
        const hash = await hashFile(file);
        setComputedHash(hash);
        onHashGenerated(hash as `0x${string}`, file);
      } catch (error) {
        console.error('Hashing failed:', error);
        alert('Failed to hash file. Please try again.');
      } finally {
        setIsHashing(false);
      }
    },
    [onHashGenerated]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-dnc-blue-500 bg-blue-500/10'
            : 'border-slate-700 hover:border-dnc-blue-400 hover:bg-slate-800/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            <svg
              className={`w-12 h-12 ${
                dragOver ? 'text-dnc-blue-500' : 'text-gray-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-slate-300">
            {dragOver
              ? 'Drop file here'
              : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-slate-400">
            Supports PDF, PNG, JPEG (max 10MB)
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="card space-y-3">
          <h4 className="font-medium text-slate-100">File Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-slate-400">Name:</span>
            <span className="text-slate-200 font-medium truncate">
              {selectedFile.name}
            </span>
            <span className="text-slate-400">Size:</span>
            <span className="text-slate-200 font-medium">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
            <span className="text-slate-400">Type:</span>
            <span className="text-slate-200 font-medium">
              {selectedFile.type}
            </span>
            {computedHash && (
              <>
                <span className="text-slate-400">SHA-256:</span>
                <span className="text-slate-200 font-mono text-xs break-all">
                  {truncateHash(computedHash)}
                </span>
              </>
            )}
          </div>

          {(isHashing || isUploading) && (
            <div className="flex items-center space-x-2 text-sm text-blue-400">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>
                {isHashing
                  ? 'Computing SHA-256 hash...'
                  : 'Submitting transaction...'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
