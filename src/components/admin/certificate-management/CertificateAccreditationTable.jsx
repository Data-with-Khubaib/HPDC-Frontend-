'use client';
import { Pencil, Trash2, ChevronDown } from 'lucide-react';

export default function CertificateAccreditationTable({
  certificates,
  onStatusChange,
  onDeleteCertificate,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Certificate Name</th>
            <th className="py-3.5 px-4">Certificate Duration</th>
            <th className="py-3.5 px-4">Application Fee</th>
            <th className="py-3.5 px-4">Certificate Fee</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/80 text-sm">
          {certificates.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                No certificate accreditations found.
              </td>
            </tr>
          ) : (
            certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-gray-50/60 transition-colors">
                {/* Certificate Name */}
                <td className="py-4 px-4 font-semibold text-gray-900 whitespace-nowrap">
                  {cert.name}
                </td>

                {/* Certificate Duration */}
                <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                  {cert.validity_months ? `${cert.validity_months} months` : cert.duration || '-'}
                </td>

                {/* Application Fee */}
                <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                  {cert.application_fee ? `${cert.application_fee} SAR` : cert.applicationFee || '-'}
                </td>

                {/* Certificate Fee */}
                <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                  {cert.certificate_fee ? `${cert.certificate_fee} SAR` : cert.certificateFee || '-'}
                </td>

                {/* Status Dropdown Pill */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="relative inline-block">
                    <select
                      value={cert.is_active ? 'Active' : 'Inactive'}
                      onChange={(e) => onStatusChange && onStatusChange(cert.id, e.target.value)}
                      className={`appearance-none pl-3 pr-7 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-colors ${
                        cert.is_active
                          ? 'border-emerald-200 text-emerald-800 bg-emerald-50/50'
                          : 'border-gray-200 text-gray-600 bg-gray-50/70'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </td>

                {/* Actions (Edit and Solid Red Delete) */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    {/* Edit button */}
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Pencil size={13} className="text-gray-500" />
                      <span>Edit</span>
                    </button>

                    {/* Delete button (Solid Red) */}
                    <button
                      type="button"
                      onClick={() => onDeleteCertificate && onDeleteCertificate(cert.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
