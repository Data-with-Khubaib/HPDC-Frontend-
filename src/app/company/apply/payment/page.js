'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useAuthStore } from '@/lib/authStore';
import { applicationApi, certManagementApi, uploadApi } from '@/lib/api';
import { Loader2, CheckCircle2, AlertCircle, ChevronLeft, ArrowRight } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const { formData, clearForm } = useWizard();
  const { user } = useAuthStore();

  const [certTypes, setCertTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(formData.selectedCertType || null);
  const [step, setStep] = useState(formData.selectedCertType ? 2 : 1); // 1: select type, 2: billing
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [appResult, setAppResult] = useState(null);

  // Fetch active certificate types
  useEffect(() => {
    async function fetchTypes() {
      try {
        const res = await certManagementApi.getActiveTypes();
        if (res.success && res.data) {
          setCertTypes(res.data);
          if (formData.selectedCertType) {
            const found = res.data.find(
              (t) => t.certificate_type === formData.selectedCertType?.certificate_type
            );
            if (found) setSelectedType(found);
          }
        }
      } catch (err) {
        console.error('Failed to fetch cert types:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTypes();
  }, []);

  const applicationFee = selectedType ? parseInt(selectedType.application_fee) : 0;
  const vatAmount = Math.round(applicationFee * 0.15);
  const totalDue = applicationFee + vatAmount;
  const certFee = selectedType ? parseInt(selectedType.certificate_fee) : 0;

  const formatCurrency = (amount) => {
    return `SAR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleProceedToBilling = () => {
    if (!selectedType) return;
    setStep(2);
  };

  // Upload a file and return its URL
  const uploadFile = async (file) => {
    if (!file || typeof file === 'string') return file;
    try {
      const res = await uploadApi.uploadFile(file);
      return res.data?.url || res.url || res.data?.secure_url || res.secure_url || null;
    } catch {
      return null;
    }
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Upload documents
      const docUploads = await Promise.allSettled([
        formData.crDocument ? uploadFile(formData.crDocument) : Promise.resolve(null),
        formData.vatDocument ? uploadFile(formData.vatDocument) : Promise.resolve(null),
        formData.nationalAddressDoc ? uploadFile(formData.nationalAddressDoc) : Promise.resolve(null),
        formData.ibanDocument ? uploadFile(formData.ibanDocument) : Promise.resolve(null),
      ]);

      const docUrls = docUploads.map((r) => (r.status === 'fulfilled' ? r.value : null));

      const documents = [];
      if (docUrls[0]) documents.push({ document_type: 'cr_document', file_name: formData.crDocument?.name || 'CR_Document.pdf', file_url: docUrls[0] });
      if (docUrls[1]) documents.push({ document_type: 'vat_document', file_name: formData.vatDocument?.name || 'VAT_Document.pdf', file_url: docUrls[1] });
      if (docUrls[2]) documents.push({ document_type: 'national_address_doc', file_name: formData.nationalAddressDoc?.name || 'National_Address.pdf', file_url: docUrls[2] });
      if (docUrls[3]) documents.push({ document_type: 'iban_document', file_name: formData.ibanDocument?.name || 'IBAN_Document.pdf', file_url: docUrls[3] });

      // Upload supporting docs
      if (formData.supportingDocs && formData.supportingDocs.length > 0) {
        for (let i = 0; i < formData.supportingDocs.length; i++) {
          const file = formData.supportingDocs[i];
          const url = await uploadFile(file);
          if (url) {
            documents.push({ document_type: 'supporting_document', file_name: file.name, file_url: url });
          }
        }
      }

      // Build survey answers from formData.survey
      const surveyAnswers = Object.entries(formData.survey || {}).map(([qId, answer]) => ({
        question_id: parseInt(qId) || 1,
        survey_answers: answer || 'Yes',
        partial_text: formData.partialExplanations?.[qId] || '',
        partial_answer: formData.partialExplanations?.[qId] || '',
      }));

      // Build the submission payload
      const payload = {
        company_name: formData.legalNameEn || user?.name || 'Company',
        certificate_type: selectedType.certificate_type,
        company_details: {
          legal_name_en: formData.legalNameEn,
          legal_name_ar: formData.legalNameAr,
          registration_no: formData.crNumber,
          tax_registration_no: formData.vatYear,
          buisness_type: formData.orgType,
          sector: formData.sector,
        },
        address: {
          headoffice_address: formData.headOfficeEn,
          headoffice_address_ar: formData.headOfficeAr,
          national_address: formData.nationalAddressKsa || '',
          detailed_address: formData.detailedAddress || formData.contactInfo || '',
        },
        brand: {
          activities: formData.coreBusinessActivities || formData.brands?.[0]?.name || '',
          products: formData.keyProductsEn || formData.brands?.[0]?.productsEn || '',
          critical_process: formData.criticalProcesses === 'Yes',
          outsourced_processes: formData.outsourcedProcesses === 'Yes',
        },
        sub_brands: (formData.brands || []).map((b) => ({
          brand_name: b.name || 'Brand',
          brand_skus: parseInt(b.skus) || 1,
        })),
        esg_details: {
          program_in_place: formData.esgProgram === 'Yes',
          has_esh_policy: formData.esgGovernance === 'Yes',
          has_sustainability_report: formData.sustainabilityStrategy === 'Yes',
          has_ghg_monitoring: formData.ghgMonitoring === 'Yes',
          has_energy_management: formData.energyManagement === 'Yes',
          has_social_responsibility: formData.socialResponsibility === 'Yes',
          has_grc_framework: formData.esgCompliance === 'Yes',
        },
        scope: formData.certAreasEn || '',
        multiple_sites: formData.multisite === 'Yes',
        site_details: formData.multisite === 'Yes' ? formData.siteDetails : [],
        employees: {
          total: parseInt(formData.totalEmployees) || 0,
          permanent: parseInt(formData.permanentEmployees) || 0,
          contract: parseInt(formData.contractEmployees) || 0,
          sites: parseInt(formData.numberOfSites) || 1,
          shifts: formData.shiftOperations === 'Yes',
          remote: formData.remoteWork === 'Yes',
        },
        certifications: {
          iso9001: formData.iso9001 === 'Yes',
          iso14001: formData.iso14001 === 'Yes',
          iso45001: formData.iso45001 === 'Yes',
          iso22000: formData.iso22000 === 'Yes',
          iso50001: formData.iso50001 === 'Yes',
          other: formData.otherCerts || '',
        },
        additional_notes: formData.additionalNotes || '',
        contact_no: formData.contactInfo || '',
        survey_answers: surveyAnswers,
        documents,
      };

      const res = await applicationApi.submit(payload);

      if (res.success) {
        setAppResult(res.data);
        setSubmitted(true);
        clearForm();
      } else {
        setError(res.error || 'Application submission failed');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.error || err.message || 'Application submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-slide-up">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#1B4332]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1B4332] mb-3">Application Submitted!</h1>
        <p className="text-sm text-gray-600 mb-2">
          Your application has been submitted successfully.
        </p>
        {appResult && (
          <p className="text-xs text-gray-500 mb-6 font-mono">
            Application No: {appResult.application_no?.slice(0, 8)}...
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/company/dashboard')}
            className="px-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/company/applications')}
            className="px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            View Applications
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#1B4332] animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Loading certification types...</span>
      </div>
    );
  }

  // Step 1: Select Certification Type
  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#111827]">Select Certification Type</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Choose the certification validity period that suits your organization.
          </p>
        </div>

        {certTypes.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No active certification types available. Please contact admin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {certTypes.map((type) => {
              const isSelected = selectedType?.id === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handleSelectType(type)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1B4332] bg-emerald-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <h3 className="font-bold text-gray-900 mb-1">{type.certificate_type}</h3>
                  <p className="text-xs text-gray-500 mb-3">{type.certificate_name || ''}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Application Fee</p>
                      <p className="text-sm font-bold text-[#1B4332]">
                        SAR {parseInt(type.application_fee).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-medium">Cert Fee (after approval)</p>
                      <p className="text-sm font-medium text-gray-600">
                        SAR {parseInt(type.certificate_fee).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[#1B4332] font-semibold">
                      <CheckCircle2 size={14} /> Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => router.push('/company/apply/section-4')}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={handleProceedToBilling}
            disabled={!selectedType}
            className="px-8 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
          >
            Proceed to Invoice <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Billing
  const companyName = formData.legalNameEn || user?.company?.company_name || user?.name || 'Company';
  const regId = `APP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Billing</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Complete the application form to begin the HPDC ESG certification process.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">{companyName.toUpperCase()}</h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Registration ID: <span className="font-medium text-[#111827]">{regId}</span>
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
            Pending Payment
          </span>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] mb-8">
          <div>
            <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">
              Certification Type
            </p>
            <p className="text-sm font-medium text-[#111827] mt-1">
              {selectedType?.certificate_type || '—'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">
              Submission Date
            </p>
            <p className="text-sm font-medium text-[#111827] mt-1">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">
              Amount Due
            </p>
            <p className="text-sm font-bold text-[#1B4332] mt-1">{formatCurrency(totalDue)}</p>
          </div>
        </div>

        {/* Billing Breakdown */}
        <h3 className="text-base font-bold text-[#111827] mb-4">Billing Breakdown</h3>
        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-[#F9FAFB] border-b border-[#E5E7EB]">
            <div className="px-5 py-3 col-span-2">
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                Description
              </span>
            </div>
            <div className="px-5 py-3 text-right">
              <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">
                Amount
              </span>
            </div>
          </div>

          {/* Application Fee */}
          <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
            <div className="px-5 py-4 col-span-2">
              <p className="text-sm font-medium text-[#111827]">Application Fee</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Standard institutional certification processing fee for fiscal year {new Date().getFullYear()}-{new Date().getFullYear() + 1}.
              </p>
            </div>
            <div className="px-5 py-4 text-right">
              <p className="text-sm font-medium text-[#111827]">{formatCurrency(applicationFee)}</p>
            </div>
          </div>

          {/* VAT */}
          <div className="grid grid-cols-3 border-b border-[#E5E7EB]">
            <div className="px-5 py-4 col-span-2">
              <p className="text-sm font-medium text-[#111827]">VAT (15%)</p>
              <p className="text-xs text-[#6B7280] mt-0.5">15% Value Added Tax.</p>
            </div>
            <div className="px-5 py-4 text-right">
              <p className="text-sm font-medium text-[#111827]">{formatCurrency(vatAmount)}</p>
            </div>
          </div>

          {/* Cert Fee (after approval note) */}
          <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-gray-50/50">
            <div className="px-5 py-3 col-span-2">
              <p className="text-xs text-gray-500 italic">
                Certification Fee (due after approval): {formatCurrency(certFee)}
              </p>
            </div>
            <div className="px-5 py-3 text-right">
              <p className="text-xs text-gray-400">After Approved</p>
            </div>
          </div>

          {/* Total */}
          <div className="grid grid-cols-3 bg-emerald-50">
            <div className="px-5 py-4 col-span-2">
              <p className="text-sm font-bold text-[#1B4332]">Total Amount Due</p>
            </div>
            <div className="px-5 py-4 text-right">
              <p className="text-lg font-bold text-[#1B4332]">{formatCurrency(totalDue)}</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E7EB]">
          <button
            onClick={() => setStep(1)}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={handleSubmitApplication}
            disabled={submitting}
            className="px-8 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-60 text-white text-sm font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Proceed to Payment <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
