'use client';
import { useState, useRef, useEffect } from 'react';
import { Globe, Bell } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useLanguage } from '@/components/layout/LanguageContext';

export default function AdminNavbar({ onProfileClick }) {
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { language, setLanguage, isRtl } = useLanguage();
  const { user } = useAuthStore();
  const adminUser = user || { name: 'Admin', email: 'admin@example.com' };
  const langRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className={`fixed top-0 ${isRtl ? 'right-0 lg:right-64 left-0' : 'left-0 lg:left-64 right-0'} h-16 bg-white border-b border-[#E5E7EB] z-20 flex items-center justify-end px-6 lg:px-8`}>
      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 transition-colors text-[#6B7280] cursor-pointer"
            aria-label="Change Language"
          >
            <Globe size={19} />
          </button>
          {langOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 min-w-[120px] animate-scale-in z-30`}>
              {['English', 'Arabic'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${language === lang ? 'text-[#2D6A4F] font-semibold' : 'text-[#111827]'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications with '13' count badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-[#6B7280] cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {/* Red 13 count badge matching screenshot */}
            <span className="absolute top-1 right-1 bg-[#EF4444] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center border-2 border-white shadow-xs">
              13
            </span>
          </button>
          {notifOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg w-80 animate-scale-in z-30`}>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#111827]">Notifications</h3>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">13 New</span>
              </div>
              <div className="py-1 max-h-72 overflow-y-auto divide-y divide-gray-50">
                <div className="px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <p className="text-xs font-semibold text-gray-900">APP-2026-0167 Assessment Scheduled</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">AL submission CO. LTD</p>
                </div>
                <div className="px-4 py-2.5 hover:bg-gray-50 transition-colors">
                  <p className="text-xs font-semibold text-gray-900">New application received</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">foods&drink submitted APP-2026-0165</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <button
          onClick={onProfileClick}
          className={`flex items-center gap-3 ${isRtl ? 'pr-3 border-r' : 'pl-3 border-l'} border-[#E5E7EB] cursor-pointer hover:opacity-90 transition-opacity`}
        >
          {/* Mint Circle Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#B2EBF2]/80 flex items-center justify-center shrink-0 border border-teal-100 shadow-xs">
            <svg className="w-6 h-6 text-[#2D6A4F]" viewBox="0 0 64 64" fill="currentColor">
              <circle cx="32" cy="20" r="12" fill="#E0A96D" />
              <path d="M22 16 C22 10 42 10 42 16 C42 20 22 20 22 16 Z" fill="#4A3728" />
              <path d="M16 54 C16 40 48 40 48 54 Z" fill="#2C3E50" />
            </svg>
          </div>
          <div className={`hidden sm:block ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-[#111827] leading-tight">{adminUser.name}</p>
            <p className="text-[11px] text-[#6B7280] leading-tight">{adminUser.email}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
