'use client';
import { useState } from 'react';
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

  // Exact questions from prototype
  const questions = [
    {
      id: 1,
      title: '1. Environmental Management System (EMS)',
      text: 'Does the organization have a formal Environmental Management System (e.g., ISO 14001) in place?',
    },
    {
      id: 2,
      title: '2. Environmental Policy',
      text: 'Is there a documented environmental policy that has been approved by top management and communicated to all employees?',
    },
    {
      id: 3,
      title: '3. Compliance with Environmental Laws',
      text: 'Does the organization have a process to identify, monitor, and ensure compliance with all applicable local, national, and international environmental laws and regulations?',
    },
    {
      id: 4,
      title: '4. Resource Efficiency (Energy & Water)',
      text: 'Are there established targets and initiatives for reducing energy consumption, water usage, and overall resource footprint?',
    },
    {
      id: 5,
      title: '5. Greenhouse Gas (GHG) Emissions',
      text: 'Does the organization measure, monitor, and report its Scope 1, Scope 2, and (if applicable) Scope 3 GHG emissions?',
    },
    {
      id: 6,
      title: '6. Waste Management and Recycling',
      text: 'Is there a comprehensive waste management program that emphasizes reducing, reusing, and recycling materials, as well as safe disposal of hazardous waste?',
    },
    {
      id: 7,
      title: '7. Pollution Prevention',
      text: 'Are operational controls in place to prevent pollution (e.g., air emissions, wastewater discharge, soil contamination) and respond effectively to environmental emergencies?',
    },
    {
      id: 8,
      title: '8. Biodiversity and Conservation',
      text: 'Has the organization assessed its impact on local biodiversity and implemented measures to protect and restore natural habitats where applicable?',
    },
    {
      id: 9,
      title: '9. Sustainable Supply Chain (Environmental)',
      text: 'Does the organization evaluate and select suppliers based on their environmental performance and encourage them to adopt sustainable practices?',
    },
  ];

  const handleNext = () => {
    const newErrors = {};
    let hasError = false;

    questions.forEach((q) => {
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
      router.push('/company/apply/section-2');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col items-center justify-center space-y-2 text-center pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332]">Section 1: Environmental Sustainability</h1>
        <p className="text-sm sm:text-base text-[#42716C]">
          Please answer the following questions regarding your environmental practices.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => {
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
        })}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => router.push('/company/apply/company-details')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext}>
          Next Section →
        </Button>
      </div>
    </div>
  );
}
