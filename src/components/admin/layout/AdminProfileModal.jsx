'use client';
import { X, Mail, KeyRound, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

export default function AdminProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const adminUser = user || { email: 'admin@example.com' };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 z-10 animate-scale-in border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1B4332]">Profile Information</h2>
          <p className="text-xs text-gray-500 mt-1">View your profile details and manage your account</p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative cursor-pointer group">
            {/* Mint Circle Background with Character Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#B2EBF2]/60 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
              <svg className="w-16 h-16 text-[#2D6A4F]" viewBox="0 0 64 64" fill="currentColor">
                <circle cx="32" cy="20" r="12" fill="#E0A96D" />
                <path d="M22 16 C22 10 42 10 42 16 C42 20 22 20 22 16 Z" fill="#4A3728" />
                <path d="M16 54 C16 40 48 40 48 54 Z" fill="#2C3E50" />
              </svg>
            </div>
            {/* Gear Cog Badge at Bottom Right */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0284C7] rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Click the photo to change it</p>
        </div>

        {/* Email Box */}
        <div className="mb-5">
          <div className="border border-gray-200 rounded-2xl px-4 py-3 bg-white flex items-center gap-3">
            <Mail size={18} className="text-[#2D6A4F] shrink-0" />
            <div className="flex-1">
              <span className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">EMAIL</span>
              <span className="text-sm font-semibold text-gray-800">{adminUser.email}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F]/5 text-sm font-semibold transition-colors cursor-pointer"
          >
            <KeyRound size={16} />
            Change Password
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
