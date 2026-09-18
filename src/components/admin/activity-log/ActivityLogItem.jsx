'use client';

export default function ActivityLogItem({ log }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#2D6A4F]/30 hover:shadow-2xs transition-all">
      {/* Left side: Timestamp in green & activity description */}
      <div className="space-y-1">
        <p className="text-sm font-bold text-[#1B4332]">
          {log.created_at ? new Date(!isNaN(Number(log.created_at)) ? Number(log.created_at) : log.created_at).toLocaleString() : log.timestamp}
        </p>
        <p className="text-xs text-gray-700">
          <span className="font-semibold">{log.action || log.user_name || 'System'}</span> - {log.details || log.description || log.action_text || 'No description'}
        </p>
      </div>

      {/* Right side: Relative time */}
      <span className="text-xs text-gray-400 whitespace-nowrap self-start sm:self-center font-medium">
        {log.created_at ? new Date(!isNaN(Number(log.created_at)) ? Number(log.created_at) : log.created_at).toLocaleDateString() : log.relativeTime}
      </span>
    </div>
  );
}
