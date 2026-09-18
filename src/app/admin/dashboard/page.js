'use client';
import { useState, useEffect } from 'react';
import AdminStatsCard from '@/components/admin/dashboard/AdminStatsCard';
import AdminRecentApplications from '@/components/admin/dashboard/AdminRecentApplications';
import { dashboardApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await dashboardApi.getAdminMetrics();
        const metrics = res.data || {};
        
        const calculatedStats = [
          {
            id: 'total-applications',
            label: 'Total Applications',
            value: metrics.total_applications || 0,
            icon: 'ClipboardList',
            color: 'green',
          },
          {
            id: 'approved-applications',
            label: 'Approved Applications',
            value: metrics.approved_count || 0,
            icon: 'CheckCircle',
            color: 'emerald',
          },
          {
            id: 'pending-applications',
            label: 'Pending Applications',
            value: metrics.pending_count || 0,
            icon: 'Clock',
            color: 'amber',
          },
          {
            id: 'rejected-applications',
            label: 'Rejected Applications',
            value: metrics.rejected_count || 0,
            icon: 'XCircle',
            color: 'red',
          },
          {
            id: 'active-certificates',
            label: 'Active Certificates',
            value: metrics.active_certificates || 0,
            icon: 'Award',
            color: 'blue',
          },
        ];
        
        setStatsData(calculatedStats);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#4B5563] mt-1 font-medium">HPDC ESG Certificate Platform</p>
      </div>

      {/* 5 Stats Cards Grid */}
      {loading ? (
         <div className="text-center text-sm text-gray-500 py-10">Loading statistics...</div>
      ) : (
      <div className="space-y-5">
        {/* Top row: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statsData.slice(0, 3).map((stat) => (
            <AdminStatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Bottom row: 2 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:w-2/3">
          {statsData.slice(3, 5).map((stat) => (
            <AdminStatsCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </div>
      )}

      {/* Recent Applications Section */}
      <AdminRecentApplications />
    </div>
  );
}
