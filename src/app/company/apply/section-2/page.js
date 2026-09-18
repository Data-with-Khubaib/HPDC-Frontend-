'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import { SectionTitle, QuestionCard } from '@/components/apply/QuestionCard';
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

  const hrQuestions = [
    { id: 10, title: '1. Human Rights Policy', text: 'Does the organization have a formal policy committing to the protection of human rights, in line with national laws and international standards (e.g., UN Guiding Principles)?' },
    { id: 11, title: '2. Non-Discrimination and Equal Opportunity', text: 'Are there documented policies and practices in place to prevent discrimination in hiring, compensation, promotion, and termination based on race, gender, religion, disability, or other protected statuses?' },
    { id: 12, title: '3. Prevention of Forced and Child Labor', text: 'Does the organization explicitly prohibit and have procedures to prevent the use of forced, compulsory, and child labor within its own operations and its supply chain?' },
    { id: 13, title: '4. Freedom of Association', text: 'Does the organization respect the right of employees to form or join trade unions and bargain collectively, where permitted by local law?' },
    { id: 14, title: '5. Grievance Mechanisms', text: 'Is there an accessible and confidential grievance mechanism for employees and external stakeholders to report human rights concerns without fear of retaliation?' },
  ];

  const hcQuestions = [
    { id: 15, title: '1. Health and Safety (OH&S)', text: 'Is there a formal Occupational Health and Safety Management System (e.g., ISO 45001) that identifies hazards, mitigates risks, and provides necessary training and protective equipment?' },
    { id: 16, title: '2. Fair Compensation and Working Hours', text: 'Does the organization guarantee that all employees are paid at least the minimum living wage, and are working hours and overtime regulated in accordance with local labor laws?' },
  ];

  const socialResponsibilityOptions = [
    'Community Engagement Strategy',
    'Philanthropy and Volunteering',
    'Local Economic Development',
  ];

  const narrativeQuestions = [
    { id: 17, title: 'Describe any specific programs or initiatives related to employee well-being (e.g., mental health support, flexible working arrangements).' },
    { id: 18, title: 'How does the organization measure and track employee satisfaction and engagement?' },
    { id: 19, title: 'What percentage of the workforce is represented by collective bargaining agreements (if applicable and legally permitted)?' },
    { id: 20, title: 'Provide examples of recent community engagement or philanthropic activities.' },
    { id: 21, title: 'How does the organization ensure that its social investments align with the needs of the local communities?' },
    { id: 22, title: 'Has the organization conducted any human rights impact assessments for its operations or major projects? If yes, briefly describe the outcomes.' },
    { id: 23, title: 'How are suppliers assessed for social compliance (e.g., labor practices, health and safety)?' },
  ];

  const handleNext = () => {
    const newErrors = {};
    let hasError = false;

    // Validate radio questions
    [...hrQuestions, ...hcQuestions].forEach((q) => {
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

    // Validate checkbox group
    if (!formData.socialResponsibilityInitiatives || formData.socialResponsibilityInitiatives.length === 0) {
      newErrors.socialResponsibilityInitiatives = 'Please select at least one initiative';
      hasError = true;
    }

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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332]">Section 2: Social Sustainability</h1>
        <p className="text-sm sm:text-base text-[#42716C]">
          Please answer the following questions regarding your social practices.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <SectionTitle>Human Rights</SectionTitle>
          <div className="space-y-6">
            {hrQuestions.map(renderRadioQuestion)}
          </div>
        </div>

        <div>
          <SectionTitle>Human Capital & Labor Practices</SectionTitle>
          <div className="space-y-6">
            {hcQuestions.map(renderRadioQuestion)}
          </div>
        </div>

        <div>
          <SectionTitle>Social Responsibility & Community Impact</SectionTitle>
          <QuestionCard title="Social Responsibility Initiatives">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-gray-800">Select all that apply:</p>
              <div className="space-y-3">
                {socialResponsibilityOptions.map((option) => (
                  <label key={option} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input
                        type="checkbox"
                        checked={(formData.socialResponsibilityInitiatives || []).includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded transition-all peer-checked:bg-[#1B4332] peer-checked:border-[#1B4332] group-hover:border-[#2D6A4F]"></div>
                      <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {errors.socialResponsibilityInitiatives && <p className="text-xs text-red-500 mt-2">{errors.socialResponsibilityInitiatives}</p>}
            </div>
          </QuestionCard>
        </div>

        <div>
          <SectionTitle>Narrative/Additional Information</SectionTitle>
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
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => router.push('/company/apply/section-1')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext}>
          Next Section →
        </Button>
      </div>
    </div>
  );
}
