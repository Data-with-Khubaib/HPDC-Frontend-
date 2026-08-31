'use client';
import { Folder } from 'lucide-react';

export default function FileUploadBox({ onChange, fileName, hasError }) {
  return (
    <label className={`relative flex items-center justify-between border rounded-2xl bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#2D6A4F] ${hasError ? 'border-[#E53E3E]' : 'border-[#D1D5DB]'
      }`}>
      <span className="px-4 py-3.5 text-sm text-[#6B7280] truncate flex-1">
        {fileName || 'No file chosen'}
      </span>
      <div className="px-4 py-3.5 border-l border-[#D1D5DB] bg-gray-50/50 text-[#6B7280] flex items-center justify-center hover:bg-emerald-50/50 hover:text-[#2D6A4F] transition-colors shrink-0">
        <Folder size={18} />
      </div>
      <input
        type="file"
        onChange={onChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
    </label>
  );
}