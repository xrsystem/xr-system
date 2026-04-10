import React from 'react';
import { CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>

        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-white shadow-sm">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Thank you! We have securely received your payment. A detailed receipt has been sent to your email. Our team will contact you shortly for the next steps.
        </p>

        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 mb-8 bg-slate-50 py-2 rounded-lg">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Secure Transaction Verified by XR System</span>
        </div>

        <a 
          href="/" 
          className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-base hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Return to Homepage <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}