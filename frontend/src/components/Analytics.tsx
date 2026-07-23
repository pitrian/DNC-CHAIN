import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { useAccount } from 'wagmi';

export default function Analytics() {
  const { address, isConnected } = useAccount();
  const { monthlyData, totalDegrees, totalProofs, totalVerifications } = useAnalyticsData(!!isConnected);

  if (!isConnected) return null;

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="font-semibold text-slate-100">Thống kê & Phân tích</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
          <p className="text-xs text-blue-400 font-medium uppercase tracking-wide">Tổng văn bằng</p>
          <p className="text-3xl font-bold text-blue-300 mt-1">{totalDegrees}</p>
        </div>
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <p className="text-xs text-green-400 font-medium uppercase tracking-wide">Tổng hồ sơ</p>
          <p className="text-3xl font-bold text-green-300 mt-1">{totalProofs}</p>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
          <p className="text-xs text-amber-400 font-medium uppercase tracking-wide">Tổng xác thực</p>
          <p className="text-3xl font-bold text-amber-300 mt-1">{totalVerifications}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">Văn bằng & Hồ sơ theo tháng</h4>
        {monthlyData.length > 0 ? (
          <div className="bg-slate-800/60 rounded-lg p-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="degrees" fill="#2563eb" name="Văn bằng" radius={[4, 4, 0, 0]} />
                <Bar dataKey="proofs" fill="#16a34a" name="Hồ sơ" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-8">Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
