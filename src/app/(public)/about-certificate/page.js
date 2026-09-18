'use client';
import Link from 'next/link';
import {
  ShieldCheck, Globe, Clock, CheckCircle, FileText, ArrowRight,
  Users, Leaf, Search, Upload, CreditCard, ClipboardCheck,
  Award, BarChart3, Building2,
} from 'lucide-react';

export default function AboutCertificatePage() {
  return (
    <div className="bg-[#F9FAFB]">

      {/* ═══════════ HERO — Dark Green ═══════════ */}
      <section className="relative bg-[#1B4332] pt-20 pb-44 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 mb-5">
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase">Overview</p>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            HPDC ESG Tayib Certificate for<br />
            Environmental, Social, and<br />
            Governance Compliance
          </h1>
          <p className="text-emerald-100/80 text-sm font-medium tracking-wide uppercase">
            A PIF Company | Halal DevCo
          </p>
        </div>
      </section>

      {/* ═══════════ FLOATING INFO CARDS ═══════════ */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 z-20">
        <div className="bg-[#1B4332] rounded-3xl p-7 md:p-8 shadow-2xl border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
            <div className="bg-[#D4AF37]/20 p-3.5 rounded-2xl shrink-0">
              <Leaf className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <p className="text-emerald-50 text-sm leading-relaxed">
              The HPDC ESG Tayib Certificate is an independent certification that recognizes organizations committed to Environmental, Social, and Governance (ESG) excellence. Aligned with global standards, it provides a comprehensive framework to assess sustainable and responsible business practices.
            </p>
          </div>
        </div>

        {/* 3 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <Leaf className="w-5 h-5 text-emerald-600" />,
              title: 'Environment',
              desc: 'Assessments designed to guide organizations toward environmentally responsible operations and promote sustainable resource usage.',
            },
            {
              icon: <Users className="w-5 h-5 text-blue-600" />,
              title: 'Social Responsibility',
              desc: "Evaluates an organization's commitment to the well-being of its workforce, supply chain ethics, and positive community engagement.",
            },
            {
              icon: <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />,
              title: 'Corporate Governance',
              desc: 'Ensures accountability, transparency, and ethical leadership practices across all levels of the business operations.',
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-5 border border-gray-100">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ THREE CORE PILLARS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1B4332]">The Three Core Pillars</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Discover the fundamental principles behind the HPDC ESG Tayib Certification
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pillar 1: Environmental */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row">
            <div className="md:w-5/12 h-64 md:h-auto relative">
              <img
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2070&auto=format&fit=crop"
                alt="Environment"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                E
              </div>
            </div>
            <div className="md:w-7/12 p-7 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <Leaf className="w-5 h-5 text-[#1B4332]" />
                <h3 className="text-lg font-bold text-gray-900">Environmental Responsibility</h3>
              </div>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                We assess how organizations manage their environmental impact, focusing on resource efficiency, carbon footprint reduction, and sustainable practices.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Climate change mitigation and adaptation',
                  'Sustainable resource management',
                  'Minimizing waste and promoting the circular economy',
                  'Preserving biodiversity and ecosystems',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pillar 2: Social */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row-reverse">
            <div className="md:w-5/12 h-64 md:h-auto relative">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
                alt="Social"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                S
              </div>
            </div>
            <div className="md:w-7/12 p-7 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-5 h-5 text-[#1B4332]" />
                <h3 className="text-lg font-bold text-gray-900">Social Responsibility</h3>
              </div>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                This pillar evaluates the organization's relationships with employees, suppliers, customers, and communities, ensuring fair labor practices, diversity, and community investment.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Promoting diversity, equity, and inclusion',
                  'Ensuring safe and healthy working conditions',
                  'Respecting labor rights and human rights',
                  'Supporting local communities',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pillar 3: Governance */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row">
            <div className="md:w-5/12 h-64 md:h-auto relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                alt="Governance"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                G
              </div>
            </div>
            <div className="md:w-7/12 p-7 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-lg font-bold text-gray-900">Corporate Governance</h3>
              </div>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                We review the systems and processes that guide organizational decision-making, focusing on transparency, ethical conduct, and strong board oversight.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Upholding ethical business practices',
                  'Maintaining robust risk management and compliance',
                  'Demonstrating transparent reporting and disclosure',
                  'Ensuring independent and effective board oversight',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ APPLICATION SUBMISSION PROCESS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 mb-16">
        <div className="flex items-center gap-3 mb-14">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1B4332]">Application Submission Process</h2>
            <p className="text-xs text-gray-500 mt-0.5">Simple 6-step journey to certification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-14 gap-x-8 text-center relative">
          {[
            { num: '01', title: 'Registration', icon: <Users size={22} />, desc: 'Register your organization and access the portal.' },
            { num: '02', title: 'Application', icon: <FileText size={22} />, desc: 'Submit application details and required documents.' },
            { num: '03', title: 'Payment', icon: <CreditCard size={22} />, desc: 'Process payment for application processing.' },
            { num: '04', title: 'Review', icon: <Search size={22} />, desc: 'Initial review of documents and information.' },
            { num: '05', title: 'Assessment', icon: <ClipboardCheck size={22} />, desc: 'Detailed assessment and scoring against criteria.' },
            { num: '06', title: 'Certification', icon: <ShieldCheck size={22} />, desc: 'Receive your official HPDC ESG Tayib Certificate.' },
          ].map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <span className="text-6xl md:text-8xl font-black text-gray-100 absolute -top-8 md:-top-14 -z-10 select-none">
                {step.num}
              </span>
              <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-[#1B4332] shadow-sm mb-4">
                {step.icon}
              </div>
              <h4 className="font-bold text-gray-900 mb-1.5">{step.title}</h4>
              <p className="text-xs text-gray-500 max-w-[150px] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ BOTTOM SECTIONS ═══════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Award size={18} className="text-[#D4AF37]" />
                <h4 className="font-bold text-gray-900 text-sm">Saudi National System</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Comprehensive certification aligned with Saudi national ESG standards and Vision 2030 objectives.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={18} className="text-[#1B4332]" />
                <h4 className="font-bold text-gray-900 text-sm">Certification & Awards Recognition</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Internationally recognized ESG certification framework validated by independent assessors.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={18} className="text-emerald-600" />
                <h4 className="font-bold text-gray-900 text-sm">Global Market aligned with ESG Sustainability Standards</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Align your business with global ESG frameworks and sustainability reporting standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
