'use client';

export default function ReviewerAvatarGroup({ reviewers = [] }) {
  if (!reviewers || reviewers.length === 0) {
    return <span className="text-gray-400 font-semibold text-sm">-</span>;
  }

  return (
    <div className="inline-flex items-center -space-x-1.5">
      {reviewers.map((rev, index) => (
        <span
          key={index}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold border-2 border-white shadow-xs ${rev.color}`}
        >
          {rev.initials}
        </span>
      ))}
    </div>
  );
}
