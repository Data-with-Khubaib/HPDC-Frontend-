'use client';
import { useState, useEffect } from 'react';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { applicationApi } from '@/lib/api';

export default function DocumentsModal({ isOpen, onClose, application }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !application?.id) return;

    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await applicationApi.getDocuments(application.id);
        setDocuments(res.data || res || []);
      } catch (err) {
        console.error('Failed to fetch documents:', err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, [isOpen, application?.id]);

  if (!application) return null;

  const companyDocs = documents.filter(d => d.document_type === 'company_profile');
  const esgDocs = documents.filter(d => d.document_type === 'esg_questionnaire');
  const legalDocs = documents.filter(d => !['company_profile', 'esg_questionnaire'].includes(d.document_type));

  const renderDocItem = (doc, idx) => (
    <div key={doc.id || idx} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#2D6A4F]/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
          <FileText size={18} className="text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#111827]">{doc.file_name || 'Document'}</p>
          <p className="text-xs text-[#6B7280] uppercase">{(doc.document_type || '').replace(/_/g, ' ')}</p>
        </div>
      </div>
      <a
        href={doc.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-white rounded-lg transition-colors"
      >
        <ExternalLink size={16} className="text-[#6B7280]" />
      </a>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Documents"
      subtitle={`${application.applicationNo || application.application_no || ''} - ${application.companyName || application.company_name || ''}`}
    >
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="animate-spin text-[#1B4332]" />
          <span className="ml-3 text-sm text-gray-500">Loading documents...</span>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-gray-500">No documents found. PDFs may still be generating...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {companyDocs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#1B4332] uppercase tracking-wider mb-2">Company Profile</h3>
              <div className="space-y-2">{companyDocs.map(renderDocItem)}</div>
            </div>
          )}
          {esgDocs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#1B4332] uppercase tracking-wider mb-2">ESG Questionnaire</h3>
              <div className="space-y-2">{esgDocs.map(renderDocItem)}</div>
            </div>
          )}
          {legalDocs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#1B4332] uppercase tracking-wider mb-2">Legal Documents</h3>
              <div className="space-y-2">{legalDocs.map(renderDocItem)}</div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
