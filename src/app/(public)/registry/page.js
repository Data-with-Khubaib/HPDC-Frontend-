'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Search, MapPin, Building2, ChevronLeft, ChevronRight,
  ShieldCheck, Download, Phone, Loader2, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { publicApi } from '@/lib/api';

export default function RegistryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sector, setSector] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRegistry = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sector) params.sector = sector;
      if (country) params.country = country;
      if (status) params.status = status;

      const res = await publicApi.getRegistry(params);
      if (res.success) {
        setData(res.data || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 0);
      } else {
        setError('Failed to load registry data');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, sector, country, status]);

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  const handleSearch = () => {
    setPage(1);
    fetchRegistry();
  };

  const getStatusBadge = (certStatus) => {
    const s = (certStatus || '').toLowerCase();
    if (s === 'valid' || s === 'active' || s === 'approved') {
      return { text: 'Valid', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (s === 'suspended') {
      return { text: 'Suspended', classes: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    if (s === 'expired' || s === 'revoked') {
      return { text: 'Expired', classes: 'bg-red-50 text-red-700 border-red-200' };
    }
    return { text: certStatus || 'Unknown', classes: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  const getInitialColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'valid' || s === 'active' || s === 'approved') return 'bg-emerald-600';
    if (s === 'suspended') return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <section className="bg-[#1B4332] pt-16 pb-28 text-center px-4 relative">
        <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
          <ShieldCheck size={14} /> Official ESG Tayib Certificate Registry
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          Organizations Registry
        </h1>
        <p className="text-emerald-100/70 text-sm">HPDC ESG Tayib Certificate</p>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10 pb-20">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or registration number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div className="w-full md:w-44 relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={sector}
              onChange={(e) => { setSector(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              <option value="">All Sectors</option>
              <option value="Finance">Finance</option>
              <option value="Oil & Gas">Oil & Gas</option>
              <option value="Aviation">Aviation</option>
              <option value="Technology">Technology</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          <div className="w-full md:w-44 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              <option value="">All Countries</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="UAE">UAE</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Kuwait">Kuwait</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="w-full md:w-auto px-8 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Search
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4 font-medium px-2">
          Showing {data.length} of {total} organizations
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#1B4332] animate-spin" />
            <span className="ml-3 text-sm text-gray-500">Loading registry...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchRegistry}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && data.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No organizations found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Registry List */}
        {!loading && !error && data.length > 0 && (
          <div className="space-y-3">
            {data.map((cert) => {
              const badge = getStatusBadge(cert.status);
              const companyName = cert.company?.company_name || 'Unknown Company';
              const initial = companyName.charAt(0).toUpperCase();
              const regNo = cert.company?.registration_number || '—';
              const sectorVal = cert.company?.sector || '—';
              const countryVal = cert.company?.country || '—';
              const phone = cert.company?.phone_number
                ? `+${cert.company.phone_number}`
                : '—';

              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <div
                      className={`w-12 h-12 ${getInitialColor(cert.status)} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0`}
                    >
                      {initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{companyName}</h3>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        Reg No: {regNo}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Building2 size={12} className="text-gray-400" /> {sectorVal}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MapPin size={12} className="text-gray-400" /> {countryVal}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                      <span className="flex items-center gap-1 text-xs text-gray-500 md:mr-4">
                        <Phone size={12} className="text-gray-400" /> {phone}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.classes}`}
                      >
                        {badge.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Link
                        href={`/verify-certificate?query=${encodeURIComponent(cert.id)}`}
                        className="flex-1 md:flex-none px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold text-center transition-colors"
                      >
                        Verify
                      </Link>
                      <button className="flex-1 md:flex-none px-4 py-2 bg-[#1B4332] text-white hover:bg-[#2D6A4F] rounded-lg text-xs font-semibold text-center transition-colors shadow-sm flex items-center justify-center gap-2">
                        <Download size={14} /> Certificate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-500 font-medium px-4">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
