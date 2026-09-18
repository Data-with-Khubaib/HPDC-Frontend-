'use client';
import { FileText, ExternalLink } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function DocumentsModal({ isOpen, onClose, application }) {
  if (!application) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Application Documents"
      subtitle={`${application.applicationNo} - ${application.companyName}`}
    >
      <div className="space-y-3">
        {/* Mock Generated PDFs requested by user */}
        <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#2D6A4F]/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <FileText size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#111827]">Company_Profile.pdf</p>
              <p className="text-xs text-[#6B7280]">COMPANY PROFILE</p>
            </div>
          </div>
          <a
            href="/sample.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ExternalLink size={16} className="text-[#6B7280]" />
          </a>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#2D6A4F]/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <FileText size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#111827]">ESG_Questionnaire.pdf</p>
              <p className="text-xs text-[#6B7280]">ESG QUESTIONNAIRE</p>
            </div>
          </div>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white rounded-lg transition-colors"
            onClick={(e) => { e.preventDefault(); window.open('about:blank', '_blank'); }}
          >
            <ExternalLink size={16} className="text-[#6B7280]" />
          </a>
        </div>

      </div>
    </Modal>
  );
}
