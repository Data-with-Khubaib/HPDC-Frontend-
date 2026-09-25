'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import { QuestionCard } from '@/components/apply/QuestionCard';
import RadioGroup from '@/components/apply/RadioGroup';
import Button from '@/components/ui/Button';

export default function Section2Page() {
  const router = useRouter();
  const { formData, updateSurvey, updatePartialExplanation, updateField } = useWizard();
  const { t } = useLanguage();
  const [errors, setErrors] = useState({});

  const yesPartialNoOptions = [
    { val: 'Yes', label: t('yes') },
    { val: 'Partial', label: t('partial') },
    { val: 'No', label: t('no') },
  ];

  // ── Sub-section: Human Rights ──
  const hrQuestions = [
    { id: 30, text: 'Does your organization have a documented Human Rights Policy?' },
    { id: 31, text: 'Has your organization conducted human rights due diligence?' },
    { id: 32, text: 'Does your organization prohibit forced or compulsory labor?' },
    { id: 33, text: 'Does your organization conduct health and safety risk assessments?' },
    { id: 34, text: 'Does your organization provide a safe and healthy workplace?' },
  ];

  // ── Sub-section: Human Capital Reporting ──
  const hcQuestions = [
    { id: 35, text: 'Does your organization promote workforce diversity and inclusion?' },
    { id: 36, text: 'Does your organization support employee wellbeing and ethical labor practices?' },
  ];

  // All radio questions
  const allRadioQuestions = [...hrQuestions, ...hcQuestions];

  // ── Sub-section: Social Responsibility (Checkbox) ──
  const socialResponsibilityOptions = [
    'Community Development',
    'Education & Culture',
    'Employment & Skills Development',
    'Community Health',
    'Wealth Creation',
    'Social Investment',
  ];

  // ── Sub-section: Social Sustainability (Narrative) ──
  const narrativeQuestions = [
    { id: 38, text: 'Explain how workforce information is maintained, what data fields are recorded, and how the data is kept current.' },
    { id: 39, text: 'Describe the main occupational health and safety practices, responsibilities, checks, and worker protections used in the application scope.' },
    { id: 40, text: 'Explain how work-related accidents and fatalities are recorded, investigated, reviewed, and used for prevention.' },
    { id: 41, text: 'Explain how the company ensures wage compliance across the application scope, including how changes in minimum wage requirements are handled.' },
    { id: 42, text: 'Describe how employee training, competence development, and training-hour records are managed within the scope.' },
    { id: 43, text: 'Where relevant, describe additional workforce metrics such as management gender ratio, temporary agency workers, or self-employed workers working exclusively for the company.' },
    { id: 44, text: 'Describe any human-rights-related policy, code, complaint route, or grievance mechanism relevant to employees or workers in the application scope.' },
  ];

  // ── Completeness check ──
  const isComplete = useMemo(() => {
    for (const q of allRadioQuestions) {
      const answer = formData.survey[q.id];
      if (!answer) return false;
      if (answer === 'Partial') {
        const explanation = formData.partialExplanations?.[q.id];
        if (!explanation || !explanation.trim()) return false;
      }
    }
    if (!formData.socialResponsibilityInitiatives || formData.socialResponsibilityInitiatives.length === 0) return false;
    for (const q of narrativeQuestions) {
      if (!formData.survey[q.id] || !formData.survey[q.id].trim()) return false;
    }
    return true;
  }, [formData.survey, formData.partialExplanations, formData.socialResponsibilityInitiatives]);

  const handleNext = () => {
    const newErrors = {};
    let hasError = false;

    allRadioQuestions.forEach((q) => {
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

    if (!formData.socialResponsibilityInitiatives || formData.socialResponsibilityInitiatives.length === 0) {
      newErrors.socialResponsibilityInitiatives = 'Please select at least one initiative';
      hasError = true;
    }

    narrativeQuestions.forEach((q) => {
      if (!formData.survey[q.id] || !formData.survey[q.id].trim()) {
        newErrors[q.id] = 'This field is required';
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors({});
      router.push('/company/apply/section-3');
    }
  };

  const handleCheckboxChange = (option) => {
    const current = formData.socialResponsibilityInitiatives || [];
    const updated = current.includes(option)
      ? current.filter(item => item !== option)
      : [...current, option];
    updateField('socialResponsibilityInitiatives', updated);
    if (errors.socialResponsibilityInitiatives) {
      setErrors(prev => ({ ...prev, socialResponsibilityInitiatives: null }));
    }
  };

  const renderRadioQuestion = (q) => {
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
          options={yesPartialNoOptions}
        />
        {errors[q.id] && <p className="text-xs text-[#fb2c36] mt-2">{errors[q.id]}</p>}

        {showPartial && (
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

  const renderSubSection = (title, questions) => (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
      <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">{title}</h3>
      <div className="space-y-6">
        {questions.map(renderRadioQuestion)}
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
           <h2 className="text-xl sm:text-2xl font-bold text-[#1b5e20]">Section 2 of 4 : ESG Assessment</h2>
           <p className="text-[#fb2c36] text-sm mt-2 font-medium">( * ) Indicates Required Questions</p>
        </div>
        <div className="text-[#2E7D32] text-sm flex items-center gap-2 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          All changes saved
        </div>
      </div>

      <div className="space-y-10">
        {renderSubSection('Human Rights', hrQuestions)}
        {renderSubSection('Human Capital Reporting', hcQuestions)}

        {/* Social Responsibility - Checkbox */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">Social Responsibility</h3>
          <p className="text-[15px] text-gray-500 mb-4">Which social responsibility initiatives does your organization support? <span className="text-[#fb2c36]">*</span></p>
          <QuestionCard>
            <p className="text-[15px] text-gray-800 mb-6">Which social responsibility initiatives does your organization support? <span className="text-[#fb2c36]">*</span></p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-[90%]">
              {socialResponsibilityOptions.map((option) => {
                const isSelected = (formData.socialResponsibilityInitiatives || []).includes(option);
                return (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(option)}
                        className="peer sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[#1b5e20]' : 'border-[#CBD5E1] group-hover:border-[#1b5e20]'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1b5e20]" />}
                      </div>
                    </div>
                    <span className={`text-[14px] ${isSelected ? 'text-[#1b5e20] font-medium' : 'text-[#64748B]'}`}>{option}</span>
                  </label>
                );
              })}
            </div>
            {errors.socialResponsibilityInitiatives && <p className="text-xs text-[#fb2c36] mt-3">{errors.socialResponsibilityInitiatives}</p>}
          </QuestionCard>
        </div>

        {/* Social Sustainability - Narrative */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">Social Sustainability</h3>
          <div className="space-y-8">
            {narrativeQuestions.map((q) => (
              <QuestionCard key={q.id}>
                <p className="text-[15px] text-gray-800 mb-4">{q.text} <span className="text-[#fb2c36]">*</span></p>
                <textarea
                  value={formData.survey[q.id] || ''}
                  onChange={(e) => {
                    updateSurvey(q.id, e.target.value);
                    if (errors[q.id]) setErrors(prev => ({ ...prev, [q.id]: null }));
                  }}
                  rows={1}
                  className={`w-full py-2 text-[15px] bg-transparent border-0 border-b focus:ring-0 resize-y transition-colors outline-none ${
                    errors[q.id] 
                      ? 'border-[#fb2c36] focus:border-[#fb2c36]' 
                      : 'border-[#7e9987] focus:border-[#1b5e20]' 
                  }`}
                  placeholder="Short-answer text"
                />
                {errors[q.id] && <p className="text-xs text-[#fb2c36] mt-2">{errors[q.id]}</p>}
              </QuestionCard>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => router.push('/company/apply/section-1')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext} disabled={!isComplete}>
          Next &gt;
        </Button>
      </div>
    </div>
  );
}
