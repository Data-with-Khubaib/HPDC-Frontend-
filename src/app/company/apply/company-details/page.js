'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import FormField from '@/components/apply/FormField';
import TextInput from '@/components/apply/TextInput';
import SelectInput from '@/components/apply/SelectInput';
import RadioGroup from '@/components/apply/RadioGroup';
import FileUploadBox from '@/components/apply/FileUploadBox';
import { SectionTitle, QuestionCard } from '@/components/apply/QuestionCard';
import { Plus, Upload, AlertCircle } from 'lucide-react';

export default function CompanyDetailsPage() {
  const router = useRouter();
  const { formData, updateField, clearForm } = useWizard();
  const { t } = useLanguage();
  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    updateField(field, value);
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const yesNoOptions = [
    { val: 'Yes', label: t('yes') },
    { val: 'No', label: t('no') },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.legalNameEn?.trim()) newErrors.legalNameEn = 'This field is required';
    if (!formData.legalNameAr?.trim()) newErrors.legalNameAr = 'This field is required';
    if (!formData.crNumber?.trim()) newErrors.crNumber = 'This field is required';
    if (!formData.vatYear?.trim()) newErrors.vatYear = 'This field is required';
    if (!formData.orgType) newErrors.orgType = 'This field is required';
    if (!formData.sector) newErrors.sector = 'This field is required';

    if (!formData.headOfficeEn?.trim()) newErrors.headOfficeEn = 'This field is required';
    if (!formData.headOfficeAr?.trim()) newErrors.headOfficeAr = 'This field is required';
    if (!formData.contactInfo?.trim()) newErrors.contactInfo = 'This field is required';

    if (!formData.crDocument) newErrors.crDocument = 'This field is required';
    if (!formData.vatDocument) newErrors.vatDocument = 'This field is required';
    if (!formData.mroDocument) newErrors.mroDocument = 'This field is required';
    if (!formData.moaDocument) newErrors.moaDocument = 'This field is required';

    if (!formData.certAreasEn?.trim()) newErrors.certAreasEn = 'This field is required';
    if (!formData.certScopeAr?.trim()) newErrors.certScopeAr = 'This field is required';
    if (!formData.multisite) newErrors.multisite = 'This field is required';

    if (!formData.totalEmployees) newErrors.totalEmployees = 'This field is required';
    if (!formData.permanentEmployees) newErrors.permanentEmployees = 'This field is required';
    if (!formData.contractEmployees) newErrors.contractEmployees = 'This field is required';
    if (!formData.numberOfSites) newErrors.numberOfSites = 'This field is required';
    if (!formData.shiftOperations) newErrors.shiftOperations = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      router.push('/company/apply/section-1');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addBrand = () => {
    handleFieldChange('brands', [
      ...formData.brands,
      { name: '', productsEn: '', productsAr: '', criticalProcesses: '', outsourcedProcesses: '' },
    ]);
  };

  const updateBrand = (index, field, value) => {
    const updated = [...formData.brands];
    updated[index] = { ...updated[index], [field]: value };
    handleFieldChange('brands', updated);
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-12">
      {/* Page Title Header */}
      <div className="flex flex-col items-center justify-center space-y-2 text-center pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1B4332]">{t('companyDetails')}</h1>
        <p className="text-sm sm:text-base text-[#42716C]">{t('companyDetailsSubtitle')}</p>
      </div>

      {/* Global Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-[#E53E3E] flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{t('fillRequiredFieldsWarning')}</span>
        </div>
      )}

      {/* ===== CARD 1: Organization Basic Details ===== */}
      <QuestionCard title={t('orgBasicDetails')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label={t('legalNameEn')} required error={errors.legalNameEn}>
            <TextInput value={formData.legalNameEn} onChange={(v) => handleFieldChange('legalNameEn', v)} placeholder="interlink" hasError={!!errors.legalNameEn} />
          </FormField>
          <FormField label={t('legalNameAr')} required error={errors.legalNameAr}>
            <TextInput value={formData.legalNameAr} onChange={(v) => handleFieldChange('legalNameAr', v)} placeholder="أدخل اسم الشركة بالعربية" hasError={!!errors.legalNameAr} arabicOnly />
          </FormField>
          <FormField label={t('crNumber')} required error={errors.crNumber}>
            <TextInput value={formData.crNumber} onChange={(v) => handleFieldChange('crNumber', v)} placeholder="0980000000" hasError={!!errors.crNumber} />
          </FormField>
          <FormField label={t('vatYear')} required error={errors.vatYear}>
            <TextInput value={formData.vatYear} onChange={(v) => handleFieldChange('vatYear', v)} placeholder="89750000" hasError={!!errors.vatYear} />
          </FormField>
          <FormField label={t('orgType')} required error={errors.orgType}>
            <SelectInput value={formData.orgType} onChange={(v) => handleFieldChange('orgType', v)} options={['LLC', 'Private', 'JSC', 'Partnership', 'Sole Proprietorship', 'Government', 'Non-Profit']} placeholder="LLC" hasError={!!errors.orgType} />
          </FormField>
          <FormField label={t('sector')} required error={errors.sector}>
            <SelectInput value={formData.sector} onChange={(v) => handleFieldChange('sector', v)} options={['Manufacturing', 'Food Processing', 'Logistics', 'Technology', 'Energy', 'Healthcare', 'Construction', 'Agriculture', 'Mining', 'Hospitality', 'Retail', 'Other']} placeholder="Sector" hasError={!!errors.sector} />
          </FormField>
        </div>
      </QuestionCard>

      {/* ===== CARD 2: Address and Contact Details ===== */}
      <QuestionCard title={t('addressContactDetails')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label={t('headOfficeEn')} required error={errors.headOfficeEn}>
            <TextInput value={formData.headOfficeEn} onChange={(v) => handleFieldChange('headOfficeEn', v)} placeholder="Enter address in English" hasError={!!errors.headOfficeEn} />
          </FormField>
          <FormField label={t('headOfficeAr')} required error={errors.headOfficeAr}>
            <TextInput value={formData.headOfficeAr} onChange={(v) => handleFieldChange('headOfficeAr', v)} placeholder="أدخل العنوان بالعربية" hasError={!!errors.headOfficeAr} arabicOnly />
          </FormField>
          <FormField label={t('website')}>
            <TextInput value={formData.website} onChange={(v) => handleFieldChange('website', v)} placeholder="https://example.com" type="url" />
          </FormField>
          <FormField label={t('websiteAr')}>
            <TextInput value={formData.websiteAr} onChange={(v) => handleFieldChange('websiteAr', v)} placeholder="https://example.com/ar" />
          </FormField>
          <div className="md:col-span-2">
            <FormField label={t('contactInfo')} required error={errors.contactInfo}>
              <TextInput value={formData.contactInfo} onChange={(v) => handleFieldChange('contactInfo', v)} placeholder="Phone, email, or other contact details" hasError={!!errors.contactInfo} />
            </FormField>
          </div>
        </div>
      </QuestionCard>

      {/* ===== CARD 3: Legal Documents ===== */}
      <QuestionCard title={t('legalDocs')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { labelKey: 'crDocument', field: 'crDocument' },
            { labelKey: 'vatDocument', field: 'vatDocument' },
            { labelKey: 'mroDocument', field: 'mroDocument' },
            { labelKey: 'moaDocument', field: 'moaDocument' },
          ].map(({ labelKey, field }) => (
            <FormField key={field} label={t(labelKey)} required error={errors[field]}>
              <FileUploadBox
                onChange={(e) => handleFieldChange(field, e.target.files[0])}
                fileName={formData[field]?.name}
                hasError={!!errors[field]}
              />
            </FormField>
          ))}
        </div>
      </QuestionCard>

      {/* ===== CARD 4: Scope and Multisite Configuration ===== */}
      <QuestionCard title="Scope and Multisite Configuration">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Scope of Certification (English)" required error={errors.certAreasEn}>
              <TextInput value={formData.certAreasEn} onChange={(v) => handleFieldChange('certAreasEn', v)} placeholder="Enter in English" hasError={!!errors.certAreasEn} />
            </FormField>
            <FormField label="Scope of Certification (Arabic)" required error={errors.certScopeAr}>
              <TextInput value={formData.certScopeAr} onChange={(v) => handleFieldChange('certScopeAr', v)} placeholder="أدخل باللغة العربية" hasError={!!errors.certScopeAr} arabicOnly />
            </FormField>
          </div>

          <FormField label={t('multisiteQuestion')} required error={errors.multisite}>
            <RadioGroup value={formData.multisite} onChange={(v) => handleFieldChange('multisite', v)} options={yesNoOptions} />
          </FormField>
        </div>
      </QuestionCard>

      {/* ===== CARD 5: Workforce Details ===== */}
      <QuestionCard title={t('workforceDetails')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <FormField label={t('totalEmployees')} required error={errors.totalEmployees}>
            <TextInput value={formData.totalEmployees} onChange={(v) => handleFieldChange('totalEmployees', v)} placeholder="e.g. 500" type="number" hasError={!!errors.totalEmployees} />
          </FormField>
          <FormField label={t('permanentEmployees')} required error={errors.permanentEmployees}>
            <TextInput value={formData.permanentEmployees} onChange={(v) => handleFieldChange('permanentEmployees', v)} placeholder="e.g. 350" type="number" hasError={!!errors.permanentEmployees} />
          </FormField>
          <FormField label={t('contractEmployees')} required error={errors.contractEmployees}>
            <TextInput value={formData.contractEmployees} onChange={(v) => handleFieldChange('contractEmployees', v)} placeholder="e.g. 150" type="number" hasError={!!errors.contractEmployees} />
          </FormField>
          <FormField label={t('numberOfSites')} required error={errors.numberOfSites}>
            <TextInput value={formData.numberOfSites} onChange={(v) => handleFieldChange('numberOfSites', v)} placeholder="e.g. 3" type="number" hasError={!!errors.numberOfSites} />
          </FormField>
        </div>

        <div className="flex flex-col gap-6">
          <FormField label={t('shiftOperations')} required error={errors.shiftOperations}>
            <RadioGroup value={formData.shiftOperations} onChange={(v) => handleFieldChange('shiftOperations', v)} options={yesNoOptions} />
          </FormField>
          <FormField label={t('remoteWork')}>
            <RadioGroup value={formData.remoteWork} onChange={(v) => handleFieldChange('remoteWork', v)} options={yesNoOptions} />
          </FormField>
        </div>
      </QuestionCard>

      {/* ===== CARD 6: Brand Details ===== */}
      <QuestionCard title={t('brandDetails')}>
        {formData.brands.map((brand, idx) => (
          <div key={idx} className="border border-[#E5E7EB] rounded-2xl p-5 mb-4 bg-[#FAFAFA]">
            <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wide mb-4">Brand {idx + 1}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <FormField label="List Brands/Entities">
                <TextInput value={brand.name} onChange={(v) => updateBrand(idx, 'name', v)} placeholder="Brand name" />
              </FormField>
              <FormField label="Key Products / Services (English)">
                <TextInput value={brand.productsEn} onChange={(v) => updateBrand(idx, 'productsEn', v)} placeholder="Products in English" />
              </FormField>
              <FormField label="Key Products / Services (Arabic)" className="md:col-span-2">
                <TextInput value={brand.productsAr} onChange={(v) => updateBrand(idx, 'productsAr', v)} placeholder="المنتجات بالعربية" arabicOnly />
              </FormField>
            </div>
            <div className="flex flex-col gap-5">
              <FormField label="Critical Processes (Manufacturing)">
                <RadioGroup value={brand.criticalProcesses} onChange={(v) => updateBrand(idx, 'criticalProcesses', v)} options={yesNoOptions} />
              </FormField>
              <FormField label="Outsourced Processes">
                <RadioGroup value={brand.outsourcedProcesses} onChange={(v) => updateBrand(idx, 'outsourcedProcesses', v)} options={yesNoOptions} />
              </FormField>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addBrand}
          className="w-full py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          {t('addBrand')}
        </button>
      </QuestionCard>

      {/* ===== CARD 7: Certification and Compliance Status ===== */}
      <QuestionCard title={t('certComplianceStatus')}>
        <div className="flex flex-col gap-6">
          {[
            { label: 'ISO 9001 (Quality) *', field: 'iso9001' },
            { label: 'ISO 14001 (Environment) *', field: 'iso14001' },
            { label: 'ISO 45001 (OH&S) *', field: 'iso45001' },
            { label: 'ISO 22000/ HACCP *', field: 'iso22000' },
            { label: 'ISO 50001 (Energy) *', field: 'iso50001' },
          ].map(({ label, field }) => (
            <FormField key={field} label={label}>
              <RadioGroup value={formData[field]} onChange={(v) => handleFieldChange(field, v)} options={yesNoOptions} />
            </FormField>
          ))}

          {/* Inset Sub-Card Container for Other Certifications */}
          <div className="border border-[#E5E7EB] rounded-2xl p-5 bg-white mt-2 shadow-xs">
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Other certifications <span className="text-[#6B7280] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.otherCerts}
              onChange={(e) => handleFieldChange('otherCerts', e.target.value)}
              placeholder="Short-answer text"
              className="w-full pb-2 pt-2 text-sm bg-transparent border-b border-[#D1D5DB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] transition-colors"
            />
          </div>
        </div>
      </QuestionCard>

      {/* ===== CARD 8: ESG and Sustainability Practice Details ===== */}
      <QuestionCard title={t('esgPracticeDetails')}>
        <div className="flex flex-col gap-6">
          {[
            { label: 'ESG Program in Place', field: 'esgProgram' },
            { label: 'ESG Governance / Safety / Health Policy', field: 'esgGovernance' },
            { label: 'Sustainability Strategy / Report Sections', field: 'sustainabilityStrategy' },
            { label: 'GHG / Carbon Output Monitoring', field: 'ghgMonitoring' },
            { label: 'Energy Management Document', field: 'energyManagement' },
            { label: 'Social Responsibility Programs', field: 'socialResponsibility' },
            { label: 'Good Labour / ESG Compliance Assessment', field: 'esgCompliance' },
          ].map(({ label, field }) => (
            <FormField key={field} label={label}>
              <RadioGroup value={formData[field]} onChange={(v) => handleFieldChange(field, v)} options={yesNoOptions} />
            </FormField>
          ))}
        </div>
      </QuestionCard>

      {/* ===== CARD 9: Additional Notes & Supporting Documents ===== */}
      <QuestionCard title={t('additionalNotes')}>
        <div className="border border-[#E5E7EB] rounded-2xl p-5 bg-white mb-8 shadow-xs">
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Additional Notes <span className="text-[#6B7280] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.additionalNotes}
            onChange={(e) => handleFieldChange('additionalNotes', e.target.value)}
            placeholder="Short-answer text"
            className="w-full pb-2 pt-2 text-sm bg-transparent border-b border-[#D1D5DB] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2D6A4F] transition-colors"
          />
        </div>

        <SectionTitle>{t('supportingDocs')}</SectionTitle>
        <div className="border-2 border-dashed border-[#D1D5DB] rounded-2xl p-10 text-center hover:border-[#2D6A4F]/40 transition-colors">
          <Upload size={36} className="mx-auto text-[#9CA3AF] mb-3" />
          <p className="text-sm text-[#111827] font-medium">{t('dragDropText')}</p>
          <p className="text-xs text-[#6B7280] mt-1">Max 15MB • PDF, DOC, XLS, CSV</p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
            onChange={(e) => handleFieldChange('supportingDocs', e.target.files)}
            className="mt-4"
          />
        </div>
      </QuestionCard>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between mt-6 mb-8 py-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={clearForm}
            className="px-5 py-2.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            {t('clearForm')}
          </button>
          <button
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-[#2D6A4F] border border-[#2D6A4F] rounded-xl hover:bg-[#F0FDF4] transition-colors cursor-pointer"
          >
            {t('markFillLater')}
          </button>
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-sm font-bold rounded-2xl transition-colors cursor-pointer"
        >
          {t('next')} →
        </button>
      </div>
    </div>
  );
}
