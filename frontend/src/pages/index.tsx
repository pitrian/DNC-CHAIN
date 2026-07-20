import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-dnc-blue-600 rounded-2xl mb-6">
          <span className="text-white font-bold text-3xl">D</span>
        </div>
        <h1 className="text-4xl font-bold text-dnc-blue-900 mb-4">
          DNC-CertiTrust
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Da Nang City&apos;s blockchain-based diploma verification system.
          Eliminate degree fraud with tamper-proof Soulbound Tokens.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="card text-center">
          <div className="w-12 h-12 bg-dnc-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-dnc-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="font-semibold text-dnc-blue-900 mb-2">
            Tamper-Proof
          </h3>
          <p className="text-sm text-gray-600">
            Document hashes stored on blockchain cannot be altered or forged.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-dnc-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-dnc-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-dnc-blue-900 mb-2">
            Soulbound
          </h3>
          <p className="text-sm text-gray-600">
            Diplomas are non-transferable by design, permanently linked to the recipient.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-dnc-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-dnc-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-dnc-blue-900 mb-2">
            Instant Verification
          </h3>
          <p className="text-sm text-gray-600">
            Anyone can verify a document in seconds by checking its hash on-chain.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          href="/issuer"
          className="card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-dnc-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dnc-blue-900">
                Issuer Portal
              </h3>
              <p className="text-sm text-gray-600">
                For government authorities to mint and register diplomas
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/verifier"
          className="card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dnc-blue-900">
                Verify
              </h3>
              <p className="text-sm text-gray-600">
                Tra cứu & xác thực văn bằng, chứng chỉ — không cần kết nối ví
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/de-an"
          className="card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dnc-blue-900">
                Đề án Blockchain
              </h3>
              <p className="text-sm text-gray-600">
                Toàn cảnh Đề án 2728/QĐ-UBND về blockchain tại TP Đà Nẵng
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/huong-dan"
          className="card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dnc-blue-900">
                Hướng dẫn
              </h3>
              <p className="text-sm text-gray-600">
                Cách sử dụng DNC-CertiTrust — cho công dân, cơ quan & quản trị viên
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/wallet"
          className="card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dnc-blue-900">
                My Wallet
              </h3>
              <p className="text-sm text-gray-600">
                Ví Công dân — quản lý văn bằng, chứng chỉ số trên DNC-Chain
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="card hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-dnc-blue-900">
                Live Dashboard
              </h3>
              <p className="text-sm text-gray-600">
                Giám sát hoạt động blockchain, thống kê & quản lý phân quyền
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
