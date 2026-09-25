'use client';
import Image from 'next/image';
import { Globe } from 'lucide-react';

export default function AuthLayout({ children, lang = 'en', changeLang }) {
  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Language Switcher */}
      <div className={`absolute top-6 ${isAr ? 'left-6' : 'right-6'} z-50`}>
        {changeLang && (
          <button 
            onClick={() => changeLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition text-gray-700 font-medium text-sm"
          >
            <Globe className="w-4 h-4 text-gray-500" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>
        )}
      </div>

      {/* Left Branding Panel */}
      <div className="md:w-1/2 bg-[#1B4332] text-white flex flex-col justify-center items-center p-8 md:p-16 relative overflow-hidden min-h-[320px] md:min-h-screen">
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          
          {/* Top Logos with Divider */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {/* PIF circular emblem placeholder */}
            <div className="w-20 h-20 flex items-center justify-center relative">
               <Image src={isAr ? "/assets/pif-logo-ar.png" : "/assets/pif-logo-ar.png"} alt="PIF Logo" fill className="object-contain" />
            </div>

            <div className="h-16 w-[1px] bg-white/30" />

            {/* Halal Devco typography logo */}
            <div className="w-48 h-16 flex items-center justify-center relative">
               <Image src={isAr ? "/assets/halal-devco-ar.png" : "/assets/halal-devco-ar.png"} alt="Halal Devco" fill className="object-contain" />
            </div>
          </div>

          <div className={`text-xs font-bold ${isAr ? 'tracking-widest' : 'tracking-[0.2em] uppercase'} text-white mb-8 mt-4`}>
            {isAr ? 'إحدى شركات صندوق الاستثمارات العامة' : 'A PIF COMPANY'}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 leading-snug">
            {isAr ? 'المنصة الرسمية لشهادة تقييم الاستدامة (طَيِّب)' : 'Official ESG Tayib Certification Platform'}
          </h1>
          <p className="text-emerald-100/80 text-sm font-medium">
            {isAr ? 'المنصة الرسمية لشهادات الاستدامة' : 'Official ESG Certification Platform'}
          </p>
        </div>
      </div>

      {/* Right Content / Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
