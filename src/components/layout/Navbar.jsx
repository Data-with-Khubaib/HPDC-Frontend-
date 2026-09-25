'use client';
import { useState, useRef, useEffect } from 'react';
import { Globe, Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useLanguage } from './LanguageContext';

export default function Navbar({ title = 'Dashboard', onProfileClick }) {
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { user } = useAuthStore();
  const langRef = useRef(null);
  const notifRef = useRef(null);
  
  const currentUser = user || { name: 'Company User', email: 'user@example.com', company: 'Company', initials: 'CO' };
  const initials = currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : (currentUser.initials || 'CO');

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const notifications = [
    { id: 1, text: 'Application APP-2026-0138 submitted successfully', time: '2 hours ago' },
    { id: 2, text: 'Certificate HPDC-ESG-2026-001 has been issued', time: '1 day ago' },
    { id: 3, text: 'Assessment scheduled for APP-2026-0135', time: '3 days ago' },
  ];

  return (
    <header className={`fixed top-0 ${isRtl ? 'right-0 lg:right-64 left-0' : 'left-0 lg:left-64 right-0'} h-16 bg-white border-b border-[#E5E7EB] z-20 flex items-center justify-end px-6 lg:px-8`}>
      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 transition-colors text-[#6B7280] cursor-pointer"
          >
            <Globe size={20} />
          </button>
          {langOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 min-w-[120px] animate-scale-in z-30`}>
              {['English', 'Arabic'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setLangOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${language === lang ? 'text-[#2D6A4F] font-medium' : 'text-[#111827]'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-[#6B7280] cursor-pointer"
          >
            <Bell size={20} />
          </button>
          {notifOpen && (
            <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} top-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg w-80 animate-scale-in z-30`}>
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-[#111827]">{t('notifications')}</h3>
              </div>
              <div className="py-1">
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <p className="text-sm text-[#111827]">{n.text}</p>
                    <p className="text-xs text-[#6B7280] mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={onProfileClick}
          className={`flex items-center gap-3 ${isRtl ? 'pr-3 border-r' : 'pl-3 border-l'} border-[#E5E7EB] cursor-pointer`}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#1B4332]">{initials}</span>
          </div>
          <div className={`hidden sm:block ${isRtl ? 'text-right' : 'text-left'}`}>
            <p className="text-sm font-semibold text-[#111827]">{currentUser.name}</p>
            <p className="text-xs text-[#6B7280]">{currentUser.email}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
