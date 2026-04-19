import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Download, CheckCircle2, Clock, AlertCircle, ShieldCheck, CreditCard } from 'lucide-react';
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

  const totalAmount = invoice.finalTotal || invoice.price || 0;
  const advancePaid = invoice.advancePaid || 0; 
  const balanceDue = totalAmount - advancePaid;
  
  let statusLabel = "UNPAID";
  let statusColor = "text-rose-600 bg-rose-50 border-rose-200";

  if (invoice.status === 'Completed' || balanceDue <= 0) {
    statusLabel = "PAID IN FULL";
    statusColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
  } else if (advancePaid > 0) {
    statusLabel = "PARTIALLY PAID";
    statusColor = "text-amber-600 bg-amber-50 border-amber-200";
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 font-sans">
      <SEO title={`Invoice - ${invoice.businessName || invoice.name}`} />
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 p-8 sm:p-10 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-brand-500">XR SYSTEM</h1>
              <p className="text-slate-400 text-sm mt-1">Digital Solutions & Growth Agency</p>
              <p className="text-slate-500 text-xs mt-1">Lower Burdwan Compound, Lalpur, Ranchi - 834001</p>
            </div>
            <div className="sm:text-right">
              <h2 className="text-2xl font-black uppercase tracking-widest text-slate-300">INVOICE</h2>
              <p className="text-slate-400 mt-1 font-mono">#XR-{invoice._id.slice(-6).toUpperCase()}</p>
              <p className="text-slate-400 text-sm mt-1">Date: {new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-10 border-b border-slate-100 relative">
            {statusLabel === "PAID IN FULL" && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <ShieldCheck size={300} />
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</p>
              <h3 className="text-xl font-bold text-slate-900">{invoice.businessName || invoice.name}</h3>
              <p className="text-slate-600 text-sm mt-1">{invoice.email}</p>
              <p className="text-slate-600 text-sm mt-0.5">+91 {invoice.whatsapp}</p>
            </div>
            <div className="sm:text-right">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Status</p>
               <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border ${statusColor}`}>
                 {statusLabel === "PAID IN FULL" ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                 {statusLabel}
               </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <table className="w-full text-left">
              <thead className="border-b-2 border-slate-100">
                <tr>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.invoiceItems && invoice.invoiceItems.length > 0 ? (
                  invoice.invoiceItems.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-4">
                        <p className="font-bold text-slate-800">{item.itemName}</p>
                        <p className="text-xs text-brand-600 font-bold uppercase mt-0.5">{item.itemType}</p>
                      </td>
                      <td className="py-4 text-right font-bold text-slate-700">₹{item.price.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-4 font-bold text-slate-800">{invoice.service || "Web Services"}</td>
                    <td className="py-4 text-right font-bold text-slate-700">₹{totalAmount.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Terms & Conditions</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {invoice.termsAndConditions || "50% advance payment is required to initiate the project. The remaining balance is due upon project completion prior to final handover. Maintenance plans are billed automatically on a recurring monthly basis."}
              </p>
              <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs">
                <ShieldCheck size={14} /> Secured & Verified by XR System
              </div>
            </div>

            <div className="space-y-3">
              {(invoice.invoiceItems?.length > 0 || invoice.discountAmount > 0) && (
                <div className="flex justify-between text-slate-500 font-bold text-sm px-2">
                  <span>Subtotal</span>
                  <span>₹{invoice.subTotal?.toLocaleString()}</span>
                </div>
              )}
              
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold text-sm px-2">
                  <span>Discount Applied</span>
                  <span>- ₹{invoice.discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-800 font-black text-lg px-2 pt-2 border-t border-slate-200">
                <span>Total Project Value</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              
              {advancePaid > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold text-sm px-2 pt-2">
                  <span>Advance Received</span>
                  <span>- ₹{advancePaid.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-slate-200 px-2 bg-white rounded-xl p-4 shadow-sm">
                <span className="text-slate-900 font-black text-lg">Balance Due</span>
                <span className={`font-black text-2xl ${balanceDue > 0 ? 'text-brand-600' : 'text-emerald-600'}`}>
                  ₹{Math.max(0, balanceDue).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-end">
          <button onClick={() => window.print()} className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Download size={20} /> Download PDF
          </button>
          
          {balanceDue > 0 && invoice.razorpayPaymentId && (
            <a href={invoice.razorpayPaymentId} target="_blank" rel="noreferrer" className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
              <CreditCard size={20} /> Pay Due Amount (₹{balanceDue.toLocaleString()})
            </a>
          )}
        </div>

      </div>
    </div>
  );
}