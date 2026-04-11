import React, { useState, useEffect } from 'react';
import { Receipt, CheckCircle2, Clock, Loader2, Send, X, Mail, Plus, FileText, Download, Wallet } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const SERVICES_LIST = [
  { category: "Web Development Packages", name: "Web Development - Basic", price: 8999, rule: "50% Advance" },
  { category: "Web Development Packages", name: "Web Development - Pro", price: 14999, rule: "50% Advance" },
  { category: "Web Development Packages", name: "Web Development - Premium", price: 24999, rule: "50% Advance" },
  { category: "Monthly Subscriptions", name: "Basic Care (Monthly)", price: 1500, rule: "100% Upfront" },
  { category: "Monthly Subscriptions", name: "Growth Care (Monthly)", price: 3500, rule: "100% Upfront" },
  { category: "Monthly Subscriptions", name: "Pro Care (Monthly)", price: 7500, rule: "100% Upfront" },
  { category: "Add-on Services", name: "Logo Design", price: 599, rule: "100% Upfront" },
  { category: "Add-on Services", name: "UI/UX Design", price: 2499, rule: "100% Upfront" },
  { category: "Add-on Services", name: "SEO Package", price: 4999, rule: "100% Upfront" },
  { category: "Custom", name: "Custom Project / Quote", price: 0, rule: "Custom" }
];

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [offlineAmount, setOfflineAmount] = useState('');

  const [paymentConfig, setPaymentConfig] = useState({ invoiceType: '', amountToCollect: 0, totalValue: 0 });

  const [manualInvoice, setManualInvoice] = useState({
    name: '', email: '', businessName: '', whatsapp: '', service: '', price: '', advancePaid: ''
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

  const handleServiceSelect = (e) => {
    const selectedService = SERVICES_LIST.find(s => s.name === e.target.value);
    if (selectedService) {
      let defaultAdvance = 0;
      if (selectedService.rule === "100% Upfront") defaultAdvance = selectedService.price;
      
      setManualInvoice({
        ...manualInvoice, 
        service: selectedService.name, 
        price: selectedService.price,
        advancePaid: defaultAdvance
      });
    } else {
      setManualInvoice({...manualInvoice, service: e.target.value, price: '', advancePaid: ''});
    }
  };

  const handleCreateManual = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await axios.post('/api/leads', { ...manualInvoice, source: 'manual' }, getAuthConfig());
      alert('✅ Smart Manual Invoice Created!');
      setIsCreateModalOpen(false);
      setManualInvoice({ name: '', email: '', businessName: '', whatsapp: '', service: '', price: '', advancePaid: '' });
      fetchInvoices();
    } catch (error) { alert('❌ Failed to create invoice.'); }
    finally { setIsProcessing(false); }
  };

  const handleLogOfflinePayment = async () => {
    if (!offlineAmount || Number(offlineAmount) <= 0) return alert("Enter valid amount");
    try {
      setIsProcessing(true);
      await axios.patch(`/api/leads/${selectedLead._id}/payment`, { amount: offlineAmount }, getAuthConfig());
      alert('✅ Payment logged successfully!');
      setIsPaymentModalOpen(false);
      setOfflineAmount('');
      fetchInvoices();
    } catch (error) { alert("❌ Failed to log payment."); }
    finally { setIsProcessing(false); }
  };

  const openSendModal = (lead) => {
    setSelectedLead(lead);
    const balanceDue = (lead.price || 0) - (lead.advancePaid || 0);
    let suggestedType = 'Proforma Invoice (50% Advance)';
    let suggestedAmount = lead.price / 2;

    if (lead.advancePaid > 0) {
      suggestedType = 'Tax Invoice (Final Balance)';
      suggestedAmount = balanceDue;
    } else if (lead.service.includes('Logo') || lead.service.includes('Care') || lead.service.includes('SEO')) {
      suggestedType = 'Tax Invoice (100% Full Payment)';
      suggestedAmount = lead.price;
    }

    setPaymentConfig({ invoiceType: suggestedType, amountToCollect: suggestedAmount, totalValue: lead.price });
    setIsSendModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (paymentConfig.amountToCollect <= 0) return alert("Amount must be greater than 0");
    try {
      setIsProcessing(true);
      await axios.post(`/api/leads/${selectedLead._id}/send-invoice`, { 
        invoiceType: paymentConfig.invoiceType.split(' (')[0], 
        amountToPay: paymentConfig.amountToCollect,
        totalValue: paymentConfig.totalValue
      }, getAuthConfig());
      alert(`✅ Sent to ${selectedLead.name}!`);
      setIsSendModalOpen(false);
      fetchInvoices();
    } catch (error) { alert("❌ Failed to send email."); }
    finally { setIsProcessing(false); }
  };

  const generatePDF = (lead) => { window.open(`/invoice/${lead._id}`, '_blank'); };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Payments</h2>
          <p className="text-slate-500 text-sm">Download copies, send payment links, and track collections.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-brand-600 transition-all shadow-sm">
          <Plus size={18} /> Smart Manual Invoice
        </button>
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

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Project Value</th>
              <th className="px-6 py-4">Received</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
                <tr><td colSpan="4" className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-brand-600" /></td></tr>
            ) : invoices.map((inv) => {
              const isPaid = inv.status === 'Completed' || (inv.price - (inv.advancePaid || 0) <= 0);
              return (
                <tr key={inv._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{inv.name}</p>
                    <p className="text-slate-500 text-xs">{inv.service}</p>
                  </td>
                  <td className="px-6 py-4 font-bold">₹{inv.price.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600 flex items-center gap-2">
                    ₹{(inv.advancePaid || 0).toLocaleString()}
                    {!isPaid && (
                      <button onClick={() => { setSelectedLead(inv); setIsPaymentModalOpen(true); }} className="text-slate-400 hover:text-brand-600 bg-slate-100 p-1.5 rounded" title="Log Offline/Missing Payment">
                        <Wallet size={14}/>
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <button onClick={() => generatePDF(inv)} className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors" title="View/Download Invoice">
                        <FileText size={16} />
                      </button>
                      
                      {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"><CheckCircle2 size={14}/> Paid</span>
                      ) : (
                          <button onClick={() => openSendModal(inv)} className="px-3 py-1.5 text-white bg-slate-900 rounded-lg text-xs font-bold hover:bg-brand-600 flex items-center gap-1">
                            <Send size={14}/> Send Link
                          </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative p-8 my-8">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Smart Manual Invoice</h2>
            
            <form onSubmit={handleCreateManual} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CLIENT NAME *</label>
                  <input required type="text" value={manualInvoice.name} onChange={e => setManualInvoice({...manualInvoice, name: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL ADDRESS *</label>
                  <input required type="email" value={manualInvoice.email} onChange={e => setManualInvoice({...manualInvoice, email: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SELECT PLAN / SERVICE *</label>
                <select required value={manualInvoice.service} onChange={handleServiceSelect} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold text-slate-800 bg-slate-50">
                  <option value="" disabled>-- Select a service --</option>
                  {[...new Set(SERVICES_LIST.map(s => s.category))].map(category => (
                    <optgroup key={category} label={category}>
                      {SERVICES_LIST.filter(s => s.category === category).map(s => (
                        <option key={s.name} value={s.name}>{s.name} - ₹{s.price} ({s.rule})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">TOTAL PROJECT PRICE (₹) *</label>
                  <input required type="number" value={manualInvoice.price} onChange={e => setManualInvoice({...manualInvoice, price: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none font-bold text-brand-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">AMOUNT ALREADY RECEIVED (₹)</label>
                  <input type="number" value={manualInvoice.advancePaid} onChange={e => setManualInvoice({...manualInvoice, advancePaid: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none font-bold text-emerald-600 bg-emerald-50" placeholder="0 if unpaid" />
                  <p className="text-[10px] text-slate-400 mt-1">Leave 0 if sending link for first time.</p>
                </div>
              </div>
              
              <button type="submit" disabled={isProcessing} className="w-full mt-4 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Create Invoice & Sync
              </button>
            </form>
          </div>
        </div>
      )}

      {isPaymentModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 relative">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 rounded-full p-2"><X size={20}/></button>
            <h2 className="text-xl font-bold mb-2">Update Received Amount</h2>
            <p className="text-xs text-slate-500 mb-6">Use this to fix old test records or log cash payments.</p>
            
            <label className="block text-xs font-bold text-slate-500 mb-1">ADD RECEIVED AMOUNT (₹)</label>
            <input type="number" value={offlineAmount} onChange={e => setOfflineAmount(e.target.value)} className="w-full border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold p-3 rounded-xl outline-none mb-4" placeholder="e.g. 4499" />
            
            <button onClick={handleLogOfflinePayment} disabled={isProcessing} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700">
              {isProcessing ? <Loader2 className="animate-spin" size={18}/> : "Save Payment"}
            </button>
          </div>
        </div>
      )}

      {isSendModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
            <button onClick={() => setIsSendModalOpen(false)} className="absolute top-6 right-6 text-slate-400"><X size={20}/></button>
            <h2 className="text-2xl font-bold mb-6">Invoice Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500">INVOICE TYPE</label>
                <select value={paymentConfig.invoiceType} onChange={e => {
                  const type = e.target.value;
                  let amount = paymentConfig.totalValue;
                  if(type.includes('50%')) amount = paymentConfig.totalValue / 2;
                  if(type.includes('Final')) amount = paymentConfig.totalValue - (selectedLead.advancePaid || 0);
                  setPaymentConfig({...paymentConfig, invoiceType: type, amountToCollect: amount});
                }} className="w-full border p-3 rounded-xl font-bold text-brand-600 outline-none mt-1">
                  <option value="Proforma Invoice (50% Advance)">50% Advance (Package)</option>
                  <option value="Tax Invoice (Final Balance)">Final Balance Due</option>
                  <option value="Tax Invoice (100% Full Payment)">100% Full Payment</option>
                  <option value="Subscription Receipt (Monthly Plan)">Monthly Subscription</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">AMOUNT TO COLLECT NOW (₹)</label>
                <input type="number" value={paymentConfig.amountToCollect} onChange={e => setPaymentConfig({...paymentConfig, amountToCollect: e.target.value})} className="w-full border-2 border-brand-200 bg-brand-50 text-brand-700 font-bold p-3 rounded-xl outline-none" />
              </div>

              <button onClick={handleSendEmail} disabled={isProcessing} className="w-full mt-4 bg-brand-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700">
                {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <Mail size={18}/>} Email Razorpay Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}