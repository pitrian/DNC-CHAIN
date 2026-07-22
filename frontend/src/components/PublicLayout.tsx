import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WalletConnect from './WalletConnect';

interface LayoutProps {
  children: React.ReactNode;
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'text-blue-400 bg-slate-800/80'
          : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/50'
      }`}
    >
      {children}
    </Link>
  );
}

export default function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 shrink-0">
              <img src="/assets/logo.svg" alt="DNC Logo" className="h-10 brightness-0 invert" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white leading-tight">DNC-CertiTrust</h1>
                <p className="text-xs text-slate-400 leading-tight">Da Nang City CertiTrust</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <NavLink href="/">Trang chủ</NavLink>
              <NavLink href="/de-an">Đề án 2728</NavLink>
              <NavLink href="/verifier">Verify Hub</NavLink>
              <NavLink href="/huong-dan">Hướng dẫn</NavLink>
            </nav>

            <div className="shrink-0">
              <WalletConnect />
            </div>
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
