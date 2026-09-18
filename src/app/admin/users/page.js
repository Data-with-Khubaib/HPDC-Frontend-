'use client';
import { useState, useMemo, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import UserRoleTabs from '@/components/admin/users/UserRoleTabs';
import UsersTable from '@/components/admin/users/UsersTable';
import AddUserModal from '@/components/admin/users/AddUserModal';
import { userApi } from '@/lib/api';

export default function AdminUsersPage() {
  const [activeRole, setActiveRole] = useState('COMPANY');
  const [query, setQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [usersState, setUsersState] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll({ role: activeRole });
      setUsersState(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeRole]);

  const filteredUsers = useMemo(() => {
    if (!query) return usersState;
    const q = query.toLowerCase();
    return usersState.filter(
      (u) =>
        (u.company?.name || '').toLowerCase().includes(q) ||
        (u.first_name || '').toLowerCase().includes(q) ||
        (u.last_name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    );
  }, [usersState, query]);

  const handleAddUser = async (newUser) => {
    await fetchUsers(); // Refresh list after adding
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userApi.delete(userId);
      await fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">User Management</h1>
          <p className="text-sm text-[#4B5563] mt-1 font-medium">HPDC ESG Certificate Platform</p>
        </div>

        {/* Add User Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 lg:p-7 shadow-xs">
        {/* Filter Bar: Search on left, Role tabs on right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] transition-all"
            />
          </div>

          <UserRoleTabs activeRole={activeRole} onSelectRole={setActiveRole} />
        </div>

        {/* Users Table */}
        <UsersTable users={filteredUsers} onDeleteUser={handleDeleteUser} />
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
}
