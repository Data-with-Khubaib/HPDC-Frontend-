import { useLanguage } from '@/components/layout/LanguageContext';

const statusStyles = {
  'Approved': 'bg-emerald-100 text-emerald-800',
  'Certificate Issued': 'bg-emerald-100 text-emerald-800',
  'Submitted': 'bg-teal-100 text-teal-800',
  'Assessment Schedule': 'bg-amber-100 text-amber-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Conditional Approve': 'bg-blue-100 text-blue-800',
  'Valid': 'bg-emerald-100 text-emerald-800',
  'Suspended': 'bg-amber-100 text-amber-800',
  'Expired': 'bg-red-100 text-red-800',
  'Withdrawn': 'bg-red-100 text-red-800',
  'Pending Payment': 'bg-amber-100 text-amber-800',
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
