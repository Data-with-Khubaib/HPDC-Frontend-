'use client';
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import ActivityLogList from '@/components/admin/activity-log/ActivityLogList';
import { logApi } from '@/lib/api';

export default function AdminActivityLogPage() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsList, setLogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await logApi.getAll({});
      const payload = res.data || {};
      setLogsList(Array.isArray(payload) ? payload : (payload.data || []));
    } catch (err) {
      console.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    if (!query) return logsList;
    const q = query.toLowerCase();
    return logsList.filter(
      (l) => (l.action || '').toLowerCase().includes(q) || (l.details || '').toLowerCase().includes(q)
    );
  }, [logsList, query]);

  const handleExport = () => {
    alert('Activity logs exported successfully.');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">Activity Log</h1>
          <p className="text-sm text-[#4B5563] mt-1 font-medium">HPDC ESG Certificate Platform activity history</p>
        </div>

        {/* Export Logs Button */}
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <Download size={16} />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 lg:p-7 shadow-xs">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Activity Log</h2>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by user name"
                className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all"
              />
            </div>

            {/* Filter Button */}
            <button
              type="button"
              className="p-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl transition-colors cursor-pointer shadow-xs"
              title="Filter"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Activity Logs List */}
        <ActivityLogList logs={filteredLogs} />

        {/* Pagination matching Screenshot 2 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Showing 1-10 of 7271
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#1B4332] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <span className="text-gray-400 text-xs px-1">..</span>

            <button
              onClick={() => setCurrentPage(728)}
              className="w-7 h-7 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              728
            </button>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
