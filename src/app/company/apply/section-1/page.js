'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import { SectionTitle, QuestionCard } from '@/components/apply/QuestionCard';
import RadioGroup from '@/components/apply/RadioGroup';
import Button from '@/components/ui/Button';

export default function Section1Page() {
  const router = useRouter();
  const { formData, updateSurvey, updatePartialExplanation } = useWizard();
  const { t } = useLanguage();
  const [errors, setErrors] = useState({});

  const yesPartialNoOptions = [
    { val: 'Yes', label: t('yes') },
    { val: 'Partial', label: t('partial') },
    { val: 'No', label: t('no') },
  ];

  // ── Sub-section: GreenHouse Gas Management ──
  const ghgQuestions = [
    { id: 1, text: 'Does your organization maintain a GHG inventory covering Scope 1, Scope 2, and Scope 3 emissions?' },
    { id: 2, text: 'Does your organization have a documented GHG reduction/removal action plan?' },
    { id: 3, text: 'Does your organization maintain a carbon footprint inventory?' },
  ];

  // ── Sub-section: Adaptation to Climate Change ──
  const climateQuestions = [
    { id: 4, text: 'Has your organization identified and documented climate-related risks and hazards?' },
    { id: 5, text: 'Does your organization collect and annually review climate data and projections?' },
    { id: 6, text: 'Has a climate vulnerability and exposure assessment been conducted?' },
    { id: 7, text: 'Has your organization assessed climate exposure and adaptation measures?' },
  ];

  // ── Sub-section: Biodiversity Management ──
  const bioQuestions = [
    { id: 8, text: 'Has your organization completed a biodiversity impact and risk assessment (DIRO)?' },
    { id: 9, text: 'Does your organization have a documented Biodiversity Action Plan?' },
  ];

  // ── Sub-section: Water Footprint Management ──
  const waterQuestions = [
    { id: 10, text: 'Has your organization completed a water footprint inventory?' },
    { id: 11, text: 'Has your organization completed a water footprint impact assessment?' },
  ];

  // ── Sub-section: Circular Economy ──
  const circularQuestions = [
    { id: 12, text: 'Has your organization identified circular economy stakeholders and engaged them?' },
    { id: 13, text: 'Has your organization implemented circular practices such as reuse, regeneration, or remanufacturing?' },
    { id: 14, text: 'Has your organization established circular economy collaborations across its value chain?' },
    { id: 15, text: 'Has circularity been integrated into product or service design?' },
  ];

  // ── Sub-section: Environmental Management ──
  const envMgmtQuestions = [
    { id: 16, text: 'Has your organization identified and documented its environmental impacts and aspects?' },
    { id: 17, text: 'Has your organization established measures to reduce environmental pollution and emissions?' },
    { id: 18, text: 'Has your organization established waste prevention measures to reduce waste generation?' },
  ];

  // ── Sub-section: Energy Management ──
  const energyQuestions = [
    { id: 19, text: 'Does your organization monitor and audit its energy consumption?' },
    { id: 20, text: 'Does your organization have an energy improvement plan based on an established baseline?' },
  ];

  // All radio questions combined
  const allRadioQuestions = [
    ...ghgQuestions, ...climateQuestions, ...bioQuestions,
    ...waterQuestions, ...circularQuestions, ...envMgmtQuestions, ...energyQuestions,
  ];

  // ── Sub-section: Environmental Sustainability (Narrative) ──
  const narrativeQuestions = [
    { id: 21, text: 'Explain how electricity, fuel, or other energy use is measured, recorded, reviewed, and used for improvement.' },
    { id: 22, text: 'Describe the method used to calculate or estimate Scope 1 and Scope 2 emissions, what data is included, and how the results are used.' },
    { id: 23, text: 'Where relevant, explain the main pollution sources, what is monitored, how often it is reviewed, and what controls are used.' },
    { id: 24, text: 'Explain how water use is measured, where the main water uses occur, and how the data is reviewed.' },
    { id: 25, text: 'Describe any circular-economy or resource-efficiency practices such as reuse, repair, packaging reduction, recycled-content use, or design changes.' },
    { id: 26, text: 'Explain the main waste streams, how waste is segregated, who handles disposal or recycling, and what records are maintained.' },
    { id: 27, text: 'Describe the main waste-reduction, recycling, or reuse actions in place and explain how results are evaluated.' },
    { id: 28, text: 'Describe any GHG reduction targets, climate-transition actions, Scope 3 work where relevant, or net-zero-related plans. Explain the base year, target year, scope, and main actions.' },
    { id: 29, text: 'Explain the main physical and transition climate risks, affected sites or operations, and what actions are taken to respond or adapt.' },
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
    for (const q of narrativeQuestions) {
      if (!formData.survey[q.id] || !formData.survey[q.id].trim()) return false;
    }
    return true;
  }, [formData.survey, formData.partialExplanations]);

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
      router.push('/company/apply/section-2');
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
           <h2 className="text-xl sm:text-2xl font-bold text-[#1b5e20]">Section 1 of 4 : ESG Assessment</h2>
           <p className="text-[#fb2c36] text-sm mt-2 font-medium">( * ) Indicates Required Questions</p>
        </div>
        <div className="text-[#2E7D32] text-sm flex items-center gap-2 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          All changes saved
        </div>
      </div>

      <div className="space-y-10">
        {renderSubSection('GreenHouse Gas Management', ghgQuestions)}
        {renderSubSection('Adaptation to Climate Change', climateQuestions)}
        {renderSubSection('Biodiversity Management', bioQuestions)}
        {renderSubSection('Water Footprint Management', waterQuestions)}
        {renderSubSection('Circular Economy', circularQuestions)}
        {renderSubSection('Environmental Management', envMgmtQuestions)}
        {renderSubSection('Energy Management', energyQuestions)}

        {/* Narrative sub-section */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1b5e20] mb-6">Environmental Sustainability</h3>
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
        <Button variant="outline" onClick={() => router.push('/company/apply/company-details')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext} disabled={!isComplete}>
          Next &gt;
        </Button>
      </div>
    </div>
  );
}
