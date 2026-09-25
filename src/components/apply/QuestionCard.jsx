'use client';

export function SectionTitle({ children, variant = 'section' }) {
  if (variant === 'company') {
    return (
      <h2 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">
        {children}
      </h2>
    );
  }
  return (
    <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-4 mt-8">
      {children}
    </h3>
  );
}

export function QuestionCard({ title, children, className = '', variant = 'section' }) {
  if (variant === 'company') {
    return (
      <div className={`bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 shadow-sm mb-6 ${className}`}>
        {title && <SectionTitle variant="company">{title}</SectionTitle>}
        {children}
      </div>
    );
  }
  // Section variant: each question sits inside a subtle bordered card
  return (
    <div className={`bg-[#fafbfc] rounded-xl border border-gray-200 p-5 md:p-6 ${className}`}>
      {title && <h4 className="text-base font-semibold text-[#1b5e20] mb-3">{title}</h4>}
      {children}
    </div>
  );
}
