'use client';
import { useState, useMemo } from 'react';
import { FileText, Users } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import SearchInput from '@/components/ui/SearchInput';
import { useLanguage } from '@/components/layout/LanguageContext';
import { useApplications } from '@/hooks/useApplications';

export default function AdminRecentApplications() {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();
  const { applications, loading } = useApplications();

  const displayApps = useMemo(() => {
    let list = applications || [];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((app) => {
        const appNo = (app.application_no || app.applicationNo || app.ApplicationNo || '').toLowerCase();
        const comp = (app.company_name || app.companyName || app.CompanyName || '').toLowerCase();
        return appNo.includes(q) || comp.includes(q);
      });
    }
    return list.slice(0, 5);
  }, [applications, query]);

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 lg:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-[#111827]">{t('recentApplications')}</h2>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={t('searchPlaceholder')}
          className="w-full sm:w-64"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#6B7280]">
            Loading recent applications...
          </div>
        ) : displayApps.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#6B7280]">
            No applications found
          </div>
        ) : (
          displayApps.map((app) => {
            const appNo = app.application_no || app.applicationNo || app.ApplicationNo || '-';
            const compName = app.company_name || app.companyName || app.CompanyName || '-';
            const appStatus = app.status || app.Status || 'Submitted';

            return (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2D6A4F]/30 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#2D6A4F]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2D6A4F]">{appNo}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{compName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {appStatus === 'Assessment Schedule' && (
                    <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#E5E7EB] text-xs text-[#6B7280]">
                      <Users size={14} />
                    </div>
                  )}
                  <Badge status={appStatus} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
