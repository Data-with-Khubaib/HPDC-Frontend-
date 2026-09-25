'use client';
import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import { Mail, Building2, Phone, Globe, ShieldCheck, Eye, EyeOff, LogOut } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const currentUser = user || { name: 'Company User', email: 'user@example.com', company: 'Company', phone: 'N/A', country: 'N/A', sector: 'N/A', initials: 'CO' };
  const initials = currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : (currentUser.initials || 'CO');

  const [view, setView] = useState('profile'); // 'profile' | 'password'
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleClose = () => {
    setView('profile');
    onClose();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onClose();
      router.push('/signin');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const companyObj = typeof currentUser.company === 'object' && currentUser.company !== null ? currentUser.company : null;

  const infoRows = [
    { label: 'EMAIL', value: currentUser.email || 'N/A', icon: Mail },
    { label: 'COMPANY', value: companyObj ? companyObj.company_name : currentUser.company || 'N/A', icon: Building2 },
    { label: 'PHONE NUMBER', value: companyObj?.phone_number || currentUser.phone || 'N/A', icon: Phone },
    { label: 'COUNTRY', value: companyObj?.country || currentUser.country || 'N/A', icon: Globe },
    { label: 'SECTOR', value: companyObj?.sector || currentUser.sector || 'N/A', icon: ShieldCheck },
  ];

  if (view === 'password') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-2xl font-bold mx-auto">
            {currentUser.initials}
          </div>
          <h3 className="text-lg font-bold text-[#111827] mt-4">Change Password</h3>
          <p className="text-sm text-[#6B7280] mt-1">Update your account password to secure your account</p>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1.5">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1.5">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1.5">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] cursor-pointer"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" fullWidth onClick={() => setView('profile')}>
            Cancel
          </Button>
          <Button variant="solid" fullWidth>
            Change Password
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-md">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-2xl font-bold mx-auto cursor-pointer hover:opacity-90 transition-opacity">
          {currentUser.initials}
        </div>
        <p className="text-xs text-[#6B7280] mt-2">Click the photo to change it</p>
        <h3 className="text-lg font-bold text-[#111827] mt-3">Profile Information</h3>
        <p className="text-sm text-[#6B7280] mt-1">View your profile details and manage your account</p>
      </div>

      {/* Info rows */}
      <div className="bg-[#F9FAFB] rounded-xl p-4 space-y-4">
        {infoRows.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
              <Icon size={14} className="text-[#6B7280]" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">{label}</p>
              <p className="text-sm text-[#111827] font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-6">
        <Button variant="outline" fullWidth onClick={() => setView('password')}>
          Change Password
        </Button>
        <Button variant="danger-outline" fullWidth onClick={handleSignOut}>
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </Modal>
  );
}
