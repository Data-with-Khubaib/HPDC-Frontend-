'use client';
import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import CertificateAccreditationTable from '@/components/admin/certificate-management/CertificateAccreditationTable';
import AddCertificateModal from '@/components/admin/certificate-management/AddCertificateModal';
import { certManagementApi } from '@/lib/api';

export default function AdminCertificateManagementPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const fetchAccreditations = async () => {
    try {
      setLoading(true);
      const res = await certManagementApi.getAll({});
      const payload = res.data || {};
      setItems(Array.isArray(payload) ? payload : (payload.data || []));
    } catch (err) {
      console.error('Failed to fetch certificate management data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccreditations();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (query && !item.name?.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all') {
        const itemStatus = item.is_active ? 'Active' : 'Inactive';
        if (itemStatus !== statusFilter) {
          return false;
        }
      }
      return true;
    });
  }, [items, query, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await certManagementApi.toggle(id);
      await fetchAccreditations();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await certManagementApi.delete(id);
      await fetchAccreditations();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleAdd = async (newCert) => {
    await fetchAccreditations();
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">Certificate Accreditation</h1>
          <p className="text-sm text-[#4B5563] mt-1 font-medium">ESG Tayib Sustainability Certification Portal</p>
        </div>

        {/* Add Certificate Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 lg:p-7 shadow-xs">
        {/* Filter Bar: All Certificates title, search, and status dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-[#111827]">All Certificates</h2>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search certificates..."
                className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Accreditations Table */}
        <CertificateAccreditationTable
          certificates={filteredItems}
          onStatusChange={handleStatusChange}
          onDeleteCertificate={handleDelete}
        />

        {/* Footer Pagination matching Screenshot 6 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium">
            Showing 1-{filteredItems.length} of {filteredItems.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            <button className="w-7 h-7 rounded-lg text-xs font-bold bg-[#1B4332] text-white">
              1
            </button>

            <button
              disabled
              className="p-1.5 rounded-lg text-gray-400 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Booking Per Page</span>
            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="appearance-none border border-gray-200 rounded-lg px-2.5 py-1 pr-6 bg-white text-gray-800 focus:outline-none cursor-pointer text-xs"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Certificate Modal */}
      <AddCertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCertificate={handleAdd}
      />
    </div>
  );
}
