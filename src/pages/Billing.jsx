import React, { useState, useEffect } from 'react';
import { Receipt, CheckCircle2, Clock, Loader2, Send, X, Mail } from 'lucide-react';
import axios from 'axios';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [paymentConfig, setPaymentConfig] = useState({
    invoiceType: 'Proforma Invoice (50% Advance)',
    amountToCollect: 0,
    totalValue: 0
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/api/leads', getAuthConfig());
      if (response.data?.data?.leads) {
        setInvoices(response.data.data.leads.filter(lead => lead.price > 0 && lead.status !== 'Lost'));
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const totalExpected = invoices.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalCollected = invoices.reduce((acc, curr) => acc + (curr.advancePaid || (curr.status === 'Completed' ? curr.price : 0)), 0);
  const totalPending = totalExpected - totalCollected;

  const openSendModal = (lead) => {
    setSelectedLead(lead);
    const balanceDue = (lead.price || 0) - (lead.advancePaid || 0);
    
    let suggestedType = 'Proforma Invoice (50% Advance)';
    let suggestedAmount = lead.price / 2;

    if (lead.advancePaid > 0) {
      suggestedType = 'Tax Invoice (Final Balance)';
      suggestedAmount = balanceDue;
    }

    setPaymentConfig({
      invoiceType: suggestedType,
      amountToCollect: suggestedAmount,
      totalValue: lead.price
    });
    setIsModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (paymentConfig.amountToCollect <= 0) {
      alert("Amount to collect must be greater than 0");
      return;
    }

    try {
      setIsSending(true);
      await axios.post(`/api/leads/${selectedLead._id}/send-invoice`, { 
        invoiceType: paymentConfig.invoiceType.split(' (')[0],
        amountToPay: paymentConfig.amountToCollect,
        totalValue: paymentConfig.totalValue
      }, getAuthConfig());
      
      alert(`✅ Email and Payment link sent to ${selectedLead.name}!`);
      setIsModalOpen(false);
      fetchInvoices();
    } catch (error) {
      alert("❌ Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Billing & Payments</h2>
        <p className="text-slate-500 text-sm mt-1">Send payment links and track advances/dues easily.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0"><Receipt size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Expected</p><h3 className="text-2xl font-bold text-slate-900">₹{totalExpected.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><CheckCircle2 size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Collected</p><h3 className="text-2xl font-bold text-slate-900">₹{totalCollected.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0"><Clock size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Pending</p><h3 className="text-2xl font-bold text-slate-900">₹{totalPending.toLocaleString()}</h3></div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Project Value</th>
                <th className="px-6 py-4">Paid (Advance)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600 mx-auto" /></td></tr>
              ) : invoices.map((inv) => {
                const isPaid = inv.status === 'Completed' || (inv.price - (inv.advancePaid || 0) <= 0);
                return (
                  <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{inv.businessName || inv.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{inv.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{inv.service}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{(inv.price || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{(inv.advancePaid || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg"><CheckCircle2 size={16}/> Fully Paid</span>
                      ) : (
                        <button onClick={() => openSendModal(inv)} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 ml-auto">
                          <Send size={14} /> Send Payment Link
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative p-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Payment Link</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">PAYMENT TYPE / SUBJECT</label>
                <select value={paymentConfig.invoiceType} onChange={e => {
                  const type = e.target.value;
                  let amount = paymentConfig.totalValue;
                  if(type.includes('50%')) amount = paymentConfig.totalValue / 2;
                  if(type.includes('Final')) amount = paymentConfig.totalValue - (selectedLead.advancePaid || 0);
                  setPaymentConfig({...paymentConfig, invoiceType: type, amountToCollect: amount});
                }} className="w-full border border-slate-200 p-3 rounded-xl font-semibold outline-none text-brand-600">
                  <option value="Proforma Invoice (50% Advance)">Request 50% Advance (Package)</option>
                  <option value="Tax Invoice (Final Balance)">Request Final Balance Due</option>
                  <option value="Tax Invoice (100% Full Payment)">Request 100% Full Payment (Add-ons)</option>
                  <option value="Subscription Receipt (Monthly Plan)">Monthly Subscription Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">TOTAL PROJECT VALUE (₹)</label>
                <input type="number" value={paymentConfig.totalValue} onChange={e => setPaymentConfig({...paymentConfig, totalValue: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-slate-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">AMOUNT TO COLLECT NOW (₹)</label>
                <input type="number" value={paymentConfig.amountToCollect} onChange={e => setPaymentConfig({...paymentConfig, amountToCollect: e.target.value})} className="w-full border-2 border-brand-200 bg-brand-50 text-brand-700 font-bold p-3 rounded-xl outline-none" />
                <p className="text-xs text-slate-400 mt-2">*Client ko exactly itne amount ka hi Razorpay link jayega.</p>
              </div>

              <button onClick={handleSendEmail} disabled={isSending} className="w-full mt-4 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                {isSending ? 'Sending Email & Link...' : 'Email Razorpay Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}