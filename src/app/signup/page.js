'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { authApi } from '@/lib/api';
import { AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
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
      setError('Please fill in all fields before proceeding.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await authApi.register({
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
        setError(res.error || 'Failed to create company account');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create company account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-[#1B4332] tracking-tight">Company Information</h2>
            <p className="text-gray-500 text-sm mt-1">
              Access your certification portal
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#1B4332] tracking-tight">Account Setup</h2>
            <p className="text-gray-500 text-sm mt-1">
              Set up your login credentials
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
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Company Name</label>
            <input
              type="text"
              name="company_name"
              required
              value={formData.company_name}
              onChange={handleChange}
              placeholder="interlink"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Registration Number</label>
            <input
              type="text"
              name="registration_number"
              required
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="9859009877"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sector</label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] appearance-none"
            >
              <option value="Finance">Finance</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Oil & Gas">Oil & Gas</option>
              <option value="Logistics">Logistics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Country</label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              placeholder="Saudi Arabia"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Contact Person</label>
            <input
              type="text"
              name="contact_person"
              required
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Ahmed"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone number</label>
            <input
              type="tel"
              name="phone_number"
              required
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="051067800420"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
            >
              Next
            </button>
            <Link
              href="/signin"
              className="w-full py-3 px-4 border border-[#1B4332] hover:bg-gray-50 text-[#1B4332] text-sm font-semibold rounded-lg text-center transition-all"
            >
              Back
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              required
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
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
                  <span>Registering...</span>
                </>
              ) : (
                <span>Sign up</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-3 px-4 border border-[#1B4332] hover:bg-gray-50 text-[#1B4332] text-sm font-semibold rounded-lg transition-all"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
