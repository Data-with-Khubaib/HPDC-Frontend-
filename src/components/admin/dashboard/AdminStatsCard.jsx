'use client';
import { ClipboardList, ClipboardCheck, Award, FileX, FileWarning } from 'lucide-react';

const iconMap = {
  ClipboardList,
  ClipboardCheck,
  Award,
  FileX,
  FileWarning,
};

const colorMap = {
  green: {
    text: 'text-[#1B4332]',
    iconBg: 'bg-[#D1FAE5]/60',
    iconColor: 'text-[#10B981]',
  },
  amber: {
    text: 'text-[#B7791F]',
    iconBg: 'bg-[#FEF3C7]/80',
    iconColor: 'text-[#F59E0B]',
  },
  red: {
    text: 'text-[#DC2626]',
    iconBg: 'bg-[#FEE2E2]/70',
    iconColor: 'text-[#EF4444]',
  },
};

export default function AdminStatsCard({ label, value, icon, color = 'green' }) {
  const IconComponent = iconMap[icon] || ClipboardList;
  const colors = colorMap[color] || colorMap.green;

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-[#1F2937]">{label}</h3>
        <div className={`w-9 h-9 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconColor} shrink-0`}>
          <IconComponent size={18} />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-4xl sm:text-5xl font-extrabold ${colors.text} tracking-tight`}>
          {value}
        </span>
      </div>
    </div>
  );
}
