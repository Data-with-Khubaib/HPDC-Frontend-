import { useLanguage } from '@/components/layout/LanguageContext';

const statusStyles = {
  'Approved': 'bg-[#1B4332] text-white',
  'Certificate Issued': 'bg-[#1B4332] text-white',
  'Submitted': 'bg-emerald-500 text-white',
  'Assessment Schedule': 'bg-[#B7791F] text-white',
  'Rejected': 'bg-[#DC2626] text-white',
  'Conditional Approve': 'bg-[#2563EB] text-white',
  'Conditional Approval': 'bg-[#2563EB] text-white',
  'Valid': 'bg-[#1B4332] text-white',
  'Suspended': 'bg-orange-100 text-orange-800',
  'Expired': 'bg-[#DC2626] text-white',
  'Withdrawn': 'bg-[#DC2626] text-white',
  'Pending Payment': 'bg-[#B7791F] text-white',
};

export default function Badge({ status, className = '' }) {
  const { t } = useLanguage();
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${style} ${className}`}
    >
      {t(status)}
    </span>
  );
}
