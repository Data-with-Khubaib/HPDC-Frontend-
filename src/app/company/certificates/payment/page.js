'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applicationApi, certManagementApi, certificateApi } from '@/lib/api';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId');

  const [application, setApplication] = useState(null);
  const [certType, setCertType] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payment simulation states
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    async function fetchData() {
      if (!appId) {
        setLoading(false);
        return;
      }
      try {
        const appRes = await applicationApi.getById(appId);
        if (appRes.success && appRes.data) {
          setApplication(appRes.data);
          
          // Fetch cert types to match the fee
          const certRes = await certManagementApi.getActiveTypes();
          if (certRes.success && certRes.data) {
            const found = certRes.data.find(
              (t) => t.certificate_type === appRes.data.certificate_type
            );
            if (found) setCertType(found);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [appId]);

  useEffect(() => {
    let timer;
    if (paymentSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (paymentSuccess && countdown === 0) {
      // Redirect to the certificate view (use certificate ID if available, else go to application to see view cert button)
      // We will redirect to the certificates list or a specific view page if we had the cert ID
      router.push('/company/certificates');
    }
    return () => clearTimeout(timer);
  }, [paymentSuccess, countdown, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#1B4332] animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Loading billing details...</span>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-20 text-gray-500">
        Application not found.
      </div>
    );
  }

  const certFee = certType ? parseFloat(certType.certificate_fee) : 0;
  const vatAmount = Math.round(certFee * 0.15 * 100) / 100;
  const totalDue = certFee + vatAmount;

  const formatCurrency = (amount) => {
    return `SAR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePayment = async () => {
    try {
      setPaying(true);
      const res = await certificateApi.payByApp(appId);
      if (res.success) {
        setPaymentSuccess(true);
      } else {
        alert(res.error || 'Payment failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error during payment processing.');
    } finally {
      setPaying(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-20 animate-slide-up">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#1B4332]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B4332] mb-3">Payment Successful!</h1>
          <p className="text-sm text-gray-500 mb-8 px-4">
            Your payment is confirmed and your certificate is being generated.
          </p>

          <div className="w-full bg-[#F2F8F5] border border-emerald-100 rounded-xl p-6 mb-8 relative overflow-hidden">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Application Number</p>
            <p className="text-xl font-bold text-[#1B4332]">{application.application_no}</p>
          </div>

          {/* Progress bar container */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden relative">
            <div 
              className="bg-[#1B4332] h-1.5 rounded-full absolute top-0 left-0 transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mb-8">
            Redirecting to certificate view in {countdown} seconds...
          </p>

          <button
            onClick={() => router.push('/company/certificates')}
            className="w-full py-3.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            Go to Certificate View Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1B4332]">Secure Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">
          Certification Fee for Application ID: {application.application_no}
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#1B4332]">Hello</h2>
            <p className="text-xs text-gray-400 mt-0.5">Registration ID: {application.application_no}</p>
          </div>
          <span className="bg-[#B7791F] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Pending Payment
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Certification Type
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {application.certificate_type || '—'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Submission Date
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Amount Due
            </p>
            <p className="text-sm font-bold text-[#1B4332] mt-1">{formatCurrency(totalDue)}</p>
          </div>
        </div>
      </div>

      {/* Billing Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <h3 className="text-sm font-bold text-[#1B4332]">Billing Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-100 px-6 py-3">
          <div className="col-span-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Description
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Amount
            </span>
          </div>
        </div>

        {/* Certificate Generation Fee */}
        <div className="grid grid-cols-4 border-b border-gray-100 px-6 py-4">
          <div className="col-span-3">
            <p className="text-sm font-semibold text-gray-900">Certificate Generation Fee</p>
            <p className="text-xs text-gray-500 mt-1">
              Certificate generation fee payable after application approval.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(certFee)}</p>
          </div>
        </div>

        {/* VAT */}
        <div className="grid grid-cols-4 border-b border-gray-100 px-6 py-4">
          <div className="col-span-3">
            <p className="text-sm font-semibold text-gray-900">VAT (15%)</p>
            <p className="text-xs text-gray-500 mt-1">15% Value Added Tax.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(vatAmount)}</p>
          </div>
        </div>

        {/* Total */}
        <div className="grid grid-cols-4 bg-[#F2F8F5] px-6 py-5">
          <div className="col-span-3">
            <p className="text-base font-bold text-[#1B4332]">Total Amount Due</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#1B4332]">{formatCurrency(totalDue)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => router.back()}
          disabled={paying}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={paying}
          className="px-8 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {paying ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Proceed to Payment
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CertificatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#1B4332] animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Loading...</span>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
