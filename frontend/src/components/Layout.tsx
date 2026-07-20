import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            <Link href="/" className="flex items-center space-x-3 justify-self-start">
              <img src="/assets/logo.svg" alt="DNC Logo" className="h-10" />
              <div>
                <h1 className="text-lg font-bold text-dnc-blue-900 leading-tight">
                  DNC-CertiTrust
                </h1>
                <p className="text-xs text-gray-500 leading-tight">
                  Da Nang City CertiTrust
                </p>
              </div>
            </Link>

            <nav className="flex items-center justify-center space-x-5">
              <Link
                href="/de-an"
                className="text-sm font-medium text-gray-600 hover:text-dnc-blue-600 transition-colors"
              >
                Đề án
              </Link>
              <Link
                href="/issuer"
                className="text-sm font-medium text-gray-600 hover:text-dnc-blue-600 transition-colors"
              >
                Issuer
              </Link>
              <Link
                href="/verifier"
                className="text-sm font-medium text-gray-600 hover:text-dnc-blue-600 transition-colors"
              >
                Verify
              </Link>
              <Link
                href="/wallet"
                className="text-sm font-medium text-gray-600 hover:text-dnc-blue-600 transition-colors"
              >
                Wallet
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-dnc-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/huong-dan"
                className="text-sm font-medium text-gray-600 hover:text-dnc-blue-600 transition-colors"
              >
                H.dẫn
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            DNC-CertiTrust —{' '}
            <span className="font-medium">Da Nang City CertiTrust</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Built for Da Nang City&apos;s Digital Government Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}
