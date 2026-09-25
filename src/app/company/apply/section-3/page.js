'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import { QuestionCard } from '@/components/apply/QuestionCard';
import RadioGroup from '@/components/apply/RadioGroup';
import Button from '@/components/ui/Button';

export default function Section3Page() {
  const router = useRouter();
  const { formData, updateSurvey, updatePartialExplanation } = useWizard();
  const { t } = useLanguage();
  const [errors, setErrors] = useState({});

  const yesPartialNoOptions = [
    { val: 'Yes', label: t('yes') },
    { val: 'Partial', label: t('partial') },
    { val: 'No', label: t('no') },
  ];

  // ── Sub-section: Sustainability Governance and Business Conduct (Narrative) ──
  const govNarrativeQuestions = [
    { id: 45, text: 'Describe who is accountable for sustainability-related matters, how responsibilities are allocated, and how management oversight is maintained for the application scope.' },
    { id: 46, text: 'Explain how the applicant identifies and prioritizes key sustainability topics, business-conduct risks, and major legal or regulatory obligations relevant to the application scope.' },
    { id: 47, text: 'Describe any sustainability objectives, priorities, action plans, assigned responsibilities, timelines, or resources used to improve performance within the application scope.' },
    { id: 48, text: 'Explain what sustainability information is collected, how records are maintained, who is responsible, and how completeness or accuracy is checked before use or reporting.' },
    { id: 49, text: 'Describe how sustainability matters are reviewed internally, how outcomes are communicated, and how issues, weaknesses, or opportunities are converted into improvement actions.' },
    { id: 50, text: 'Describe the main business-conduct, anti-corruption, anti-bribery, declaration, approval, training, reporting, or speak-up controls used in the application scope.' },
    { id: 51, text: 'State whether any conviction or fine occurred during the reporting period. If yes, provide the number of convictions, total amount of fines, affected entity or site, brief description, and current status.' },
    { id: 52, text: 'How sustainability-related matters influence strategy, business planning, major investments, market-entry or sourcing decisions, product or service development, and longer-term business-model decisions.' },
    { id: 53, text: 'Provide a more detailed description of sustainability practices, policies, initiatives, responsibilities, and planned future actions.' },
    { id: 54, text: 'Where a governance body exists, explain how its composition is recorded, reviewed, and considered in governance planning or nominations.' },
  ];

  // ── Sub-section: Organizational Governance (Radio) ──
  const orgQuestions = [
    { id: 55, text: 'Is the governing body structured to meet stakeholder expectations?' },
    { id: 56, text: 'Is the governing body competent and accountable for oversight?' },
    { id: 57, text: 'Does the governing body support long-term sustainability and value creation?' },
  ];

  // ── Sub-section: Risk Management (Radio) ──
  const riskQuestions = [
    { id: 58, text: 'Does your organization have a risk management framework?' },
    { id: 59, text: 'Does your organization perform risk identification, assessment, and treatment?' },
  ];

  // ── Sub-section: Compliance Management (Radio) ──
  const complianceQuestions = [
    { id: 60, text: 'Does your organization maintain a compliance obligations register?' },
    { id: 61, text: 'Does your organization assess and manage compliance risks?' },
  ];

  // ── Sub-section: Privacy & Information Security (Radio) ──
  const privacyQuestions = [
    { id: 62, text: 'Has your organization assessed information security risks and vulnerabilities?' },
    { id: 63, text: 'Has your organization implemented privacy and information security controls?' },
  ];

  const allRadioQuestions = [...orgQuestions, ...riskQuestions, ...complianceQuestions, ...privacyQuestions];

  // ── Completeness check ──
  const isComplete = useMemo(() => {
    for (const q of govNarrativeQuestions) {
      if (!formData.survey[q.id] || !formData.survey[q.id].trim()) return false;
    }
    for (const q of allRadioQuestions) {
      const answer = formData.survey[q.id];
      if (!answer) return false;
      if (answer === 'Partial') {
        const explanation = formData.partialExplanations?.[q.id];
        if (!explanation || !explanation.trim()) return false;
      }
    }
    return true;
  }, [formData.survey, formData.partialExplanations]);

  const handleNext = () => {
    const newErrors = {};
    let hasError = false;

    govNarrativeQuestions.forEach((q) => {
      if (!formData.survey[q.id] || !formData.survey[q.id].trim()) {
        newErrors[q.id] = 'This field is required';
        hasError = true;
      }
    });

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

    if (hasError) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors({});
      router.push('/company/apply/section-4');
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
           <h2 className="text-xl sm:text-2xl font-bold text-[#1b5e20]">Section 3 of 4 : ESG Assessment</h2>
           <p className="text-[#fb2c36] text-sm mt-2 font-medium">( * ) Indicates Required Questions</p>
        </div>
        <div className="text-[#2E7D32] text-sm flex items-center gap-2 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          All changes saved
        </div>
      </div>

      <div className="space-y-10">
        {/* Sustainability Governance and Business Conduct - Narrative */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">Sustainability Governance and Business Conduct</h3>
          <div className="space-y-8">
            {govNarrativeQuestions.map((q) => (
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

        {renderSubSection('Organizational Governance', orgQuestions)}
        {renderSubSection('Risk Management', riskQuestions)}
        {renderSubSection('Compliance Management', complianceQuestions)}
        {renderSubSection('Privacy & Information Security', privacyQuestions)}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => router.push('/company/apply/section-2')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext} disabled={!isComplete}>
          Next &gt;
        </Button>
      </div>
    </div>
  );
}
