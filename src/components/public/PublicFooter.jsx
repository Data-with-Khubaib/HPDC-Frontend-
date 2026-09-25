'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo & Description */}
          <div>
            <Image
              src="/halal-devco-logo.jpg"
              alt="HALAL DEVCO"
              width={140}
              height={48}
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-xs">
              The leading center for assessing and certifying organizations committed to ESG practices — aligned with Saudi Vision 2030.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#1B4332]">PIF</span>
              </div>
              <span className="text-xs text-gray-500">
                Affiliated with <strong className="text-gray-700">Public Investment Fund</strong>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/about-certificate', label: 'About the ESG Tayib Program' },
                { href: '/signup', label: 'How to Apply' },
                { href: '/about-certificate', label: 'About Certification' },
                { href: '/registry', label: 'Public Registry' },
                { href: '/verify-certificate', label: 'Certificate Verification' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-[#1B4332] transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Aligned with Vision 2030 */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4">Aligned with Vision 2030</h4>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                <span className="text-xs font-bold text-[#1B4332]">PIF</span>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                <span className="text-[8px] font-bold text-gray-600">2030</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Email:{' '}
              <a
                href="mailto:ESG@hpdc.sa"
                className="text-[#1B4332] font-medium hover:underline"
              >
                ESG@hpdc.sa
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} Halal Products Development Company (HPDC). All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
              Terms & Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
