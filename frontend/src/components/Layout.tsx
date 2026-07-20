import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            <Link href="/" className="flex items-center space-x-3 justify-self-start">
              <img src="/assets/logo.svg" alt="DNC Logo" className="h-10 brightness-0 invert" />
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">
                  DNC-CertiTrust
                </h1>
                <p className="text-xs text-slate-400 leading-tight">
                  Da Nang City CertiTrust
                </p>
              </div>
            </Link>

            <nav className="flex items-center justify-center space-x-5">
              <Link
                href="/de-an"
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Đề án
              </Link>
              <Link
                href="/issuer"
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Issuer
              </Link>
              <Link
                href="/verifier"
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Verify
              </Link>
              <Link
                href="/wallet"
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Wallet
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/huong-dan"
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                H.dẫn
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            DNC-CertiTrust —{' '}
            <span className="font-medium text-slate-200">Da Nang City CertiTrust</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Built for Da Nang City&apos;s Digital Government Initiative
          </p>
        </div>
      </footer>
    </div>
  );
}
