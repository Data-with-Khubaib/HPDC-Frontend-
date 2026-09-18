'use client';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import AdminProfileModal from './AdminProfileModal';
import { LanguageProvider, useLanguage } from '@/components/layout/LanguageContext';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';

function InnerAdminLayout({ children }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { isRtl } = useLanguage();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <AdminSidebar />
      <AdminNavbar onProfileClick={() => setProfileOpen(true)} />

      {/* Main Content Area */}
      <main className={`${isRtl ? 'lg:mr-64' : 'lg:ml-64'} pt-16 min-h-screen`}>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Admin Profile Modal */}
      <AdminProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <LanguageProvider>
      <InnerAdminLayout>{children}</InnerAdminLayout>
    </LanguageProvider>
  );
}
