'use client';
import { applications } from "./applications";
import { useCertificates } from "@/hooks/useCertificates";

export function useDashboardStats() {
  const { data, loading, error } = useCertificates();
  console.log(data);
  const safeData = Array.isArray(data) ? data : [];

  const dashboardStats = [
    {
      id: 'total-applications',
      label: 'Total Applications',
      labelKey: 'totalApplications',
      value: applications?.length || 0,
      icon: 'ClipboardList',
      color: 'green',
    },
    {
      id: 'rejected-applications',
      label: 'Rejected Applications',
      labelKey: 'rejectedApplications',
      value: applications?.filter((app) => app.status?.toLowerCase() === 'rejected').length || 0,
      icon: 'XCircle',
      color: 'red',
    },
    {
      id: 'active-certificates',
      label: 'Active Certificates',
      labelKey: 'activeCertificates',
      value: safeData.filter((item) => item.status?.toLowerCase() === 'valid').length,
      icon: 'FileCheck',
      color: 'green',
    },
    {
      id: 'suspended-certificates',
      label: 'Suspended Certificates',
      labelKey: 'suspendedCertificates',
      value: safeData.filter((item) => item.status?.toLowerCase() === 'suspend').length,
      icon: 'FileWarning',
      color: 'amber',
    },
    {
      id: 'withdrawn-certificates',
      label: 'Withdrawn Certificates',
      labelKey: 'withdrawnCertificates',
      value: safeData.filter((item) => item.status?.toLowerCase() === 'withdrawn').length,
      icon: 'FileX',
      color: 'red',
    },
    {
      id: 'expired-certificates',
      label: 'Expired Certificates',
      labelKey: 'expiredCertificates',
      value: safeData.filter((item) => item.status?.toLowerCase() === 'expired').length,
      icon: 'FileClock',
      color: 'red',
    },
  ];

  return { dashboardStats, loading, error };
}