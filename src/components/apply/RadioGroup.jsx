'use client';

export default function RadioGroup({ value, onChange, options, variant = 'circular' }) {
  if (variant === 'button') {
    const gridCols = options.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2';
    return (
      <div className={`grid ${gridCols} gap-4 w-full`}>
        {options.map((opt) => {
          const isSelected = value === opt.val;
          return (
            <button
              key={opt.val}
              type="button"
              onClick={() => onChange(opt.val)}
              className={`w-full py-3.5 px-4 rounded-2xl border text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isSelected
                  ? 'border-[#1B4332] bg-[#F0FDF4] text-[#1B4332] font-semibold shadow-xs ring-1 ring-[#1B4332]'
                  : 'border-[#D1D5DB] bg-white text-[#4B5563] hover:border-[#2D6A4F]/60 hover:bg-emerald-50/30'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-[80%] mt-8 mb-2">
      {options.map((opt) => {
        const isSelected = value === opt.val;
        return (
          <label
            key={opt.val}
            onClick={() => onChange(opt.val)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
              isSelected ? 'border-[#1b5e20]' : 'border-[#CBD5E1] group-hover:border-[#1b5e20]'
            }`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]" />}
            </div>
            <span className={`text-[15px] ${isSelected ? 'text-[#1b5e20] font-medium' : 'text-[#64748B]'}`}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
