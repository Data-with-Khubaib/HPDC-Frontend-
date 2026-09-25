'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ProfileModal from '@/components/profile/ProfileModal';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';

function InnerLayout({ children, title }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { isRtl } = useLanguage();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <Navbar title={title} onProfileClick={() => setProfileOpen(true)} />
      
      {/* Main content */}
      <main className={`${isRtl ? 'lg:mr-64' : 'lg:ml-64'} pt-16 min-h-screen`}>
        <div className="p-6 lg:p-5">
          {children}
        </div>
      </main>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}

export default function Layout({ children, title = 'Dashboard' }) {
  return (
    <LanguageProvider>
      <InnerLayout title={title}>{children}</InnerLayout>
    </LanguageProvider>
  );
}
