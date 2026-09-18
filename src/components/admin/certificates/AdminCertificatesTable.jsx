'use client';
import { useState } from 'react';

export default function AdminCertificatesTable({ certificates, onSuspendCertificate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Certificate ID</th>
            <th className="py-3.5 px-4">Company</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4">Issued</th>
            <th className="py-3.5 px-4">Expiry</th>
            <th className="py-3.5 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/80 text-sm">
          {certificates.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                No certificates found.
              </td>
            </tr>
          ) : (
            certificates.map((cert) => (
              <tr key={cert.id} className="hover:bg-gray-50/60 transition-colors">
                {/* Certificate ID */}
                <td className="py-4 px-4 font-semibold text-gray-900 whitespace-nowrap">
                  {cert.certificate_number || cert.certificateId || '-'}
                </td>

                {/* Company & Registration Number */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900 leading-snug">{cert.application?.company?.name || cert.companyName || '-'}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{cert.application?.company?.registration_number || cert.registrationNo || '-'}</p>
                </td>

                {/* Status VALID Pill */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs ${
                    cert.status === 'VALID' ? 'bg-[#1B4332] text-white' : 
                    cert.status === 'SUSPENDED' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {cert.status}
                  </span>
                </td>

                {/* Issued Date */}
                <td className="py-4 px-4 text-gray-600 text-xs whitespace-nowrap">
                  {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : cert.issuedDate || '-'}
                </td>

                {/* Expiry Date */}
                <td className="py-4 px-4 text-gray-600 text-xs whitespace-nowrap">
                  {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : cert.expiryDate || '-'}
                </td>

                {/* Suspend Action Button */}
                <td className="py-4 px-4 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSuspendCertificate && onSuspendCertificate(cert.id)}
                    className="px-5 py-1.5 border border-[#F59E0B] text-[#B7791F] hover:bg-amber-50 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
