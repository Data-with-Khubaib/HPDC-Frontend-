'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ClipboardList, Award, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import Image from 'next/image';
import { useAuthStore } from '@/lib/authStore';

const navItems = [
  { labelKey: 'dashboard', href: '/company/dashboard', icon: LayoutDashboard },
  { labelKey: 'allApplications', href: '/company/applications', icon: ClipboardList },
  { labelKey: 'myCertificates', href: '/company/certificates', icon: Award },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, isRtl } = useLanguage();

  const isActive = (href) => {
    if (href === '/company/dashboard') return pathname === '/company/dashboard' || pathname === '/company';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2">
        <Image src="/assets/logo.svg" alt="HALAL DEVCO Logo" width={140} height={45} priority />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${active
                    ? 'bg-[#B7791F] text-white shadow-sm'
                    : 'text-[#6B7280] hover:bg-gray-100 hover:text-[#111827]'
                    }`}
                >
                  <Icon size={18} />
                  {t(item.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="px-3 pb-6">
        <button
          onClick={() => useAuthStore.getState().logout()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-[#E53E3E] border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors w-full cursor-pointer"
        >
          <LogOut size={18} />
          {t('signOut')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`lg:hidden fixed top-4 ${isRtl ? 'right-4' : 'left-4'} z-50 p-2 bg-white rounded-lg shadow-md cursor-pointer`}
      >
        <Menu size={20} className="text-[#111827]" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className={`relative w-64 h-full bg-white shadow-xl animate-slide-in-right ${isRtl ? 'mr-auto' : ''}`}>
            <button
              onClick={() => setMobileOpen(false)}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-1 hover:bg-gray-100 rounded cursor-pointer`}
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden lg:block fixed ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} top-0 bottom-0 w-64 bg-white border-[#E5E7EB] z-30`}>
        {sidebarContent}
      </aside>
    </>
  );
}
