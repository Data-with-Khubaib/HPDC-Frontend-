'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import { authApi } from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(54);
  const { setAuth } = useAuthStore();

  useEffect(() => {
    let qEmail = searchParams.get('email');
    if (!qEmail && typeof window !== 'undefined') {
      qEmail = sessionStorage.getItem('hpdc_pending_email');
    }
    if (qEmail) {
      setEmail(decodeURIComponent(qEmail));
    }
  }, [searchParams]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // allow pasting
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        if (pastedData[i]) newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      // focus last non-empty
      const lastIndex = pastedData.length - 1;
      if (lastIndex >= 0 && lastIndex < 6) {
        inputRefs.current[lastIndex].focus();
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // move to next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const payload = { email, otp_code: otpString };

      const res = await authApi.verifyOtp(payload);

      if (res.success && res.user) {
        setAuth({
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken
        });
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('hpdc_pending_email');
          sessionStorage.removeItem('hpdc_pending_user_id');
        }
        const role = (res.user.role || '').toUpperCase();
        router.push(role === 'ADMIN' ? '/admin/dashboard' : '/company/dashboard');
      } else {
        setError(res.error || 'Verification failed. Invalid OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setError('');

    try {
      await authApi.resendOtp(email);
      setTimeLeft(60);
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1B4332] tracking-tight mb-2">Verify your email</h2>
        <p className="text-gray-500 text-xs leading-relaxed">
          We sent a 6-digit code to <strong className="text-gray-700">{email || 'your email'}</strong>. Enter it below to verify.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block text-xs font-semibold text-gray-700 mb-3">Verification code</label>
        <div className="flex gap-3 mb-6 justify-center sm:justify-start">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength={1}
              ref={(el) => inputRefs.current[index] = el}
              value={data}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:border-transparent transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full py-3.5 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] disabled:bg-[#1B4332]/60 text-white text-sm font-semibold rounded-lg shadow-sm transition-all mb-4"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        <div className="text-center text-xs space-y-2">
          <p className="text-gray-500 font-medium">
            Code expires in: <strong className="text-[#1B4332]">{formatTime(timeLeft)}</strong>
          </p>
          <p className="text-gray-500">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0}
              className={`font-medium transition-colors ${timeLeft > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1B4332] hover:underline'}`}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
