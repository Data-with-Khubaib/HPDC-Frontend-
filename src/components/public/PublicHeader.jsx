'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-certificate', label: 'About the Certificate' },
  { href: '/registry', label: 'Registry' },
  { href: '/verify-certificate', label: 'Verify Certificate' },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/halal-devco-logo.jpg"
              alt="HALAL DEVCO"
              width={140}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? 'text-[#1B4332] font-semibold border-b-2 border-[#1B4332] rounded-none'
                    : 'text-gray-600 hover:text-[#1B4332] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-[#1B4332] hover:bg-gray-50 rounded-full transition-colors">
              <Globe size={18} />
            </button>
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1B4332] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 animate-slide-up">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-emerald-50 text-[#1B4332] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <Link
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-[#1B4332] rounded-lg hover:bg-[#2D6A4F]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
