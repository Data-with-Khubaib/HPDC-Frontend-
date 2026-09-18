'use client';
import ActivityLogItem from './ActivityLogItem';

export default function ActivityLogList({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 text-sm">
        No activity logs found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <ActivityLogItem key={log.id} log={log} />
      ))}
    </div>
  );
}
