'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Loader2 } from 'lucide-react';
import { certificateApi } from '@/lib/api';

export default function CertificateViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCertificateHtml() {
      try {
        const html = await certificateApi.getHtml(id);
        setHtmlContent(html);
      } catch (err) {
        console.error(err);
        setError('Could not load the certificate.');
      } finally {
        setLoading(false);
      }
    }
    fetchCertificateHtml();
  }, [id]);

  const handlePrint = () => {
    // Print the iframe contents if possible, or just print current window
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#1B4332] animate-spin" />
        <span className="ml-3 text-gray-500">Generating certificate...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.back()} className="text-[#1B4332] underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Certificates
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Printer size={16} />
          Print Certificate
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex justify-center p-8 print:shadow-none print:border-none print:p-0">
        {/* We use an iframe with srcDoc to isolate the certificate's CSS from the Next.js app styles */}
        <iframe 
          title="Certificate"
          srcDoc={htmlContent}
          style={{ width: '210mm', height: '297mm', border: 'none', background: 'white' }}
          className="shadow-md print:shadow-none"
        />
      </div>
      
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          iframe {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}} />
    </div>
  );
}
