'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { authApi } from '@/lib/api';
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccessMsg('Company registered successfully! Please sign in with your email and password.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success || res.message) {
        // Save email temporarily for OTP verification screen
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('hpdc_pending_email', email);
          sessionStorage.setItem('hpdc_pending_user_id', res.user_id || '');
        }
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(res.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to HPDC</h2>
        <p className="text-gray-500 text-sm mt-1">
          Access your certification portal
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
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-col items-start gap-4">
        <a href="#" className="text-xs text-gray-500 font-medium hover:underline underline-offset-4">
          Forgot password?
        </a>
        
        <div className="w-full text-center mt-2">
          <p className="text-xs text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" className="text-gray-700 font-medium hover:underline underline-offset-4">
              Sign up
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
