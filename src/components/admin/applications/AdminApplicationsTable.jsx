'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import DocumentsModal from '@/components/applications/DocumentsModal';
import { applicationApi } from '@/lib/api';

const statusBadgeStyles = {
  'Submitted': 'bg-emerald-500 text-white',
  'Assessment Schedule': 'bg-[#B7791F] text-white',
  'Approved': 'bg-[#1B4332] text-white',
  'Rejected': 'bg-[#DC2626] text-white',
  'Conditional Approve': 'bg-[#2563EB] text-white',
  'Conditional Approval': 'bg-[#2563EB] text-white',
};

export default function AdminApplicationsTable({ applications, onStatusUpdate }) {
  const router = useRouter();
  const [selectedDocApp, setSelectedDocApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [conditionalApproveAppId, setConditionalApproveAppId] = useState(null);
  const [conditionalReason, setConditionalReason] = useState('');

  const handleUpdateStatus = async (appId, newStatus) => {
    if (!newStatus) return;
    
    if (newStatus === 'Conditional Approve') {
      setConditionalApproveAppId(appId);
      setConditionalReason('');
      return;
    }

    try {
      setUpdatingId(appId);
      await applicationApi.updateStatus(appId, { status: newStatus, reason: '' });
      if (onStatusUpdate) {
        onStatusUpdate(appId, newStatus);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConditionalApproveSubmit = async () => {
    if (!conditionalApproveAppId) return;
    try {
      setUpdatingId(conditionalApproveAppId);
      await applicationApi.updateStatus(conditionalApproveAppId, { status: 'Conditional Approve', reason: conditionalReason.trim() });
      if (onStatusUpdate) {
        onStatusUpdate(conditionalApproveAppId, 'Conditional Approve');
      }
      setConditionalApproveAppId(null);
    } catch (err) {
      console.error('Failed to conditionally approve:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Application No.</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4 text-center">Reviewer</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Submitted</th>
              <th className="py-3.5 px-4 text-center">Documents</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80 text-sm">
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr 
                  key={app.id} 
                  className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                  onClick={(e) => {
                    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('a')) return;
                    router.push(`/admin/applications/${app.id}`);
                  }}
                >
                  {/* Application No */}
                  <td className="py-4 px-4 font-semibold text-gray-900 whitespace-nowrap">
                    <Link href={`/admin/applications/${app.id}`} className="hover:text-[#1B4332] hover:underline transition-colors">
                      {app.application_no || app.applicationNo}
                    </Link>
                  </td>

                  {/* Company */}
                  <td className="py-4 px-4 text-gray-700 whitespace-nowrap" title={app.company?.company_name || app.company_name || app.companyName}>
                    {app.company?.company_name || app.company_name || app.companyName}
                  </td>

                  {/* Reviewer Column */}
                  <td className="py-4 px-4 text-center whitespace-nowrap text-gray-400 font-semibold">
                    -
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4 text-gray-600 font-mono text-xs whitespace-nowrap">
                    {app.company?.phone_number || app.contact || '-'}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3.5 py-1 rounded-lg text-xs font-semibold shadow-2xs ${
                        statusBadgeStyles[app.status] || 'bg-gray-700 text-white'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Submitted Date */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {app.submitted_at ? new Date(!isNaN(Number(app.submitted_at)) ? Number(app.submitted_at) : app.submitted_at).toLocaleDateString() : (app.submittedDate || '-')}
                  </td>

                  {/* Documents View Button */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDocApp({
                          id: app.id,
                          applicationNo: app.applicationNo,
                          companyName: app.fullCompanyName || app.companyName,
                          documents: [
                            { name: 'Company Profile', type: 'PDF' },
                            { name: 'ESG_Questionnaire', type: 'PDF' },
                            { name: 'Audit_Report', type: 'PDF' },
                          ],
                        })
                      }
                      className="px-3.5 py-1.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      View Documents
                    </button>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {['Conditional Approve', 'Approved', 'Rejected'].includes(app.status) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/applications/${app.id}`);
                        }}
                        className="inline-flex items-center justify-center w-36 px-4 py-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    ) : (
                      <div className="relative inline-block w-36 text-left">
                        <select
                          className="w-full appearance-none px-3 py-1.5 pr-8 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer outline-none focus:border-[#1B4332] disabled:opacity-50"
                          value=""
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                        >
                          <option value="" disabled hidden>Update</option>
                          <option value="Conditional Approve">Conditional Approve</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable Documents Modal */}
      {selectedDocApp && (
        <DocumentsModal
          isOpen={!!selectedDocApp}
          onClose={() => setSelectedDocApp(null)}
          application={selectedDocApp}
        />
      )}

      {/* Conditional Approve Modal */}
      {conditionalApproveAppId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-[500px] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-[#1B4332] mb-6">Conditional Approve</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Reason <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <textarea
                  value={conditionalReason}
                  onChange={(e) => setConditionalReason(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border-2 border-[#1B4332] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#1B4332]/10 min-h-[100px] resize-none text-gray-700"
                  maxLength={500}
                />
                <div className="text-right text-[10px] text-gray-500 mt-1">{conditionalReason.length}/500</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setConditionalApproveAppId(null)}
                className="px-8 py-2.5 rounded-xl border border-[#1B4332] text-[#1B4332] font-bold text-sm hover:bg-[#1B4332]/5 transition-colors"
                disabled={updatingId === conditionalApproveAppId}
              >
                Cancel
              </button>
              <button
                onClick={handleConditionalApproveSubmit}
                disabled={updatingId === conditionalApproveAppId}
                className="px-8 py-2.5 rounded-xl bg-[#93C5FD] text-white font-bold text-sm hover:bg-[#60A5FA] transition-colors disabled:opacity-50 shadow-sm"
              >
                Conditional Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
