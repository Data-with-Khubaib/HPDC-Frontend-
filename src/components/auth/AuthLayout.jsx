'use client';
import Image from 'next/image';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Branding Panel */}
      <div className="md:w-1/2 bg-[#1B4332] text-white flex flex-col justify-center items-center p-8 md:p-16 relative overflow-hidden min-h-[320px] md:min-h-screen">
        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          
          {/* Top Logos with Divider */}
          <div className="flex items-center justify-center gap-6 mb-8">
            {/* PIF circular emblem placeholder */}
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
               <span className="text-white text-[10px] font-bold">PIF Logo</span>
            </div>

            <div className="h-12 w-[1px] bg-white/30" />

            {/* Halal Devco typography logo */}
            <div className="text-left flex flex-col">
              <span className="text-2xl font-black tracking-wider uppercase text-white font-mono leading-none block">
                HALAL
              </span>
              <span className="text-2xl font-black tracking-wider uppercase text-white font-mono leading-none block mt-1">
                DEVCO.
              </span>
            </div>
          </div>

          <div className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-8">
            A PIF COMPANY
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            Official ESG Tayib Certification Platform
          </h1>
          <p className="text-emerald-100/80 text-sm font-medium">
            Official ESG Certification Platform
          </p>
        </div>
      </div>

      {/* Right Content / Form Panel */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
