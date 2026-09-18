'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import DocumentsModal from './DocumentsModal';
import { useApplications } from '@/hooks/useApplications';
import { useLanguage } from '@/components/layout/LanguageContext';
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/mock-data/formatters';

export default function ApplicationTable() {
  const router = useRouter();
  const {
    applications,
    loading,
    error,
    query, setQuery,
    statusFilter, setStatusFilter,
    page, setPage,
    limit, setLimit,
    totalItems,
  } = useApplications();
  const { t } = useLanguage();
  const [docsApp, setDocsApp] = useState(null);

  const totalPages = Math.ceil((totalItems || 1) / limit);
  const start = totalItems > 0 ? (page - 1) * limit + 1 : 0;
  const end = Math.min(page * limit, totalItems);

  const statusOptions = [
    { value: 'all', label: t('allStatus') },
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Assessment Schedule', label: 'Assessment Schedule' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Conditional Approve', label: 'Conditional Approve' },
  ];

  const handleRowClick = (app, e) => {
    if (e.target.closest('button')) return;
    router.push(`/company/applications/${app.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        {/* Header with title + filters on same row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-[#111827]">{t('applicationManagement')}</h2>
          <div className="flex items-center gap-3">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={t('searchApplications')}
              className="w-full sm:w-64"
            />
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 cursor-pointer"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('applicationNo')}</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('company')}</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('status')}</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('submitted')}</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('documents')}</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#6B7280]">
                    Loading applications...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-500">
                    Error loading applications: {error}
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#6B7280]">
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const appNo = app.applicationNo || app.application_no || app.ApplicationNo || '-';
                  const compName = app.companyName || app.company_name || app.CompanyName || '-';
                  const subDate = app.submittedDate || app.submitted_at || app.SubmittedDate || app.createdAt;

                  return (
                    <tr
                      key={app.id}
                      onClick={(e) => handleRowClick(app, e)}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm font-semibold text-[#111827]">
                        {appNo}
                      </td>
                      <td className="py-4 px-4 text-sm text-[#6B7280]">
                        {compName.length > 20 ? compName.substring(0, 20) + '...' : compName}
                      </td>
                      <td className="py-4 px-4">
                        <Badge status={app.status || 'Submitted'} />
                      </td>
                      <td className="py-4 px-4 text-sm text-[#6B7280]">
                        {formatDate(subDate)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDocsApp(app);
                          }}
                          className="px-4 py-1.5 text-xs font-medium border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-[#111827]"
                        >
                          {t('viewDocuments')}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const cert = app.certificates && app.certificates.length > 0 ? app.certificates[0] : null;
                            if (cert && cert.paid) {
                              router.push(`/company/certificates/${cert.id}`);
                            } else if (app.status === 'Approved') {
                              router.push(`/company/certificates/payment?appId=${app.id}`);
                            } else {
                              router.push(`/company/applications/${app.id}`);
                            }
                          }}
                          className={`inline-flex items-center gap-2 px-4 py-2 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            app.status === 'Approved' ? 'bg-[#1B4332] hover:bg-[#2D6A4F]' : 'bg-[#1B4332] hover:bg-[#2D6A4F]'
                          }`}
                        >
                          {(() => {
                            const cert = app.certificates && app.certificates.length > 0 ? app.certificates[0] : null;
                            if (cert && cert.paid) return 'View Certificate';
                            if (app.status === 'Approved') return 'Generate Certificate';
                            if (app.status === 'Conditional Approve') return 'Take Action';
                            return t('viewDetails');
                          })()}
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
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
                  setPage(1);
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

      <DocumentsModal
        isOpen={!!docsApp}
        onClose={() => setDocsApp(null)}
        application={docsApp}
      />
    </>
  );
}
