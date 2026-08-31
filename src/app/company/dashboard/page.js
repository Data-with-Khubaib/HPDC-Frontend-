'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentApplicationsTable from '@/components/dashboard/RecentApplicationsTable';
import { applications } from '@/lib/mock-data/applications';
import { useLanguage } from '@/components/layout/LanguageContext';
export default function DashboardPage() {
  const { t } = useLanguage();
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        const res = await fetch('https://6a9523f70e895b145e5fb03b.mockapi.io/Certificates');
        const certificates = await res.json();
        const safeCertificates = Array.isArray(certificates) ? certificates : [];
        // 2. Helper function to count statuses safely (handles both 'Status' & 'status')
        const countStatus = (target) =>
          safeCertificates.filter((item) => {
            const s = (item.Status || item.status || '').toString().toLowerCase();
            return s === target.toLowerCase();
          }).length;
        // 3. Stats Cards Structure calculate karein
        const calculatedStats = [
          {
            id: 'total-applications',
            label: 'Total Applications',
            labelKey: 'totalApplications',
            value: applications.length,
            icon: 'ClipboardList',
            color: 'green',
          },
          {
            id: 'rejected-applications',
            label: 'Rejected Applications',
            labelKey: 'rejectedApplications',
            value: applications.filter((app) => app.status === 'Rejected').length,
            icon: 'XCircle',
            color: 'red',
          },
          {
            id: 'active-certificates',
            label: 'Active Certificates',
            labelKey: 'activeCertificates',
            value: countStatus('valid'),
            icon: 'FileCheck',
            color: 'green',
          },
          {
            id: 'suspended-certificates',
            label: 'Suspended Certificates',
            labelKey: 'suspendedCertificates',
            value: countStatus('suspend') + countStatus('suspended'),
            icon: 'FileWarning',
            color: 'amber',
          },
          {
            id: 'withdrawn-certificates',
            label: 'Withdrawn Certificates',
            labelKey: 'withdrawnCertificates',
            value: countStatus('withdrawn'),
            icon: 'FileX',
            color: 'red',
          },
          {
            id: 'expired-certificates',
            label: 'Expired Certificates',
            labelKey: 'expiredCertificates',
            value: countStatus('expired'),
            icon: 'FileClock',
            color: 'red',
          },
        ];
        setStatsData(calculatedStats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  return (
    <div className="animate-slide-up">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B4332]">{t('dashboard')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t('hpdcPlatform')}</p>
        </div>
        <Link href="/company/apply/company-details">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer">
            <Image src="/assets/userplus.svg" alt="user plus" width={16} height={16} priority />
            {t('applyForCertifications')}
          </button>
        </Link>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {loading ? (
          <div className="col-span-full py-8 text-center text-gray-500 font-medium">
            Loading statistics...
          </div>
        ) : (
          statsData.map((stat) => (
            <StatsCard
              key={stat.id}
              labelKey={stat.labelKey}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))
        )}
      </div>
      {/* Recent Applications */}
      <RecentApplicationsTable />
    </div>
  );
}