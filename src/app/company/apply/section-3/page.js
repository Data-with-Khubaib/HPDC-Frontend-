'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import { SectionTitle, QuestionCard } from '@/components/apply/QuestionCard';
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

  const orgQuestions = [
    { id: 34, title: '1. Board Independence and Diversity', text: 'Does the organization have an independent board of directors (or equivalent governing body) with a commitment to diversity (e.g., gender, expertise, background)?' },
    { id: 35, title: '2. Executive Compensation', text: 'Is executive compensation linked to sustainability or ESG performance targets?' },
    { id: 36, title: '3. Shareholder/Stakeholder Rights', text: 'Are there established mechanisms to protect minority shareholder rights and ensure transparent communication with all key stakeholders?' },
  ];

  const riskQuestions = [
    { id: 37, title: '1. Enterprise Risk Management (ERM)', text: 'Does the organization have a formal ERM framework that integrates ESG risks (e.g., climate change, regulatory changes, supply chain disruptions)?' },
    { id: 38, title: '2. Business Continuity', text: 'Is there a tested business continuity and disaster recovery plan in place?' },
  ];

  const complianceQuestions = [
    { id: 39, title: '1. Code of Conduct and Ethics', text: 'Does the organization have a formal Code of Conduct that applies to all employees, executives, and directors, covering anti-corruption, anti-bribery, and conflict of interest?' },
    { id: 40, title: '2. Whistleblower Protection', text: 'Is there a formal whistleblower policy and an anonymous reporting channel for ethical or legal violations, ensuring protection against retaliation?' },
  ];

  const narrativeQuestions = [
    { id: 24, title: 'How does the Board of Directors oversee ESG and sustainability initiatives?' },
    { id: 25, title: 'Describe the organization\'s approach to managing conflicts of interest.' },
    { id: 26, title: 'Provide details on how ESG risks are identified, assessed, and managed within the ERM framework.' },
    { id: 27, title: 'How frequently does the organization conduct internal or external audits of its sustainability or ESG performance?' },
    { id: 28, title: 'Describe the training provided to employees on the Code of Conduct, anti-corruption, and anti-bribery policies.' },
    { id: 29, title: 'How does the organization ensure compliance with local and international trade laws and sanctions?' },
    { id: 30, title: 'Are there any recent or pending legal actions against the organization related to environmental, social, or governance issues? If yes, please explain.' },
    { id: 31, title: 'How does the organization protect data privacy and cybersecurity? (e.g., compliance with GDPR, local data protection laws).' },
    { id: 32, title: 'Does the organization engage in public policy advocacy or lobbying? If so, how is this aligned with its ESG commitments?' },
    { id: 33, title: 'How are the organization\'s tax practices aligned with its overall commitment to transparency and social responsibility?' },
  ];

  const handleNext = () => {
    const newErrors = {};
    let hasError = false;

    // Validate radio questions
    [...orgQuestions, ...riskQuestions, ...complianceQuestions].forEach((q) => {
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

    // Validate narrative questions
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
      router.push('/company/apply/section-4');
    }
  };

  const renderRadioQuestion = (q) => {
    const answer = formData.survey[q.id] || '';
    const showPartial = answer === 'Partial';
    const partialError = errors[`${q.id}_partial`];

    return (
      <QuestionCard key={q.id} title={q.title}>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-800">{q.text}</p>
          <div className="mt-2">
            <RadioGroup
              value={answer}
              onChange={(val) => {
                updateSurvey(q.id, val);
                if (errors[q.id]) setErrors((prev) => ({ ...prev, [q.id]: null }));
              }}
              options={yesPartialNoOptions}
            />
            {errors[q.id] && <p className="text-xs text-red-500 mt-2">{errors[q.id]}</p>}
          </div>
          
          {showPartial && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-slide-up">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please explain your partial compliance <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.partialExplanations?.[q.id] || ''}
                onChange={(e) => {
                  updatePartialExplanation(q.id, e.target.value);
                  if (partialError) setErrors((prev) => ({ ...prev, [`${q.id}_partial`]: null }));
                }}
                className={`w-full p-3 text-sm bg-white border ${partialError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#2D6A4F]'} rounded-xl focus:outline-none transition-colors min-h-[100px]`}
                placeholder="Provide details about what parts are implemented and what is missing..."
              />
              {partialError && <p className="text-xs text-red-500 mt-2">{partialError}</p>}
            </div>
          )}
        </div>
      </QuestionCard>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col items-center justify-center space-y-2 text-center pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332]">Section 3: Governance</h1>
        <p className="text-sm sm:text-base text-[#42716C]">
          Please answer the following questions regarding your corporate governance.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <SectionTitle>Sustainability Governance & Reporting</SectionTitle>
          <div className="space-y-6">
            {narrativeQuestions.map((q) => (
              <QuestionCard key={q.id} title={q.title}>
                <textarea
                  value={formData.survey[q.id] || ''}
                  onChange={(e) => {
                    updateSurvey(q.id, e.target.value);
                    if (errors[q.id]) setErrors(prev => ({ ...prev, [q.id]: null }));
                  }}
                  className={`w-full p-4 text-sm bg-white border ${errors[q.id] ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#1B4332]'} rounded-xl focus:outline-none transition-colors min-h-[120px]`}
                  placeholder="Your answer..."
                />
                {errors[q.id] && <p className="text-xs text-red-500 mt-2">{errors[q.id]}</p>}
              </QuestionCard>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Organizational Governance</SectionTitle>
          <div className="space-y-6">
            {orgQuestions.map(renderRadioQuestion)}
          </div>
        </div>

        <div>
          <SectionTitle>Risk Management</SectionTitle>
          <div className="space-y-6">
            {riskQuestions.map(renderRadioQuestion)}
          </div>
        </div>

        <div>
          <SectionTitle>Compliance Management</SectionTitle>
          <div className="space-y-6">
            {complianceQuestions.map(renderRadioQuestion)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => router.push('/company/apply/section-2')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext}>
          Next Section →
        </Button>
      </div>
    </div>
  );
}
