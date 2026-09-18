'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/components/apply/WizardContext';
import { useLanguage } from '@/components/layout/LanguageContext';
import { QuestionCard } from '@/components/apply/QuestionCard';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

export default function Section4Page() {
  const router = useRouter();
  const { formData, updateSurvey, updateField } = useWizard();
  const { t } = useLanguage();
  const [errors, setErrors] = useState({});

  const narrativeQuestions = [
    { id: 41, title: 'Halal Certification', text: 'Does the organization hold Halal certification for its products/services? If yes, please describe the scope.' },
    { id: 42, title: 'Innovation', text: 'How does the organization foster a culture of innovation to address ESG challenges and develop sustainable solutions?' },
    { id: 43, title: 'Product Stewardship', text: 'Describe the organization\'s efforts to minimize the environmental and social impacts of its products/services throughout their lifecycle (e.g., eco-design, circular economy initiatives).' },
    { id: 44, title: 'Stakeholder Engagement', text: 'How does the organization identify and engage with its key stakeholders (e.g., customers, employees, investors, communities) on ESG matters?' },
    { id: 45, title: 'Sustainable Finance', text: 'Has the organization issued any green bonds, social bonds, or sustainability-linked loans? If yes, please provide details.' },
    { id: 46, title: 'Sustainable Procurement', text: 'Describe the organization\'s approach to integrating ESG criteria into its procurement processes and supplier selection.' },
    { id: 47, title: 'ESG Targets and Metrics', text: 'What are the organization\'s key ESG targets (e.g., Net Zero by 2050, 50% reduction in water use), and how is progress tracked and reported?' },
    { id: 48, title: 'Data Privacy and Security', text: 'How does the organization ensure the privacy and security of customer and employee data?' },
  ];

  const handleNext = () => {
    const newErrors = {};
    let hasError = false;

    // Validate narrative questions
    narrativeQuestions.forEach((q) => {
      if (!formData.survey[q.id] || !formData.survey[q.id].trim()) {
        newErrors[q.id] = 'This field is required';
        hasError = true;
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

  return (
    <div className="max-w-4xl mx-auto animate-slide-up pb-12">
      <div className="flex flex-col items-center justify-center space-y-2 text-center pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B4332]">Section 4: Additional Information</h1>
        <p className="text-sm sm:text-base text-[#42716C]">
          Please answer the following additional questions regarding your organization.
        </p>
      </div>

      <div className="space-y-6">
        {narrativeQuestions.map((q) => (
          <QuestionCard key={q.id} title={q.title}>
            <p className="text-sm font-medium text-gray-800 mb-4">{q.text}</p>
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

      <div className="mt-8">
        <QuestionCard title="Agreements & Confirmation">
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
                  ? 'bg-[#1B4332] border-[#1B4332]'
                  : errors.agreedToTerms
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white group-hover:border-[#1B4332]'
              }`}></div>
              <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-medium text-gray-900 mb-1">I confirm that all information provided is accurate and true.</p>
              <p className="text-gray-500">I agree to the Terms & Conditions and Privacy Policy of the HPDC ESG Certification Platform. I understand that false information may result in the rejection of my application.</p>
              {errors.agreedToTerms && <p className="text-red-500 mt-2">{errors.agreedToTerms}</p>}
            </div>
          </label>
        </QuestionCard>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={() => router.push('/company/apply/section-3')}>
          ← Back
        </Button>
        <Button variant="solid" onClick={handleNext} disabled={!formData.agreedToTerms}>
          Next Section →
        </Button>
      </div>
    </div>
  );
}
