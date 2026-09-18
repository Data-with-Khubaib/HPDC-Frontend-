'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UsersRound,
  Award,
  Activity,
  FileCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useLanguage } from '@/components/layout/LanguageContext';
import Image from 'next/image';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Applications', href: '/admin/applications', icon: ClipboardList },
  {
    label: 'Committee Panel',
    href: '#',
    icon: UsersRound,
    disabled: true, // Non-clickable as explicitly instructed by user
  },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Activity Log', href: '/admin/activity-log', icon: Activity },
  { label: 'Certificate Management', href: '/admin/certificate-management', icon: FileCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isRtl } = useLanguage();

  const isActive = (item) => {
    if (item.disabled) return false;
    if (item.href === '/admin/dashboard') {
      return pathname === '/admin/dashboard' || pathname === '/admin';
    }
    return pathname.startsWith(item.href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2">
        <Image src="/assets/logo.svg" alt="HALAL DEVCO Logo" width={140} height={45} priority />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 mt-2 overflow-y-auto">
        <ul className="space-y-1.5">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            if (item.disabled) {
              return (
                <li key={item.label}>
                  <div
                    title="Committee Panel (Not available)"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed select-none opacity-60"
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#B7791F] text-white shadow-xs font-semibold'
                      : 'text-[#4B5563] hover:bg-gray-100/80 hover:text-[#111827]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="px-3 pb-6 pt-2 border-t border-gray-100">
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#E53E3E] border border-red-200 bg-red-50/40 hover:bg-red-50 transition-colors w-full cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className={`lg:hidden fixed top-3.5 ${isRtl ? 'right-4' : 'left-4'} z-50 p-2 bg-white rounded-lg shadow-md cursor-pointer text-[#111827]`}
        aria-label="Toggle navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className={`relative w-64 h-full bg-white shadow-2xl animate-slide-in-right ${isRtl ? 'mr-auto' : ''}`}>
            <button
              onClick={() => setMobileOpen(false)}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-500`}
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
