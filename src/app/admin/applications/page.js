'use client';
import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import AdminApplicationsTable from '@/components/admin/applications/AdminApplicationsTable';
import { applicationApi } from '@/lib/api';

export default function AdminApplicationsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewerFilter, setReviewerFilter] = useState('all');
  const [appsList, setAppsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getAll({});
      const payload = res.data || {};
      const apps = Array.isArray(payload) ? payload : (payload.data || []);
      setAppsList(apps);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (appId, newStatus) => {
    setAppsList((prev) => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = useMemo(() => {
    return appsList.filter((app) => {
      // Query search
      if (query) {
        const q = query.toLowerCase();
        const matchesQuery =
          (app.application_no || app.applicationNo || '').toLowerCase().includes(q) ||
          (app.company?.name || app.companyName || '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }

      // Reviewer filter (mock logic since reviewers might not be in DB yet, but keeping structure)
      if (reviewerFilter === 'assigned' && (!app.reviewers || app.reviewers.length === 0)) {
        return false;
      }
      if (reviewerFilter === 'unassigned' && app.reviewers && app.reviewers.length > 0) {
        return false;
      }

      return true;
    });
  }, [appsList, query, statusFilter, reviewerFilter]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">Application Management</h1>
        <p className="text-sm text-[#4B5563] mt-1 font-medium">HPDC ESG Certificate Platform</p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 lg:p-7 shadow-xs">
        {/* Header bar with Title, Search, and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Application Management</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search applications..."
                className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All status</option>
                <option value="Assessment Schedule">Assessment Schedule</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Conditional Approval">Conditional Approval</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Reviewers Filter */}
            <div className="relative">
              <select
                value={reviewerFilter}
                onChange={(e) => setReviewerFilter(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All reviewers</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <AdminApplicationsTable applications={filteredApps} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
}
