'use client';

export default function SelectInput({ value, onChange, options, placeholder, hasError }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 text-sm border rounded-2xl bg-white text-[#111827] focus:outline-none cursor-pointer appearance-none ${hasError
          ? 'border-[#E53E3E] focus:ring-2 focus:ring-red-200'
          : 'border-[#D1D5DB] focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F]'
        }`}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}