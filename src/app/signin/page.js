'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { authApi } from '@/lib/api';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const dict = {
  ar: {
    title: 'تسجيل الدخول إلى HPDC',
    subtitle: 'قم بالوصول إلى بوابة الشهادات الخاصة بك',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    auth: 'جاري التحقق...',
    signin: 'تسجيل الدخول',
    back: 'رجوع',
    forgot: 'هل نسيت كلمة المرور؟',
    noAccount: 'ليس لديك حساب؟',
    signup: 'إنشاء حساب',
    successMsg: 'تم تسجيل الشركة بنجاح! يرجى تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور.',
    errorFailed: 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.',
    errorInvalid: 'البريد الإلكتروني أو كلمة المرور غير صالحة.'
  },
  en: {
    title: 'Sign in to HPDC',
    subtitle: 'Access your certification portal',
    email: 'Email address',
    password: 'Password',
    auth: 'Authenticating...',
    signin: 'Sign in',
    back: 'Back',
    forgot: 'Forgot password?',
    noAccount: "Don't have an account?",
    signup: 'Sign up',
    successMsg: 'Company registered successfully! Please sign in with your email and password.',
    errorFailed: 'Login failed. Please check your credentials.',
    errorInvalid: 'Invalid email or password.'
  }
};

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, changeLang, mounted } = useLanguage();
  const t = dict[lang] || dict.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccessMsg(t.successMsg);
    }
  }, [searchParams, t.successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success || res.message) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hpdc_pending_email', email);
          sessionStorage.setItem('hpdc_pending_user_id', res.user_id || '');
        }
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(res.error || t.errorFailed);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || t.errorInvalid);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <AuthLayout lang={lang} changeLang={changeLang}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1B4332] tracking-tight">{t.title}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {t.subtitle}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
            {t.email} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email}
              className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] transition-all"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
            {t.password} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              className={`w-full py-3 text-sm bg-white border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] transition-all ${lang === 'ar' ? 'pr-4 pl-10' : 'pl-4 pr-10'}`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 ${lang === 'ar' ? 'left-0 pl-3.5' : 'right-0 pr-3.5'} flex items-center text-gray-400 hover:text-gray-600 focus:outline-none`}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.auth}</span>
              </>
            ) : (
              <span>{t.signin}</span>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full mt-3 py-3 px-4 bg-white border border-[#1B4332] text-[#1B4332] hover:bg-gray-50 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            {t.back}
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-col gap-6">
        <a href="#" className="text-xs text-[#1B4332] underline hover:text-[#2D6A4F] underline-offset-4 decoration-[#1B4332]/40 hover:decoration-[#1B4332]">
          {t.forgot}
        </a>
        
        <div className="w-full text-center">
          <p className="text-sm text-gray-500">
            {t.noAccount}{' '}
            <Link href="/signup" className="text-[#1B4332] font-semibold underline underline-offset-4 decoration-[#1B4332]/40 hover:decoration-[#1B4332]">
              {t.signup}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
