'use client';
import { Pencil, Trash2 } from 'lucide-react';

export default function UsersTable({ users, onDeleteUser }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Company</th>
            <th className="py-3.5 px-4">Contact person</th>
            <th className="py-3.5 px-4">Email</th>
            <th className="py-3.5 px-4">Registration NO</th>
            <th className="py-3.5 px-4 text-center">Sector</th>
            <th className="py-3.5 px-4">Country</th>
            <th className="py-3.5 px-4">Phone</th>
            <th className="py-3.5 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/80 text-sm">
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                No users found in this role.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-4 px-4 font-semibold text-gray-900 whitespace-nowrap">
                  {u.company?.company_name || u.company_name || '-'}
                </td>
                <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                  {u.name || u.contactPerson || '-'}
                </td>
                <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                  {u.email}
                </td>
                <td className="py-4 px-4 text-gray-600 font-mono text-xs whitespace-nowrap">
                  {u.company?.registration_number || u.registrationNo || '-'}
                </td>
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <span className="inline-block px-3 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-600 bg-gray-50/50">
                    {u.company?.sector || u.sector || 'General'}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                  {u.company?.country || u.country || '-'}
                </td>
                <td className="py-4 px-4 text-gray-600 font-mono text-xs whitespace-nowrap">
                  {u.phone_number || u.phone || '-'}
                </td>
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    {/* Edit Button */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Pencil size={13} className="text-gray-500" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button (Solid Red with Trash icon) */}
                    <button
                      type="button"
                      onClick={() => onDeleteUser && onDeleteUser(u.id)}
                      className="p-1.5 rounded-lg bg-[#DC2626] hover:bg-red-700 text-white transition-colors cursor-pointer shadow-2xs"
                      title="Delete user"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
