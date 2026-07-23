import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import WalletConnect from './WalletConnect';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/', label: 'Trang chủ', icon: '🏠' },
  { href: '/issuer', label: 'Cấp phát văn bằng', icon: '🎓' },
  { href: '/huong-dan', label: 'Hướng dẫn', icon: '📖' },
];

const accent = 'emerald';

export default function IssuerLayout({ children }: LayoutProps) {
  const router = useRouter();

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 shrink-0 mr-6">
              <img src="/assets/logo.svg" alt="DNC" className="h-8 brightness-0 invert" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-white leading-tight">DNC-CertiTrust</h1>
                <p className="text-xs text-slate-500">Cổng Cán Bộ</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 flex-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center space-x-1.5 ${active ? 'text-emerald-400' : 'text-slate-400 hover:text-emerald-400'}`}>
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="shrink-0 ml-4">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>
      <main className="animate-fade-in">{children}</main>
    </div>
  );
}
