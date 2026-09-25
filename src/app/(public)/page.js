'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck, Globe, Clock, CheckCircle, FileText, ArrowRight,
  Users, Leaf, CreditCard, Search, ClipboardCheck, Upload,
  Building2, BarChart3, Award,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-[#F9FAFB]">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#1B4332]">
                  ESG Tayib Sustainability Certification Portal
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[#1B4332] leading-tight">
                Build Trust Through<br />
                HPDC ESG Certification
              </h1>

              <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
                Demonstrate your organization's commitment to the HPDC ESG Sustainability Certification. An independent assessment and review certificate that guarantees your alignment with global environmental, social, and governance requirements and showcases sustainable and responsible business practices to stakeholders and partners.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                  Apply Now <ArrowRight size={16} />
                </Link>
                <Link
                  href="/verify-certificate"
                  className="px-6 py-3 border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck size={16} className="text-emerald-600" /> Verify Certificate
                </Link>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {[
                  { icon: <Upload size={14} />, label: 'Submit Application' },
                  { icon: <Search size={14} />, label: 'Framework & Audit' },
                  { icon: <Award size={14} />, label: 'ESG Tayib Certificate' },
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-medium text-gray-600"
                  >
                    {tag.icon} {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Certificate Preview */}
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-4 -right-4 w-full h-full bg-[#D4AF37]/10 rounded-3xl -rotate-2 scale-105" />
              <div className="absolute -top-2 -right-2 w-full h-full bg-emerald-50 rounded-3xl rotate-2 scale-105" />
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                <div className="border-[8px] border-[#1B4332]/5 rounded-xl p-6 aspect-[3/4] flex flex-col items-center justify-between text-center">
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-[#1B4332] rounded flex items-center justify-center">
                        <Leaf size={14} className="text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-[#1B4332] tracking-wider uppercase">
                        HALAL DEVCO
                      </span>
                    </div>
                    <h4 className="text-[#1B4332] font-bold text-lg">ESG Tayib Certificate</h4>
                    <div className="h-px w-3/4 mx-auto bg-[#D4AF37]" />
                    <p className="text-[10px] text-gray-400">This is to certify that</p>
                    <h3 className="font-bold text-gray-800 text-xl">Company Name Ltd</h3>
                    <p className="text-[10px] text-gray-400">
                      has been assessed and found in accordance with the requirements of the
                    </p>
                    <p className="text-xs font-bold text-[#1B4332]">HPDC ESG Sustainability Code</p>
                  </div>
                  <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-6">
                    <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURE HIGHLIGHTS ROW ═══════════ */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck className="text-emerald-600" size={20} />, title: 'Secure', desc: 'Secure Data Process' },
              { icon: <Globe className="text-[#1B4332]" size={20} />, title: 'Online Process', desc: 'Fully Digital & Streamlined' },
              { icon: <Clock className="text-[#D4AF37]" size={20} />, title: 'Track Progress', desc: 'Real-time Updates' },
              { icon: <CheckCircle className="text-blue-600" size={20} />, title: 'Fast Verification', desc: 'Instant Certificate Validation' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{f.title}</h4>
                  <p className="text-[11px] text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COMPREHENSIVE FRAMEWORK ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <p className="text-[#1B4332] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
              About the Certificate
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-5">
              A Comprehensive Framework for Sustainable Performance
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                A Tayib Certification Framework built on the HPDC ESG Sustainability Code. The HPDC ESG Tayib Certificate recognizes organizations that demonstrate alignment with the requirements of the HPDC ESG Sustainability Code. Through a structured assessment and independent verification process, the certification evaluates and verifies an organization's responsible business practices against HPDC established ESG criteria.
              </p>
              <p>
                The certification helps organizations strengthen transparency, enhance accountability, and demonstrate their commitment to sustainable business practices. It enables organizations to benchmark their ESG ecosystem enabling accountability to stakeholders, investors, and consumers regarding their environmental, social, and governance contributions.
              </p>
            </div>
            <Link
              href="/about-certificate"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Search size={16} /> Read more about our certificate
            </Link>
          </div>
          <div className="lg:w-1/2 relative h-[380px] w-full rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1622322880064-ee0f0e84b726?q=80&w=2070&auto=format&fit=crop"
              alt="Sustainability"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══════════ THREE CORE PILLARS ═══════════ */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#1B4332] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
              ESG Framework
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Three Core Pillars of the Certificate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop',
                letter: 'E',
                title: 'Environment',
                items: ['Reducing Carbon Footprint', 'Sustainable Resource Use', 'Energy and Water Efficiency'],
              },
              {
                img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop',
                letter: 'S',
                title: 'Social Responsibility',
                items: ['Fair Labor Practices & Human Rights', 'Diversity and Inclusion', 'Community Engagement'],
              },
              {
                img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop',
                letter: 'G',
                title: 'Corporate Governance',
                items: ['Ethical Business Conduct', 'Transparency and Disclosure', 'Compliance with Regulations'],
              },
            ].map((pillar, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-40 relative">
                  <img src={pillar.img} alt={pillar.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center p-5">
                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                      <span className="w-8 h-8 bg-white/20 rounded flex items-center justify-center text-sm backdrop-blur-sm">
                        {pillar.letter}
                      </span>
                      {pillar.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Components</p>
                  <ul className="space-y-2.5">
                    {pillar.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHY + WHO SECTIONS ═══════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Why */}
            <div className="lg:w-5/12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="inline-block px-3 py-1 bg-emerald-50 rounded-full mb-4">
                <span className="text-[10px] font-bold text-[#1B4332] tracking-widest uppercase">Value Proposition</span>
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                Why Pursue HPDC ESG Tayib Certification
              </h2>
              <ul className="space-y-5">
                {[
                  'Builds trust, credibility, and brand reputation with stakeholders.',
                  'Demonstrates a proactive approach to risk management and long-term sustainability.',
                  'Supports access to green finance and socially responsible investment.',
                  'Differentiates your organization through independent validation.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#1B4332] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle size={14} />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Who */}
            <div className="lg:w-7/12">
              <p className="text-[10px] font-bold text-[#1B4332] tracking-widest uppercase mb-3">
                Target Audience
              </p>
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                Who Benefits From the Certificate?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Building2 size={18} className="text-[#1B4332]" />,
                    title: 'Corporations & Organizations',
                    desc: 'Large entities looking to validate their ESG practices and demonstrate commitment.',
                  },
                  {
                    icon: <BarChart3 size={18} className="text-[#1B4332]" />,
                    title: 'Manufacturing Facilities',
                    desc: 'Factories demonstrating dedication to sustainable production and waste reduction.',
                  },
                  {
                    icon: <Users size={18} className="text-[#1B4332]" />,
                    title: 'SMEs & Emerging Businesses',
                    desc: 'Small and medium enterprises aiming to build trust with validated ESG records.',
                  },
                  {
                    icon: <Globe size={18} className="text-[#1B4332]" />,
                    title: 'Service Providers & Institutions',
                    desc: 'Companies wanting to align with national sustainability goals.',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mb-3 border border-gray-100">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1.5">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VERIFY CTA ═══════════ */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={28} className="text-emerald-600" />
          </div>
          <p className="text-[10px] font-bold text-[#1B4332] tracking-[0.2em] uppercase mb-2">
            Instant Validation
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Verify Certificate Authenticity
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-lg mx-auto">
            Access our public registry to instantly verify the authenticity and current status of any issued HPDC ESG Tayib Certificate.
          </p>
          <div className="max-w-md mx-auto relative flex items-center">
            <input
              type="text"
              placeholder="Certificate number, Company name, Registration number"
              className="w-full pl-4 pr-24 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
            <Link
              href="/verify-certificate"
              className="absolute right-2 px-4 py-1.5 bg-[#1B4332] text-white text-xs font-bold rounded-lg hover:bg-[#2D6A4F] transition-colors"
            >
              Verify
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ GREEN CTA BAND ═══════════ */}
      <section className="bg-[#1B4332] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-5">
            Begin Your ESG Tayib Certification Journey
          </h2>
          <p className="text-emerald-100/80 text-sm mb-8 leading-relaxed">
            Ready to validate your ESG practices? Apply today to start the assessment process or explore our registry to verify existing certifications.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#B7952D] text-white text-sm font-bold rounded-xl shadow-lg transition-colors w-full sm:w-auto"
            >
              Apply Now
            </Link>
            <Link
              href="/verify-certificate"
              className="px-8 py-3.5 bg-white text-[#1B4332] hover:bg-gray-50 text-sm font-bold rounded-xl shadow-lg transition-colors w-full sm:w-auto"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
