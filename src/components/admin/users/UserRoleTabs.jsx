'use client';

const roles = [
  { id: 'company', label: 'Company' },
  { id: 'consultant', label: 'Consultant' },
  { id: 'admin', label: 'Admin' },
];

export default function UserRoleTabs({ activeRole, onSelectRole }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl border border-gray-200/70">
      {roles.map((role) => {
        const isActive = activeRole === role.id;
        return (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isActive
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
