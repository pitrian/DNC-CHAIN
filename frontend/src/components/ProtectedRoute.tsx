import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  useIsAdmin,
  useIsEducation,
  useIsScienceTech,
  useIsAuthority,
} from '../hooks/useContract';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'issuer' | 'any';
}

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-dnc-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Đang xác thực quyền truy cập...</p>
      </div>
    </div>
  );
}

function AccessDenied({
  message,
  isDisconnected,
}: {
  message: string;
  isDisconnected: boolean;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="card text-center py-12 border-2 border-red-200 bg-red-50/50">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-800 mb-3">
          403 — Truy cập bị từ chối
        </h2>
        <p className="text-red-600 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { address, isConnected } = useAccount();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin(address);
  const { isEducation, isLoading: eduLoading } = useIsEducation(address);
  const { isScienceTech, isLoading: stLoading } = useIsScienceTech(address);
  const { isAuthority, isLoading: authLoading } = useIsAuthority(address);
  const router = useRouter();

  const isLoading = adminLoading || eduLoading || stLoading || authLoading;

  useEffect(() => {
    if (!isConnected && !isLoading) {
      toast.error('Vui lòng kết nối ví blockchain để truy cập.', {
        id: 'route-guard-connect',
      });
    }
  }, [isConnected, isLoading]);

  if (!isConnected) {
    return (
      <AccessDenied
        message="Vui lòng kết nối ví blockchain để truy cập trang này."
        isDisconnected={true}
      />
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  let authorized = false;
  if (requiredRole === 'any') {
    authorized = true;
  } else if (requiredRole === 'admin') {
    authorized = isAdmin;
  } else if (requiredRole === 'issuer') {
    authorized = isEducation || isScienceTech || isAuthority;
  }

  if (!authorized) {
    toast.error('Tài khoản của bạn không có quyền truy cập trang này.', {
      id: 'route-guard-role',
    });
    return (
      <AccessDenied
        message="Ví của bạn không có vai trò phù hợp. Vui lòng liên hệ quản trị viên (DEFAULT_ADMIN) để được cấp quyền."
        isDisconnected={false}
      />
    );
  }

  return <>{children}</>;
}
