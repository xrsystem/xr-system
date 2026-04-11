import React, { useState, useEffect } from 'react';
import { Receipt, CheckCircle2, Clock, Loader2, Send, X, Mail, Plus, FileText, Download } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null);

  const [paymentConfig, setPaymentConfig] = useState({
    invoiceType: 'Proforma Invoice (50% Advance)',
    amountToCollect: 0,
    totalValue: 0
  });

  const [manualInvoice, setManualInvoice] = useState({
    name: '', email: '', businessName: '', whatsapp: '', service: '', price: ''
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

  const generatePDF = (lead, customConfig = null) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    const type = customConfig ? customConfig.invoiceType.split(' (')[0] : (lead.advancePaid > 0 ? "Tax Invoice" : "Proforma Invoice");
    const amountToDisplay = customConfig ? customConfig.amountToCollect : (lead.status === 'Completed' ? lead.price : lead.price - (lead.advancePaid || 0));
    const totalVal = customConfig ? customConfig.totalValue : lead.price;

    const primary = [15, 23, 42];
    const accent = [79, 70, 229];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(...primary);
    doc.text("XR", 20, 26);
    doc.setTextColor(...accent);
    doc.text("System", 34, 26);
    doc.setFontSize(16);
    doc.text(type.toUpperCase(), pageWidth - 20, 26, { align: 'right' });
    doc.line(20, 35, pageWidth - 20, 35);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("FROM:", 20, 45);
    doc.text("BILL TO:", 85, 45);

    doc.setTextColor(...primary);
    doc.setFontSize(10);
    doc.text("XR System", 20, 51);
    doc.text(lead.businessName || lead.name, 85, 51);
    
    doc.setFontSize(9);
    doc.text("Ranchi, Jharkhand, India\nGSTIN: 20XXXXX1234X1ZX", 20, 56);
    doc.text(`${lead.email}\n+91 ${lead.whatsapp || 'N/A'}`, 85, 56);

    autoTable(doc, {
      startY: 75,
      head: [['DESCRIPTION', 'QTY', 'RATE (INR)', 'TOTAL (INR)']],
      body: [[lead.service, '1', Number(totalVal).toFixed(2), Number(totalVal).toFixed(2)]],
      theme: 'grid',
      headStyles: { fillColor: primary }
    });

    let finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Value: INR ${Number(totalVal).toLocaleString()}`, pageWidth - 20, finalY, { align: 'right' });
    if (lead.advancePaid > 0) {
        finalY += 6;
        doc.text(`Advance Paid: - INR ${Number(lead.advancePaid).toLocaleString()}`, pageWidth - 20, finalY, { align: 'right' });
    }
    finalY += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Balance Due: INR ${Number(amountToDisplay).toLocaleString()}`, pageWidth - 20, finalY, { align: 'right' });

    doc.setFontSize(8);
    doc.text("PAYMENT DETAILS", 20, finalY + 15);
    doc.setFont("helvetica", "normal");
    doc.text("HDFC Bank | A/C Name: XR System\nIFSC: HDFC0001234 | UPI: xrsystem@okaxis", 20, finalY + 20);

    doc.save(`XR_${type}_${lead.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleCreateManual = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      const res = await axios.post('/api/leads', { ...manualInvoice, source: 'manual' }, getAuthConfig());
      alert('✅ Manual Invoice Created!');
      setIsCreateModalOpen(false);
      
      if(window.confirm("Do you want to download the PDF for this manual record?")) {
          generatePDF(res.data.data.lead);
      }
      setManualInvoice({ name: '', email: '', businessName: '', whatsapp: '', service: '', price: '' });
      fetchInvoices();
    } catch (error) { alert('❌ Failed to create invoice.'); }
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Payments</h2>
          <p className="text-slate-500 text-sm">Download copies or send payment links to clients.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-brand-600 transition-all shadow-sm">
          <Plus size={18} /> Create Manual Invoice
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
                <tr><td colSpan="4" className="py-10 text-center text-slate-400"><Loader2 className="animate-spin mx-auto text-brand-600" /></td></tr>
            ) : invoices.map((inv) => {
              const isPaid = inv.status === 'Completed' || (inv.price - (inv.advancePaid || 0) <= 0);
              return (
                <tr key={inv._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{inv.name}</p>
                    <p className="text-slate-500 text-xs">{inv.service}</p>
                  </td>
                  <td className="px-6 py-4 font-bold">₹{inv.price.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₹{(inv.advancePaid || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 flex justify-end gap-2 items-center">
                    
                    <button onClick={() => generatePDF(inv)} className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Download PDF Locally">
                      <Download size={16} />
                    </button>
                    
                    <button onClick={() => window.open(`/invoice/${inv._id}`, '_blank')} className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors" title="View Web Invoice">
                      <FileText size={16} />
                    </button>
                    
                    {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 ml-2"><CheckCircle2 size={14}/> Paid</span>
                    ) : (
                        <button onClick={() => openSendModal(inv)} className="px-3 py-1.5 text-white bg-slate-900 rounded-lg text-xs font-bold hover:bg-brand-600 flex items-center gap-1 ml-2 transition-colors">
                          <Send size={14}/> Send Link
                        </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative p-8 my-8">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Manual Invoice</h2>
            
            <form onSubmit={handleCreateManual} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">CLIENT NAME *</label>
                  <input required type="text" value={manualInvoice.name} onChange={e => setManualInvoice({...manualInvoice, name: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">BUSINESS NAME</label>
                  <input type="text" value={manualInvoice.businessName} onChange={e => setManualInvoice({...manualInvoice, businessName: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL ADDRESS *</label>
                  <input required type="email" value={manualInvoice.email} onChange={e => setManualInvoice({...manualInvoice, email: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">WHATSAPP NO.</label>
                  <input type="text" value={manualInvoice.whatsapp} onChange={e => setManualInvoice({...manualInvoice, whatsapp: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">SERVICE / PRODUCT DESCRIPTION *</label>
                <input required type="text" value={manualInvoice.service} onChange={e => setManualInvoice({...manualInvoice, service: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none text-sm" placeholder="e.g. Website Maintenance (Jan 2026)" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">TOTAL PROJECT PRICE (₹) *</label>
                <input required type="number" value={manualInvoice.price} onChange={e => setManualInvoice({...manualInvoice, price: e.target.value})} className="w-full border border-slate-200 p-3 rounded-xl outline-none font-bold text-brand-600" />
              </div>
              
              <button type="submit" disabled={isProcessing} className="w-full mt-4 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Generate Invoice Record
              </button>
            </form>
          </div>
        </div>
      )}

      {isSendModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
            <button onClick={() => setIsSendModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 rounded-full p-2"><X size={20}/></button>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Invoice Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500">INVOICE TYPE</label>
                <select value={paymentConfig.invoiceType} onChange={e => {
                  const type = e.target.value;
                  let amount = paymentConfig.totalValue;
                  if(type.includes('50%')) amount = paymentConfig.totalValue / 2;
                  if(type.includes('Final')) amount = paymentConfig.totalValue - (selectedLead.advancePaid || 0);
                  setPaymentConfig({...paymentConfig, invoiceType: type, amountToCollect: amount});
                }} className="w-full border border-slate-200 p-3 rounded-xl font-bold text-brand-600 outline-none mt-1">
                  <option value="Proforma Invoice (50% Advance)">50% Advance (Package)</option>
                  <option value="Tax Invoice (Final Balance)">Final Balance Due</option>
                  <option value="Tax Invoice (100% Full Payment)">100% Full Payment</option>
                  <option value="Subscription Receipt (Monthly Plan)">Monthly Subscription</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">TOTAL PROJECT VALUE (₹)</label>
                <input type="number" disabled value={paymentConfig.totalValue} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-slate-500" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">AMOUNT TO COLLECT NOW (₹)</label>
                <input type="number" value={paymentConfig.amountToCollect} onChange={e => setPaymentConfig({...paymentConfig, amountToCollect: e.target.value})} className="w-full border-2 border-brand-200 bg-brand-50 text-brand-700 font-bold p-3 rounded-xl outline-none" />
              </div>

              <div className="flex gap-3 mt-6 pt-2">
                <button onClick={handleSendEmail} disabled={isProcessing} className="flex-1 bg-brand-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors">
                  {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <Mail size={18}/>} Send Email
                </button>
                <button onClick={() => generatePDF(selectedLead, paymentConfig)} className="px-5 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors" title="Download This PDF">
                  <Download size={18}/> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}