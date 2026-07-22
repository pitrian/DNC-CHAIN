import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WalletConnect from './WalletConnect';

interface LayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { href: '/', label: 'Trang chủ', icon: '🏠' },
  { href: '/dashboard', label: 'Hệ thống quản trị', icon: '📊' },
  { href: '/huong-dan', label: 'Hướng dẫn', icon: '📖' },
];

function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 fixed left-0 top-0 h-screen overflow-y-auto z-40">
      <div className="p-4 border-b border-slate-800">
        <Link href="/" className="flex items-center space-x-3">
          <img src="/assets/logo.svg" alt="DNC" className="h-8 brightness-0 invert" />
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">DNC-CertiTrust</h1>
            <p className="text-xs text-slate-400">Cổng Quản Trị</p>
          </div>
        </Link>
      </div>
      <nav className="p-3 space-y-1">
        {sidebarItems.map((item) => {
          const isActive =
            item.href === '/'
              ? router.pathname === '/'
              : router.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-400'
                  : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/50 border-l-2 border-transparent'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">Cổng Quản Trị</p>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30">
          <div className="flex items-center justify-end h-16 px-6">
            <WalletConnect />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
