import React from 'react';
import WalletConnect from '../components/WalletConnect';
import EventStream from '../components/EventStream';
import DegreeCard from '../components/DegreeCard';
import { useAccount } from 'wagmi';
import { useIsAuthority } from '../hooks/useContract';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { isAuthority } = useIsAuthority(address);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <h1 className="section-title">Live Dashboard</h1>
        <p className="section-subtitle">
          Real-time blockchain event monitoring for DNC-CertiTrust
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <WalletConnect />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <EventStream />

        <div className="space-y-6">
          {isConnected && (
            <div className="card">
              <h3 className="font-semibold text-dnc-blue-900 mb-3">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-mono text-gray-800">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Authority:</span>
                  <span
                    className={`font-medium ${
                      isAuthority ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {isAuthority ? 'Yes ✓' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DegreeCard />

          <div className="card">
            <h3 className="font-semibold text-dnc-blue-900 mb-3">
              Network Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Network:</span>
                <span className="text-gray-800 font-medium">Arbitrum Sepolia</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Standard:</span>
                <span className="text-gray-800 font-medium">
                  ERC-5192 (Soulbound)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Consensus:</span>
                <span className="text-gray-800 font-medium">
                  PoA (QBFT) — Phase 2
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
