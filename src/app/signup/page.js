'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { authApi } from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const dict = {
  ar: {
    step1Title: 'معلومات الشركة',
    step1Sub: 'قم بالوصول إلى بوابة الشهادات الخاصة بك',
    step2Title: 'إعداد الحساب',
    step2Sub: 'إعداد بيانات تسجيل الدخول الخاصة بك',
    companyName: 'اسم الشركة',
    regNum: 'رقم التسجيل',
    sector: 'القطاع',
    finance: 'المالية',
    manufacturing: 'التصنيع',
    oilgas: 'النفط والغاز',
    logistics: 'الخدمات اللوجستية',
    other: 'أخرى',
    country: 'البلد',
    contactPerson: 'مسؤول التواصل',
    phone: 'رقم الهاتف',
    next: 'التالي',
    back: 'رجوع',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    signup: 'إنشاء حساب',
    registering: 'جاري التسجيل...',
    errorFields: 'يرجى ملء جميع الحقول قبل المتابعة.',
    errorPassword: 'كلمات المرور غير متطابقة',
    errorFailed: 'فشل في إنشاء حساب الشركة'
  },
  en: {
    step1Title: 'Company Information',
    step1Sub: 'Access your certification portal',
    step2Title: 'Account Setup',
    step2Sub: 'Set up your login credentials',
    companyName: 'Company Name',
    regNum: 'Registration Number',
    sector: 'Sector',
    finance: 'Finance',
    manufacturing: 'Manufacturing',
    oilgas: 'Oil & Gas',
    logistics: 'Logistics',
    other: 'Other',
    country: 'Country',
    contactPerson: 'Contact Person',
    phone: 'Phone number',
    next: 'Next',
    back: 'Back',
    email: 'Email address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signup: 'Sign up',
    registering: 'Registering...',
    errorFields: 'Please fill in all fields before proceeding.',
    errorPassword: 'Passwords do not match',
    errorFailed: 'Failed to create company account'
  }
};

export default function SignUpPage() {
  const router = useRouter();
  const { lang, changeLang, mounted } = useLanguage();
  const t = dict[lang] || dict.en;

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company_name: '',
    registration_number: '',
    sector: 'Finance',
    country: 'Saudi Arabia',
    contact_person: '',
    phone_number: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    // Basic validation for Step 1
    if (!formData.company_name || !formData.registration_number || !formData.contact_person || !formData.phone_number) {
      setError(t.errorFields);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError(t.errorPassword);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await authApi.register({
        name: formData.company_name,
        email: formData.email,
        password: formData.password,
        company_name: formData.company_name,
        registration_number: formData.registration_number,
        sector: formData.sector,
        country: formData.country,
        phone_number: formData.phone_number,
        contact_person: formData.contact_person
      });

      if (res.success || res.message) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hpdc_pending_email', formData.email);
          sessionStorage.setItem('hpdc_pending_user_id', res.data?.id || '');
        }
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(res.error || t.errorFailed);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || t.errorFailed);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <AuthLayout lang={lang} changeLang={changeLang}>
      <div className="mb-6">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-[#1B4332] tracking-tight">{t.step1Title}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {t.step1Sub}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#1B4332] tracking-tight">{t.step2Title}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {t.step2Sub}
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.companyName} <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              placeholder={t.companyName}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.regNum} <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="registration_number"
              required
              value={formData.registration_number}
              onChange={handleChange}
              placeholder={t.regNum}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.sector} <span className="text-red-500">*</span></label>
            <select
              name="sector"
              required
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              <option value="Finance">{t.finance}</option>
              <option value="Manufacturing">{t.manufacturing}</option>
              <option value="Oil & Gas">{t.oilgas}</option>
              <option value="Logistics">{t.logistics}</option>
              <option value="Other">{t.other}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.country} <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              placeholder={t.country}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.contactPerson} <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="contact_person"
              required
              value={formData.contact_person}
              onChange={handleChange}
              placeholder={t.contactPerson}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.phone} <span className="text-red-500">*</span></label>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#1B4332] focus-within:border-[#1B4332] bg-white" dir="ltr">
              <div className="flex items-center justify-center px-3 border-r border-gray-200 bg-gray-50/50">
                <span className="text-lg">🇵🇰</span>
                <span className="text-xs text-gray-500 ml-1">▼</span>
              </div>
              <input
                type="tel"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+92"
                className="w-full px-4 py-3 text-sm bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              {t.next}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 px-4 bg-white border border-[#1B4332] text-[#1B4332] hover:bg-gray-50 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {t.back}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.email} <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={t.email}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.password} <span className="text-red-500">*</span></label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder={t.password}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">{t.confirmPassword} <span className="text-red-500">*</span></label>
            <input
              type="password"
              name="confirm_password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder={t.confirmPassword}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332]"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.registering}</span>
                </>
              ) : (
                <span>{t.signup}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-3 px-4 bg-white border border-[#1B4332] hover:bg-gray-50 text-[#1B4332] text-sm font-semibold rounded-lg transition-all flex items-center justify-center"
            >
              {t.back}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
