import React, { useState, useEffect } from 'react';
import { Receipt, Search, Download, CheckCircle2, Clock, Loader2, Plus, X, FileText, Mail, Trash2, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    leadId: '', clientName: '', email: '', businessName: '', address: '', 
    clientGst: '', poNumber: '', 
    items: [{ id: Date.now(), description: '', hsn: '998314', qty: 1, rate: 0 }],
    discount: 0,
    taxRate: 18, isFullyPaid: false, advancePaid: 0, isManual: false,
    invoiceType: 'Proforma Invoice',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    notes: "Thank you for choosing XR System."
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('/api/leads', getAuthConfig());
        if (response.data?.data?.leads) {
          const billableLeads = response.data.data.leads.filter(lead => lead.price > 0 && lead.status !== 'Lost');
          setInvoices(billableLeads);
        }
      } catch (error) {
        console.error("Failed to fetch billing data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.businessName && inv.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalExpected = invoices.reduce((acc, curr) => acc + curr.price, 0);
  const totalCollected = invoices.filter(inv => inv.status === 'Completed').reduce((acc, curr) => acc + curr.price, 0);
  const totalPending = totalExpected - totalCollected;

  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { id: Date.now(), description: '', hsn: '998314', qty: 1, rate: 0 }]
    });
  };

  const handleRemoveItem = (id) => {
    if (invoiceData.items.length === 1) return;
    setInvoiceData({ ...invoiceData, items: invoiceData.items.filter(item => item.id !== id) });
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = invoiceData.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.rate)), 0);
    const afterDiscount = Math.max(0, subtotal - Number(invoiceData.discount || 0));
    const taxAmount = (Number(invoiceData.taxRate) > 0) ? (afterDiscount * (Number(invoiceData.taxRate) / 100)) : 0;
    const grandTotal = Math.round(afterDiscount + taxAmount);
    return { subtotal, afterDiscount, taxAmount, grandTotal };
  };

  const openInvoiceModal = (lead = null) => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (lead) {
      const isCompleted = lead.status === 'Completed';
      setInvoiceData({
        ...invoiceData, leadId: lead._id,
        clientName: lead.name, email: lead.email, businessName: lead.businessName || '', 
        address: '', clientGst: '', poNumber: '', 
        items: [{ id: Date.now(), description: lead.service, hsn: '998314', qty: 1, rate: lead.price }],
        discount: 0, taxRate: 18, isFullyPaid: isCompleted, advancePaid: isCompleted ? lead.price : 0, isManual: false,
        invoiceType: isCompleted ? 'Tax Invoice' : 'Proforma Invoice',
        invoiceDate: today, dueDate: nextWeek
      });
    } else {
      setInvoiceData({
        ...invoiceData, leadId: '', clientName: '', email: '', businessName: '', address: '', clientGst: '', poNumber: '',
        items: [{ id: Date.now(), description: '', hsn: '998314', qty: 1, rate: 0 }],
        discount: 0, taxRate: 18, isFullyPaid: false, advancePaid: 0, isManual: true,
        invoiceType: 'Proforma Invoice', invoiceDate: today, dueDate: nextWeek
      });
    }
    setIsModalOpen(true);
  };

  const numberToWords = (num) => {
    let amount = Math.floor(Number(num));
    if (amount === 0) return 'Zero';
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    if ((amount = amount.toString()).length > 9) return 'overflow';
    let n = ('000000000' + amount).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim();
  };

  const handleSendInvoice = async () => {
    if (!invoiceData.leadId) {
      alert("Error: Cannot send automated email for Manual Invoices. Please download PDF instead.");
      return;
    }

    const { grandTotal } = calculateTotals();
    let exactDueAmount = 0;

    if (invoiceData.invoiceType === 'Proforma Invoice' || invoiceData.invoiceType === 'Quotation') {
      exactDueAmount = grandTotal / 2;
    } else {
      const finalAdvance = invoiceData.isFullyPaid ? grandTotal : Number(invoiceData.advancePaid);
      exactDueAmount = grandTotal - finalAdvance;
    }

    if (exactDueAmount <= 0) {
      alert("⚠️ Balance is 0. No payment is required for this invoice.");
      return;
    }

    try {
      setIsSending(true);
      await axios.post(`/api/leads/${invoiceData.leadId}/send-invoice`, { 
        invoiceType: invoiceData.invoiceType,
        amountToPay: exactDueAmount,
        totalValue: grandTotal
      }, getAuthConfig());
      
      alert(`✅ Success! Email and Razorpay link sent to ${invoiceData.email}.`);
      setIsModalOpen(false);
    } catch (error) {
      alert("❌ Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  const generatePDF = () => {
    if (!invoiceData.clientName || invoiceData.items.some(i => !i.description)) {
      alert("⚠️ Please fill in the Client Name and all Item Descriptions.");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const prefixMap = { 'Proforma Invoice': 'PF', 'Tax Invoice': 'INV', 'Quotation': 'QT', 'Receipt': 'REC' };
    const prefix = prefixMap[invoiceData.invoiceType] || 'INV';
    const invoiceNumber = `XR-${prefix}-${Date.now().toString().slice(-6)}`;
    
    const { subtotal, afterDiscount, taxAmount, grandTotal } = calculateTotals();
    
    let finalAdvance = 0, dueAmount = 0;
    if (invoiceData.invoiceType === 'Proforma Invoice' || invoiceData.invoiceType === 'Quotation') {
      dueAmount = grandTotal / 2; 
    } else {
      finalAdvance = invoiceData.isFullyPaid ? grandTotal : Number(invoiceData.advancePaid);
      dueAmount = grandTotal - finalAdvance;
    }

    const primary = [15, 23, 42];
    const secondary = [100, 116, 139];
    const accent = [79, 70, 229];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(...primary);
    doc.text("XR", 20, 26);
    doc.setTextColor(...accent);
    doc.text("System", 34, 26);

    doc.setFontSize(16);
    doc.setTextColor(...primary);
    doc.text(invoiceData.invoiceType.toUpperCase(), pageWidth - 20, 26, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 35, pageWidth - 20, 35);

    let y = 45;
    doc.setFontSize(9);
    doc.setTextColor(...secondary);
    doc.setFont("helvetica", "bold");
    doc.text("FROM:", 20, y);
    doc.text("BILL TO:", 85, y);

    doc.setFontSize(10);
    doc.setTextColor(...primary);
    doc.text("XR System", 20, y + 6);
    doc.text(invoiceData.businessName || invoiceData.clientName, 85, y + 6);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...secondary);
    doc.text("IT Service Company\nRanchi, Jharkhand, India - 834001\nGSTIN: ", 20, y + 11);
    
    let clientAddressText = invoiceData.clientName + "\n" + invoiceData.email;
    if (invoiceData.address) clientAddressText += "\n" + doc.splitTextToSize(invoiceData.address, 55).join("\n");
    if (invoiceData.clientGst) clientAddressText += "\nGSTIN: " + invoiceData.clientGst;
    doc.text(clientAddressText, 85, y + 11);

    const metaX = 150;
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE NO:", metaX, y);
    doc.setTextColor(...primary);
    doc.text(invoiceNumber, metaX, y + 5);

    doc.setTextColor(...secondary);
    doc.text("DATE:", metaX, y + 12);
    doc.setTextColor(...primary);
    doc.text(formatDate(invoiceData.invoiceDate), metaX, y + 17);

    doc.setTextColor(...secondary);
    doc.text("DUE DATE:", metaX, y + 24);
    doc.setTextColor(...primary);
    doc.text(formatDate(invoiceData.dueDate), metaX, y + 29);

    const tableY = y + 40;
    const tableBody = invoiceData.items.map((item, index) => [
      (index + 1).toString(),
      item.description,
      item.hsn,
      item.qty.toString(),
      Number(item.rate).toFixed(2),
      (Number(item.qty) * Number(item.rate)).toFixed(2)
    ]);

    autoTable(doc, {
      startY: tableY,
      head: [['#', 'DESCRIPTION', 'HSN/SAC', 'QTY', 'RATE (INR)', 'AMOUNT (INR)']],
      body: tableBody,
      theme: 'plain',
      headStyles: { textColor: primary, fontStyle: 'bold', fontSize: 9, fillColor: [248, 250, 252] },
      bodyStyles: { textColor: primary, fontSize: 9, cellPadding: 6 },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 70 }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'right' }, 5: { halign: 'right' } },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        doc.setDrawColor(226, 232, 240);
        doc.line(20, data.cursor.y, pageWidth - 20, data.cursor.y);
      }
    });

    let mathY = doc.lastAutoTable.finalY + 10;
    const mathLabelX = pageWidth - 70; 
    const mathValueX = pageWidth - 20; 

    doc.setFontSize(9);
    doc.setTextColor(...secondary);
    doc.text("Subtotal:", mathLabelX, mathY);
    doc.setTextColor(...primary);
    doc.text(subtotal.toFixed(2), mathValueX, mathY, { align: 'right' });

    if (invoiceData.discount > 0) {
      mathY += 6;
      doc.setTextColor(...secondary);
      doc.text("Discount:", mathLabelX, mathY);
      doc.setTextColor(220, 38, 38);
      doc.text(`- ${Number(invoiceData.discount).toFixed(2)}`, mathValueX, mathY, { align: 'right' });
    }

    if (Number(invoiceData.taxRate) > 0) {
      mathY += 6;
      doc.setTextColor(...secondary);
      doc.text(`CGST (${invoiceData.taxRate/2}%):`, mathLabelX, mathY);
      doc.setTextColor(...primary);
      doc.text((taxAmount/2).toFixed(2), mathValueX, mathY, { align: 'right' });
      
      mathY += 6;
      doc.setTextColor(...secondary);
      doc.text(`SGST (${invoiceData.taxRate/2}%):`, mathLabelX, mathY);
      doc.setTextColor(...primary);
      doc.text((taxAmount/2).toFixed(2), mathValueX, mathY, { align: 'right' });
    }

    mathY += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Amount:", mathLabelX, mathY);
    doc.text(`INR ${grandTotal.toFixed(2)}`, mathValueX, mathY, { align: 'right' });

    mathY += 8;
    doc.setFontSize(10);
    if (invoiceData.invoiceType === 'Proforma Invoice' || invoiceData.invoiceType === 'Quotation') {
      doc.setTextColor(...accent);
      doc.text("50% Advance Due:", mathLabelX, mathY);
      doc.text(`INR ${dueAmount.toFixed(2)}`, mathValueX, mathY, { align: 'right' });
    } else if (finalAdvance > 0) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...secondary);
      doc.text("Less Advance:", mathLabelX, mathY);
      doc.setTextColor(...primary);
      doc.text(`- INR ${finalAdvance.toFixed(2)}`, mathValueX, mathY, { align: 'right' });
      
      mathY += 6;
      doc.setFont("helvetica", "bold");
      doc.text("Balance Due:", mathLabelX, mathY);
      doc.text(`INR ${dueAmount.toFixed(2)}`, mathValueX, mathY, { align: 'right' });
    }

    let leftY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondary);
    doc.text("AMOUNT IN WORDS", 20, leftY);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    const amountToSpell = (invoiceData.invoiceType === 'Proforma Invoice' || invoiceData.invoiceType === 'Quotation') ? dueAmount : grandTotal; 
    const wordsText = doc.splitTextToSize(`Rupees ${numberToWords(amountToSpell)} Only`, 100);
    doc.text(wordsText, 20, leftY + 5);

    leftY += 15 + (wordsText.length * 4);
    doc.setTextColor(...secondary);
    doc.text("PAYMENT DETAILS", 20, leftY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...primary);
    doc.text("Jio Payment Bank | A/C Name: XR System\nA/C No: 001521711568284 | IFSC: JIOP0000001\nPayment Method: UPI / IMPS / Razorpay", 20, leftY + 5);
    
    doc.setFont("helvetica", "italic");
    doc.setTextColor(220, 38, 38);
    doc.text("* Late fee of Rs. 100/day applies after due date.", 20, leftY + 22);

    if(invoiceData.notes) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...secondary);
      doc.text(`Note: ${invoiceData.notes}`, 20, leftY + 30);
    }

    const footerY = pageHeight - 45; 
    doc.setDrawColor(226, 232, 240);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text("TERMS & CONDITIONS", 20, footerY);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondary);
    doc.text("1. 50% advance required before starting the project.", 20, footerY + 5);
    doc.text("2. Remaining 50% must be cleared before final delivery/deployment.", 20, footerY + 9);
    doc.text("3. No refund will be issued after the project has started.", 20, footerY + 13);
    doc.text("4. Delays in providing content from the client side will extend project timelines.", 20, footerY + 17);
    doc.text("5. All disputes are subject to Ranchi, Jharkhand jurisdiction only.", 20, footerY + 21);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primary);
    doc.text("For XR System", pageWidth - 20, footerY + 10, { align: 'right' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...secondary);
    doc.text("Authorized Signatory", pageWidth - 20, footerY + 15, { align: 'right' });

    const safeName = invoiceData.clientName ? invoiceData.clientName.replace(/\s+/g, '_') : 'Client';
    doc.save(`${invoiceNumber}_${safeName}.pdf`);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Invoices</h2>
          <p className="text-slate-500 text-sm mt-1">Manage payments, track outstanding dues, and generate premium receipts.</p>
        </div>
        <button onClick={() => openInvoiceModal()} className="bg-brand-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap">
          <Plus size={16} /> <span className="hidden sm:block">Create Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0"><Receipt size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Expected</p><h3 className="text-2xl font-bold text-slate-900">₹{totalExpected.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0"><CheckCircle2 size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Amount Collected</p><h3 className="text-2xl font-bold text-slate-900">₹{totalCollected.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0"><Clock size={24} /></div>
          <div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Dues</p><h3 className="text-2xl font-bold text-slate-900">₹{totalPending.toLocaleString()}</h3></div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Client Details</th>
                <th className="px-6 py-4">Project / Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600 mx-auto" /></td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No billable projects found.</td></tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'Completed';
                  return (
                    <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{inv.businessName || inv.name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{inv.email}</p>
                      </td>
                      <td className="px-6 py-4"><p className="text-slate-700 font-medium">{inv.service}</p></td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-base">₹{inv.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {isPaid ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} /> Paid</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"><Clock size={12} /> Pending</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openInvoiceModal(inv)} className="px-3 py-1.5 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg font-bold text-xs transition-colors">Manage Invoice</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="text-brand-600" /> Dynamic Invoice Generator
                </h2>
                <p className="text-sm text-slate-500 mt-1">XR SYSTEM BILLING DASHBOARD</p>
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b pb-2">Client Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">CLIENT NAME *</label>
                      <input type="text" value={invoiceData.clientName} onChange={e=>setInvoiceData({...invoiceData, clientName: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">BUSINESS NAME</label>
                      <input type="text" value={invoiceData.businessName} onChange={e=>setInvoiceData({...invoiceData, businessName: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">ADDRESS</label>
                    <textarea rows={2} value={invoiceData.address} onChange={e=>setInvoiceData({...invoiceData, address: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm resize-none outline-none"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">CLIENT GSTIN (Opt)</label>
                      <input type="text" value={invoiceData.clientGst} onChange={e=>setInvoiceData({...invoiceData, clientGst: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">PO NUMBER (Opt)</label>
                      <input type="text" value={invoiceData.poNumber} onChange={e=>setInvoiceData({...invoiceData, poNumber: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b pb-2">Invoice Config</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">INVOICE TYPE</label>
                      <select value={invoiceData.invoiceType} onChange={e=>setInvoiceData({...invoiceData, invoiceType: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-brand-600 outline-none">
                        <option value="Proforma Invoice">Proforma (50% Adv)</option>
                        <option value="Tax Invoice">Tax Invoice (Final)</option>
                        <option value="Quotation">Quotation (Estimate)</option>
                        <option value="Receipt">Payment Receipt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">GST RATE (%)</label>
                      <select value={invoiceData.taxRate} onChange={e=>setInvoiceData({...invoiceData, taxRate: e.target.value})} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm font-bold outline-none">
                        <option value="0">No GST</option>
                        <option value="18">18% GST</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">INVOICE DATE</label>
                      <input type="date" value={invoiceData.invoiceDate} onChange={e=>setInvoiceData({...invoiceData, invoiceDate: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">DUE DATE</label>
                      <input type="date" value={invoiceData.dueDate} onChange={e=>setInvoiceData({...invoiceData, dueDate: e.target.value})} className="w-full border border-slate-200 p-2.5 rounded-lg text-sm outline-none" />
                    </div>
                  </div>

                  {invoiceData.invoiceType === 'Tax Invoice' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <label className="flex items-center gap-2 cursor-pointer mb-2">
                        <input type="checkbox" checked={invoiceData.isFullyPaid} onChange={e => setInvoiceData({...invoiceData, isFullyPaid: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500" />
                        <span className="font-bold text-sm text-slate-900">Mark as Fully Paid</span>
                      </label>
                      {!invoiceData.isFullyPaid && (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">ADVANCE RECEIVED (₹)</label>
                          <input type="number" value={invoiceData.advancePaid} onChange={e=>setInvoiceData({...invoiceData, advancePaid: e.target.value})} className="w-full border border-slate-300 p-2 rounded text-sm outline-none" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Line Items</h3>
                  <button onClick={handleAddItem} className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus size={14}/> Add Row</button>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  {invoiceData.items.map((item, idx) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-end">
                      <div className="w-full sm:w-1/2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">DESCRIPTION *</label>
                        <input type="text" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg text-sm outline-none" placeholder="Web Development" />
                      </div>
                      <div className="w-full sm:w-1/6">
                        <label className="block text-xs font-bold text-slate-500 mb-1">QTY</label>
                        <input type="number" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg text-sm outline-none text-center" />
                      </div>
                      <div className="w-full sm:w-1/4">
                        <label className="block text-xs font-bold text-slate-500 mb-1">RATE (₹)</label>
                        <input type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)} className="w-full border border-slate-300 p-2 rounded-lg text-sm outline-none" />
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-2.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))}
                  
                  <div className="flex justify-end pt-3 border-t border-slate-200 mt-4">
                     <div className="w-full sm:w-1/3">
                        <label className="block text-xs font-bold text-slate-500 mb-1">DISCOUNT (₹)</label>
                        <input type="number" value={invoiceData.discount} onChange={(e) => setInvoiceData({...invoiceData, discount: e.target.value})} className="w-full border border-amber-300 bg-amber-50 p-2 rounded-lg text-sm font-bold outline-none" placeholder="0" />
                     </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={generatePDF} className="flex-1 bg-white border-2 border-slate-200 text-slate-800 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Download size={18} /> Download Final PDF
                  </button>

                  {!invoiceData.isManual && (
                    <button onClick={handleSendInvoice} disabled={isSending} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSending ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                      {isSending ? 'Sending...' : 'Email to Client'}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}