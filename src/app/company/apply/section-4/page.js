'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import { QuestionCard } from '@/components/apply/QuestionCard';
import RadioGroup from '@/components/apply/RadioGroup';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

export default function Section4Page() {
  const router = useRouter();
  const { formData, updateSurvey, updatePartialExplanation, updateField } = useWizard();
  const { t } = useLanguage();
  const [errors, setErrors] = useState({});

  const yesNoOptions = [
    { val: 'Yes', label: t('yes') },
    { val: 'No', label: t('no') },
  ];

  const yesPartialNoOptions = [
    { val: 'Yes', label: t('yes') },
    { val: 'Partial', label: t('partial') },
    { val: 'No', label: t('no') },
  ];

  // ── Sub-section: Halal Certification Scope ──
  const halalQuestion = { id: 64, text: 'Does your company have a valid Halal certificate?' };

  // ── Sub-section: Innovation Management ──
  const innovationQuestions = [
    { id: 65, text: 'Does your organization have a structured process for innovation and continuous improvement?' },
    { id: 66, text: 'Does your organization develop innovation-related skills and capabilities?' },
  ];

  // ── Sub-section: Product Stewardship & Quality ──
  const productQuestions = [
    { id: 67, text: 'Does your organization have a Product Stewardship and Quality Policy?' },
    { id: 68, text: 'Does leadership support reducing product life-cycle impacts and promoting sustainable production?' },
  ];

  // ── Sub-section: Stakeholder Management ──
  const stakeholderQuestions = [
    { id: 69, text: 'Has your organization identified internal and external stakeholders?' },
    { id: 70, text: 'Has your organization categorized stakeholders based on influence and interest?' },
    { id: 71, text: 'Has your organization considered underrepresented stakeholder groups?' },
    { id: 72, text: 'Has your organization developed a stakeholder engagement strategy?' },
  ];

  // ── Sub-section: Sustainable Finance ──
  const financeQuestions = [
    { id: 73, text: 'Are sustainability risks and opportunities integrated into financial decisions?' },
    { id: 74, text: 'Does your organization assess sustainability impacts at transaction and portfolio levels?' },
    { id: 75, text: 'Is sustainability oversight assigned to a board or committee?' },
    { id: 76, text: 'Does your organization report on sustainability-related financial disclosures?' },
  ];

  // ── Sub-section: Sustainable Procurement ──
  const procurementQuestions = [
    { id: 77, text: 'Does your organization assess sustainability impacts within procurement activities?' },
    { id: 78, text: 'Are life-cycle impacts considered during purchasing decisions?' },
    { id: 79, text: 'Does your organization support supplier diversity and local sourcing?' },
  ];

  // All radio questions (Yes/Partial/No)
  const allYPNQuestions = [
    ...innovationQuestions, ...productQuestions, ...stakeholderQuestions,
    ...financeQuestions, ...procurementQuestions,
  ];

  // ── Sub-section: ESG Performance Metrics (optional textarea) ──
  const esgMetricsQuestion = { id: 80, text: 'Which ESG performance metrics does your organization currently monitor? (optional)' };

  // ── Completeness check ──
  const isComplete = useMemo(() => {
    // Halal (Yes/No)
    if (!formData.survey[halalQuestion.id]) return false;
    // All YPN radio questions
    for (const q of allYPNQuestions) {
      const answer = formData.survey[q.id];
      if (!answer) return false;
      if (answer === 'Partial') {
        const explanation = formData.partialExplanations?.[q.id];
        if (!explanation || !explanation.trim()) return false;
      }
    }
    // Terms
    if (!formData.agreedToTerms) return false;
    return true;
  }, [formData.survey, formData.partialExplanations, formData.agreedToTerms]);

  const handleNext = () => {
    const newErrors = {};
    let hasError = false;

    // Halal
    if (!formData.survey[halalQuestion.id]) {
      newErrors[halalQuestion.id] = 'This field is required';
      hasError = true;
    }

    // YPN questions
    allYPNQuestions.forEach((q) => {
      const answer = formData.survey[q.id];
      if (!answer) {
        newErrors[q.id] = 'This field is required';
        hasError = true;
      } else if (answer === 'Partial') {
        const explanation = formData.partialExplanations?.[q.id];
        if (!explanation || !explanation.trim()) {
          newErrors[`${q.id}_partial`] = 'Please provide an explanation for Partial';
          hasError = true;
        }
      }
    });

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors({});
      router.push('/company/apply/payment');
    }
  };

  const renderRadioQuestion = (q, options = yesPartialNoOptions) => {
    const answer = formData.survey[q.id] || '';
    const showPartial = answer === 'Partial';
    const partialError = errors[`${q.id}_partial`];

    return (
      <QuestionCard key={q.id}>
        <p className="text-[15px] text-gray-800">{q.text} <span className="text-[#fb2c36]">*</span></p>
        <RadioGroup
          value={answer}
          onChange={(val) => {
            updateSurvey(q.id, val);
            if (errors[q.id]) setErrors((prev) => ({ ...prev, [q.id]: null }));
          }}
          options={options}
        />
        {errors[q.id] && <p className="text-xs text-[#fb2c36] mt-2">{errors[q.id]}</p>}

        {showPartial && options.length === 3 && (
          <div className="mt-4 animate-slide-up">
              <textarea
                value={formData.partialExplanations?.[q.id] || ''}
                onChange={(e) => {
                  updatePartialExplanation(q.id, e.target.value);
                  if (partialError) setErrors((prev) => ({ ...prev, [`${q.id}_partial`]: null }));
                }}
                rows={1}
                className={`w-full py-2 text-[15px] bg-transparent border-0 border-b focus:ring-0 resize-y transition-colors outline-none ${
                  partialError 
                    ? 'border-[#fb2c36] focus:border-[#fb2c36]' 
                    : 'border-[#7e9987] focus:border-[#1b5e20]' 
                }`}
                placeholder="Short-answer text"
              />
            {partialError && <p className="text-xs text-[#fb2c36] mt-2">{partialError}</p>}
          </div>
        )}
      </QuestionCard>
    );
  };

  const renderSubSection = (title, questions, options = yesPartialNoOptions) => (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
      <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">{title}</h3>
      <div className="space-y-6">
        {questions.map((q) => renderRadioQuestion(q, options))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col items-center justify-center space-y-2 text-center pb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1b5e20]">Random Question Survey</h1>
        <p className="text-sm sm:text-base text-[#527a64]">
          Answer these questions to Complete the application form
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl sm:text-2xl font-bold text-[#1b5e20]">Section 4 of 4 : ESG Assessment</h2>
           <p className="text-[#fb2c36] text-sm mt-2 font-medium">( * ) Indicates Required Questions</p>
        </div>
        <div className="text-[#2E7D32] text-sm flex items-center gap-2 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          All changes saved
        </div>
      </div>

      <div className="space-y-10">
        {/* Halal Certification - Yes/No only */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">Halal Certification Scope</h3>
          {renderRadioQuestion(halalQuestion, yesNoOptions)}
        </div>

        {renderSubSection('Innovation Management', innovationQuestions)}
        {renderSubSection('Product Stewardship & Quality', productQuestions)}
        {renderSubSection('Stakeholder Management', stakeholderQuestions)}
        {renderSubSection('Sustainable Finance', financeQuestions)}
        {renderSubSection('Sustainable Procurement', procurementQuestions)}

        {/* ESG Performance Metrics - Optional textarea */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">ESG Performance Metrics</h3>
          <QuestionCard>
            <p className="text-[15px] text-gray-800 mb-4">{esgMetricsQuestion.text}</p>
            <textarea
              value={formData.survey[esgMetricsQuestion.id] || ''}
              onChange={(e) => updateSurvey(esgMetricsQuestion.id, e.target.value)}
              rows={1}
              className="w-full py-2 text-[15px] bg-transparent border-0 border-b border-[#7e9987] focus:border-[#1b5e20] focus:ring-0 resize-y transition-colors outline-none"
              placeholder="Short-answer text"
            />
          </QuestionCard>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-1 shrink-0">
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => {
                  updateField('agreedToTerms', e.target.checked);
                  if (errors.agreedToTerms) setErrors(prev => ({ ...prev, agreedToTerms: null }));
                }}
                className="peer sr-only"
              />
              <div className={`w-6 h-6 border-2 rounded-lg transition-all ${
                formData.agreedToTerms
                  ? 'bg-[#1b5e20] border-[#1b5e20]'
                  : errors.agreedToTerms
                  ? 'border-[#fb2c36] bg-red-50'
                  : 'border-gray-300 bg-white group-hover:border-[#1b5e20]'
              }`}></div>
              <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">I agree to the Terms & Conditions and certify that the information provided in this ESG assessment is true, accurate, and complete to the best of my knowledge.</p>
              {errors.agreedToTerms && <p className="text-[#fb2c36] mt-2">{errors.agreedToTerms}</p>}
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => router.push('/company/apply/section-3')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext} disabled={!isComplete}>
          Next &gt;
        </Button>
      </div>
    </div>
  );
}
