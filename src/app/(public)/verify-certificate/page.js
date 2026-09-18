'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, ShieldCheck, QrCode, ExternalLink, Building2,
  Calendar, FileText, CheckCircle, MapPin, Loader2, AlertCircle, XCircle,
} from 'lucide-react';
import { publicApi } from '@/lib/api';

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if query param is provided
  useEffect(() => {
    const q = searchParams.get('query');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return;

    setLoading(true);
    setError('');
    setHasSearched(true);
    setSelectedCert(null);

    try {
      const res = await publicApi.verifyCertificate(searchTerm.trim());
      if (res.success) {
        setResults(res.data || []);
        // Auto-select first result
        if (res.data && res.data.length > 0) {
          setSelectedCert(res.data[0]);
        }
      } else {
        setError('Search failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'valid' || s === 'active' || s === 'approved') {
      return { text: 'Valid', color: 'bg-[#1B4332] text-white' };
    }
    if (s === 'suspended') {
      return { text: 'Suspended', color: 'bg-amber-500 text-white' };
    }
    if (s === 'expired' || s === 'revoked') {
      return { text: 'Expired', color: 'bg-red-500 text-white' };
    }
    return { text: status || 'Unknown', color: 'bg-gray-500 text-white' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const cert = selectedCert;
  const badge = cert ? getStatusBadge(cert.status) : null;

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={28} className="text-emerald-600" />
          </div>
          <p className="text-[#1B4332] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            Digital Verification
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B4332] mb-3">
            Verify Certificate Authenticity
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Enter the certificate number, company name, company registration number or scan the QR
            code to instantly verify its authenticity and status
          </p>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleVerify}
          className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 mb-8 max-w-2xl mx-auto flex items-center gap-2"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Certificate number, Company name, Company Registration number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 py-3 text-sm text-gray-800 bg-transparent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Verify <Search size={16} />
              </>
            )}
          </button>
          <button
            type="button"
            className="p-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors cursor-pointer"
            title="Scan QR Code"
          >
            <QrCode size={20} />
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 text-[#1B4332] animate-spin" />
            <span className="ml-3 text-sm text-gray-500">Searching certificates...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* No Results */}
        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 mb-6">
            <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No certificate found</h3>
            <p className="text-sm text-gray-500">
              No matching certificate was found. Please check the details and try again.
            </p>
          </div>
        )}

        {/* Result */}
        {cert && !loading && (
          <div className="space-y-6 animate-slide-up">
            {/* Multiple results selector */}
            {results.length > 1 && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-2">
                  {results.length} certificates found. Select one:
                </p>
                <div className="flex flex-wrap gap-2">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedCert(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedCert?.id === r.id
                          ? 'bg-[#1B4332] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {r.id.slice(0, 8)}... — {r.company_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Top Result Card */}
            <div className="bg-[#EAEFEA] rounded-3xl p-8 md:p-10 text-center border border-emerald-100/50 shadow-inner">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100">
                <ShieldCheck size={28} className="text-[#1B4332]" />
              </div>
              <div
                className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm ${badge.color}`}
              >
                {badge.text}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1B4332] mb-2">
                {cert.id.toUpperCase().slice(0, 18)}
              </h2>
              <p className="text-xs text-gray-600 mb-6 font-medium">
                This certificate is officially verified by HPDC.
              </p>
              <button className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm cursor-pointer">
                <ExternalLink size={16} /> View Certificate
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Organization Details */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-[#1B4332] mb-5">Organization Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Building2 size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Company Name
                      </p>
                      <p className="text-xs text-gray-800 font-semibold">
                        {cert.company_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <FileText size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Company Registration Number
                      </p>
                      <p className="text-xs text-gray-800 font-mono">
                        {cert.registration_number || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Address
                      </p>
                      <p className="text-xs text-gray-800">
                        {cert.address || cert.company?.country || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validity Details */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-[#1B4332] mb-5">Validity Details</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Calendar size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Issue Date
                      </p>
                      <p className="text-xs text-gray-800 font-semibold">
                        {formatDate(cert.issued)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        Expiry Date
                      </p>
                      <p className="text-xs text-gray-800 font-semibold">
                        {formatDate(cert.expiry)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Scope */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-[#1B4332] mb-3">Certificate Scope</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {cert.scope || cert.certificate_type || '—'}
                </p>
              </div>

              {/* Accreditation Body */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm bg-gray-50/50">
                <h3 className="text-sm font-bold text-[#1B4332] mb-3">Accreditation Body</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <p className="text-xs text-gray-700 font-medium">
                    Official ESG Tayib Certification Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#1B4332] animate-spin" />
        </div>
      }
    >
      <VerifyCertificateContent />
    </Suspense>
  );
}
