import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Download, CheckCircle2, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

export default function Invoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/api/leads/${id}`);
        setInvoice(res.data.data.lead);
      } catch (err) { setError(true); }
      finally { setLoading(false); }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-brand-600 w-10 h-10" /></div>;
  if (error || !invoice) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold text-xl"><AlertCircle className="mr-2 text-rose-500"/> Invoice not found.</div>;

  // 🧮 SMART LOGIC: Advance aur Due calculate karna
  const totalAmount = invoice.price || 0;
  const advancePaid = invoice.advancePaid || 0; 
  const balanceDue = totalAmount - advancePaid;
  
  let statusLabel = "UNPAID";
  let statusColor = "text-rose-600 bg-rose-50 border-rose-200";

  if (invoice.status === 'Completed' || balanceDue <= 0) {
    statusLabel = "PAID";
    statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
  } else if (advancePaid > 0) {
    statusLabel = "PARTIALLY PAID (ADVANCE RECEIVED)";
    statusColor = "text-amber-600 bg-amber-50 border-amber-200";
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 font-sans">
      <SEO title={`Invoice - ${invoice.businessName || invoice.name}`} />
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">XR <span className="text-brand-600">System</span></h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-1">Official Receipt</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm border shadow-sm ${statusColor}`}>
            {statusLabel === "PAID" ? <CheckCircle2 size={18} /> : <Clock size={18} />}
            {statusLabel}
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
          
          {/* Background Watermark */}
          {statusLabel === "PAID" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
              <ShieldCheck size={400} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pb-10 border-b border-slate-100 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</p>
              <h3 className="text-xl font-bold text-slate-900">{invoice.businessName || invoice.name}</h3>
              <p className="text-slate-500 text-sm mt-1">{invoice.email}</p>
              <p className="text-slate-500 text-sm mt-0.5">WhatsApp: +91 {invoice.whatsapp}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Invoice Details</p>
              <p className="text-slate-900 font-bold text-sm">Invoice No: <span className="text-slate-500 font-medium">#XR-{invoice._id.slice(-6).toUpperCase()}</span></p>
              <p className="text-slate-900 font-bold text-sm mt-1">Date: <span className="text-slate-500 font-medium">{new Date(invoice.createdAt).toLocaleDateString('en-IN')}</span></p>
            </div>
          </div>

          <div className="py-10 relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Service Description</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <span className="font-bold text-slate-800 text-lg leading-tight">{invoice.service}</span>
              <span className="font-black text-slate-900 text-xl shrink-0">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-6 flex flex-col items-end space-y-3 relative z-10">
            <div className="w-full sm:w-1/2 flex justify-between text-slate-500 font-bold text-sm px-2">
              <span>Total Project Value</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            
            {/* Agar client ne advance diya hai, toh usko minus karke dikhao */}
            {advancePaid > 0 && (
              <div className="w-full sm:w-1/2 flex justify-between text-emerald-600 font-bold text-sm px-2">
                <span>Advance Paid Received</span>
                <span>- ₹{advancePaid.toLocaleString()}</span>
              </div>
            )}
            
            <div className="w-full sm:w-1/2 flex justify-between items-center pt-5 mt-2 border-t-2 border-slate-100 px-2">
              <span className="text-slate-900 font-black text-lg">Balance Due</span>
              <span className={`font-black text-2xl ${balanceDue > 0 ? 'text-brand-600' : 'text-emerald-600'}`}>
                ₹{Math.max(0, balanceDue).toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Buttons Section */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-end">
          <button onClick={() => window.print()} className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Download size={20} /> Download PDF
          </button>
          
          {/* Jab tak paisa baaki hai aur link hai, Pay Now dikhao */}
          {balanceDue > 0 && invoice.razorpayPaymentId && (
            <a href={invoice.razorpayPaymentId} target="_blank" rel="noreferrer" className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
              Pay Due Amount (₹{balanceDue.toLocaleString()})
            </a>
          )}
        </div>

      </div>
    </div>
  );
}