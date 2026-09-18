'use client';
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import AdminCertificatesTable from '@/components/admin/certificates/AdminCertificatesTable';
import { certificateApi } from '@/lib/api';

export default function AdminCertificatesPage() {
  const [query, setQuery] = useState('');
  const [certificatesList, setCertificatesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await certificateApi.getAll({});
      const payload = res.data || {};
      setCertificatesList(Array.isArray(payload) ? payload : (payload.data || []));
    } catch (err) {
      console.error('Failed to fetch certificates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCerts = useMemo(() => {
    if (!query) return certificatesList;
    const q = query.toLowerCase();
    return certificatesList.filter(
      (c) =>
        (c.certificate_number || c.certificateId || '').toLowerCase().includes(q) ||
        (c.company_name || c.companyName || '').toLowerCase().includes(q) ||
        (c.registration_number || c.registrationNo || '').toLowerCase().includes(q)
    );
  }, [certificatesList, query]);

  const handleSuspend = async (id) => {
    try {
      await certificateApi.suspend(id);
      await fetchCertificates();
      alert(`Certificate ${id} suspended successfully.`);
    } catch (err) {
      alert(`Failed to suspend certificate: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">Certificates</h1>
        <p className="text-sm text-[#4B5563] mt-1 font-medium">ESG Tayib Sustainability Certification Portal</p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 lg:p-7 shadow-xs">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-[#111827]">Certificates</h2>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all"
              />
            </div>

            {/* Green Filter Icon Button */}
            <button
              type="button"
              className="p-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl transition-colors cursor-pointer shadow-xs"
              title="Filter"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Certificates Table */}
        <AdminCertificatesTable
          certificates={filteredCerts}
          onSuspendCertificate={handleSuspend}
        />
      </div>
    </div>
  );
}
