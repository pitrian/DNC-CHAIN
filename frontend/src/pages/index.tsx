import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import toast from 'react-hot-toast';
import HeroSection from '../components/HeroSection';
import PublicLayout from '../components/PublicLayout';
import {
  useIsAdmin,
  useIsEducation,
  useIsScienceTech,
  useIsAuthority,
} from '../hooks/useContract';

const portals = [
  {
    id: 'citizen',
    title: 'Cổng Công Dân',
    subtitle: 'Tra cứu & xác thực văn bằng',
    icon: '🔍',
    bg: 'from-blue-600 to-blue-800',
    badge: 'Không yêu cầu vai trò đặc biệt',
    description:
      'Tra cứu văn bằng, chứng chỉ trên DNC-Chain. Xem và quản lý bộ sưu tập SBT của bạn.',
    features: ['Xác thực văn bằng không cần kết nối ví', 'Xem ví SBT cá nhân', 'Chia sẻ mã QR kiểm chứng'],
  },
  {
    id: 'issuer',
    title: 'Cổng Cán Bộ',
    subtitle: 'Cấp phát & đăng ký hồ sơ',
    icon: '🎓',
    bg: 'from-emerald-600 to-emerald-800',
    badge: 'Yêu cầu EDUCATION_ROLE / SCIENCE_TECH_ROLE',
    description:
      'Dành cho cán bộ Sở GD&ĐT và Sở KH&CN. Cấp văn bằng số và đăng ký hồ sơ lên blockchain.',
    features: ['Cấp văn bằng SBT cho sinh viên', 'Đăng ký hồ sơ điện tử', 'Phát hành hàng loạt (batch)'],
  },
  {
    id: 'admin',
    title: 'Cổng Quản Trị',
    subtitle: 'Giám sát & điều hành hệ thống',
    icon: '⚙️',
    bg: 'from-purple-600 to-purple-800',
    badge: 'Yêu cầu DEFAULT_ADMIN_ROLE',
    description:
      'Dành cho quản trị viên hệ thống. Giám sát on-chain, phân quyền RBAC, và quản lý khẩn cấp.',
    features: ['Phân quyền RBAC', 'Emergency Stop (Circuit Breaker)', 'Dashboard phân tích & thống kê'],
  },
];

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { isAdmin } = useIsAdmin(address);
  const { isEducation } = useIsEducation(address);
  const { isScienceTech } = useIsScienceTech(address);
  const { isAuthority } = useIsAuthority(address);

  const pendingNavRef = useRef<string | null>(null);

  const canIssue = isEducation || isScienceTech || isAuthority;

  useEffect(() => {
    if (isConnected && pendingNavRef.current) {
      const nav = pendingNavRef.current;
      pendingNavRef.current = null;
      router.push(nav);
    }
  }, [isConnected, router]);

  const handlePortalClick = (portalId: string) => {
    if (portalId === 'citizen') {
      if (!isConnected) {
        pendingNavRef.current = '/wallet';
        openConnectModal?.();
        return;
      }
      router.push('/wallet');
      return;
    }

    if (portalId === 'issuer') {
      if (!isConnected) {
        pendingNavRef.current = '/issuer';
        openConnectModal?.();
        return;
      }
      if (canIssue) {
        router.push('/issuer');
      } else {
        toast.error(
          'Ví của bạn không có quyền truy cập Cổng Cán Bộ. Yêu cầu EDUCATION_ROLE hoặc SCIENCE_TECH_ROLE.'
        );
      }
      return;
    }

    if (portalId === 'admin') {
      if (!isConnected) {
        pendingNavRef.current = '/dashboard';
        openConnectModal?.();
        return;
      }
      if (isAdmin) {
        router.push('/dashboard');
      } else {
        toast.error(
          'Ví của bạn không có quyền truy cập Cổng Quản Trị. Yêu cầu DEFAULT_ADMIN_ROLE.'
        );
      }
      return;
    }
  };

  return (
    <PublicLayout>
      <HeroSection />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-slate-100 mb-3">
            Chọn Cổng thông tin
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            DNC-CertiTrust cung cấp ba cổng thông tin độc lập dành cho công dân, cán bộ và quản trị viên.
            Mỗi cổng có giao diện và quyền truy cập riêng biệt.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in-up stagger-3">
          {portals.map((portal) => (
            <button
              key={portal.id}
              onClick={() => handlePortalClick(portal.id)}
              className="group text-left"
            >
              <div className="card h-full hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${portal.bg}`} />

                <div className="pt-6 pb-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${portal.bg} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {portal.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 mb-1">
                    {portal.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 mb-3">
                    {portal.subtitle}
                  </p>

                  <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/60 text-slate-300 border border-slate-700/50 mb-4">
                    {portal.badge}
                  </span>

                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                    {portal.description}
                  </p>

                  <ul className="space-y-1.5">
                    {portal.features.map((f, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-center space-x-2">
                        <span className="text-blue-500">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-700/50 pt-4 mt-2">
                  <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                    Vào cổng →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
