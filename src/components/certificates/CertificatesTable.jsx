'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronLeft, ChevronRight, Filter, ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import AdvancedSearchModal from './AdvancedSearchModal';
import { useCertificates } from '@/hooks/useCertificates';
import { useLanguage } from '@/components/layout/LanguageContext';
import { formatDate } from '@/lib/mock-data/formatters';

export default function CertificatesTable() {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    certificates,
    loading,
    error,
    query, setQuery,
    page, setPage,
    limit, setLimit,
    totalItems,
    applyAdvancedFilters,
  } = useCertificates();

  const [advancedOpen, setAdvancedOpen] = useState(false);

  const totalPages = Math.ceil((totalItems || 1) / limit);
  const start = totalItems > 0 ? (page - 1) * limit + 1 : 0;
  const end = Math.min(page * limit, totalItems);

  const handleAction = (cert) => {
    if (cert.status === 'Expired' || cert.status === 'Withdrawn') {
      router.push('/company/apply/company-details');
    } else {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 bg-[#1B4332] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium z-[100] animate-slide-up';
      toast.textContent = `Viewing certificate ${cert.certificateId}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-[#111827]">{t('allCertificates')}</h2>

          <div className="flex items-center gap-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={t('searchPlaceholder')}
              className="w-full sm:w-56"
            />
            <button
              onClick={() => setAdvancedOpen(true)}
              className="p-2.5 bg-[#1B4332] text-white rounded-lg hover:bg-[#2D6A4F] transition-colors cursor-pointer shrink-0"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('applicationNo')}</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('certificateId')}</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('certificateType')}</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('status')}</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('issued')}</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('expiry')}</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('sites')}</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#6B7280]">
                    Loading certificates from API...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-red-500">
                    Error loading certificates: {error}
                  </td>
                </tr>
              ) : certificates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#6B7280]">
                    No certificates found
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-[#111827]">{cert.ApplicationNo}</td>
                    <td className="py-4 px-4 text-sm text-[#111827]">{cert.CertificateID}</td>
                    <td className="py-4 px-4 text-sm text-[#6B7280]">{cert.CertificateType}</td>
                    <td className="py-4 px-4 text-center">
                      <Badge status={
                        cert.Status === 'suspend' ? 'Suspended' :
                          cert.Status ? cert.Status.charAt(0).toUpperCase() + cert.Status.slice(1) : 'Valid'
                      } />
                    </td>
                    <td className="py-4 px-4 text-sm text-[#6B7280]">{formatDate(cert.issuedDate)}</td>
                    <td className="py-4 px-4 text-sm text-[#6B7280]">{formatDate(cert.expiryDate)}</td>
                    <td className="py-4 px-4 text-center text-sm text-[#6B7280]">0 site(s)</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleAction(cert)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        {t('viewFullCertificate')}
                        <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between pt-6 mt-4 border-t border-[#E5E7EB]">
          <span className="text-sm text-[#2D6A4F] font-medium">
            {t('showing')} {start}-{end} {t('of')} {totalItems}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 cursor-pointer text-[#6B7280]"
            >
              <ChevronLeft size={16} />
            </button>
            {/* Page Buttons Dynamic Loop */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${page === p
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#6B7280] hover:bg-gray-100'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 cursor-pointer text-[#6B7280]"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span>{t('bookingPerPage')}</span>
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1); // Limit badalne par wapas Page 1 par redirect karein
                }}
                className="appearance-none border border-[#E5E7EB] rounded-lg px-3 py-1.5 pr-8 bg-white text-[#111827] focus:outline-none cursor-pointer text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <AdvancedSearchModal
        isOpen={advancedOpen}
        onClose={() => setAdvancedOpen(false)}
        onApply={applyAdvancedFilters}
      />
    </>
  );
}
