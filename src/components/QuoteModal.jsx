import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle2, Tag } from 'lucide-react';
import axios from 'axios';

export default function QuoteModal({ isOpen, onClose, selectedPlan }) {
  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', businessName: '', websiteUrl: '', message: ''
  });
  
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState({ type: '', message: '', value: null }); 

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const serviceName = selectedPlan ? `${selectedPlan.category} - ${selectedPlan.name}` : 'General Inquiry';
  const basePrice = selectedPlan?.price || 0;
  const isMaintenance = serviceName.toLowerCase().includes('care');

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoStatus({ type: 'loading', message: 'Validating code...', value: null });
    
    try {
      const res = await axios.post('/api/coupons/validate', { code: promoCode });
      if (res.data.success) {
        const { discountValue, discountType } = res.data.data;
        const discountText = discountType === 'PERCENTAGE' ? `${discountValue}% OFF` : `₹${discountValue} OFF`;
        
        setPromoStatus({
          type: 'success',
          message: `Valid Code! You will get ${discountText} on the final invoice.`,
          value: res.data.data
        });
      }
    } catch (err) {
      setPromoStatus({
        type: 'error',
        message: err.response?.data?.message || 'Invalid or expired code.',
        value: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let finalPrice = basePrice;
    let promoText = ""; 

    if (promoStatus.type === 'success' && promoStatus.value) {
      const { code, discountValue, discountType } = promoStatus.value;
      const dText = discountType === 'PERCENTAGE' ? `${discountValue}%` : `₹${discountValue}`;
      
      let discountAmount = 0;
      
      if (discountType === 'PERCENTAGE') {
        discountAmount = Math.round(basePrice * (discountValue / 100));
        finalPrice = basePrice - discountAmount;
      } else {
        discountAmount = discountValue;
        finalPrice = Math.max(0, basePrice - discountAmount); 
      }

      promoText = `[💸 PROMO APPLIED: ${code} (${dText} OFF)]\n[💰 Original Price: ₹${basePrice} | Discounted: ₹${discountAmount}]\n= ₹${finalPrice}`;
    }

    try {
      // ✅ FETCH KO HATA KAR AXIOS LAGA DIYA
      const res = await axios.post('/api/leads', {
        ...formData,
        service: serviceName,
        price: finalPrice, 
        promoDetails: promoText
      });

      if (res.status === 200 || res.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: '', email: '', whatsapp: '', businessName: '', websiteUrl: '', message: '' });
          setPromoCode('');
          setPromoStatus({ type: '', message: '', value: null });
          onClose();
        }, 5000);
      }
    } catch (err) {
      console.error('Lead Submit Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-6 py-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh]">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"><X size={20} /></button>

            <div className="p-8 lg:p-10 overflow-y-auto custom-scrollbar">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                  <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Request Received!</h2>
                  <p className="text-slate-600 mb-6">Thank you for choosing XR System. We&apos;ve sent a confirmation email to <strong>{formData.email}</strong>.</p>
                  <p className="text-sm text-slate-500">Our team will review your requirements and get back to you on WhatsApp within 2-4 hours.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                      {isMaintenance ? 'Setup Your Plan' : 'Request Project Setup'}
                    </h2>
                    <p className="text-slate-500">Selected: <span className="text-brand-600 font-bold">{serviceName}</span></p>
                    
                    {basePrice > 0 && (
                      <p className="text-sm text-slate-700 mt-2 font-bold bg-slate-50 inline-block px-3 py-1 rounded-lg">
                        Base Price: ₹{basePrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0"><X size={16} /></div>
                      <p className="font-medium">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-sm" placeholder="Enter your name" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                        <input required type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-sm" placeholder="Enter your WhatsApp number" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-sm" placeholder="Enter your email address" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                        <input type="text" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-sm" placeholder="Enter your business name" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Website URL (Optional)</label>
                        <input type="url" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-sm" placeholder="Enter your website URL" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Project Brief / Requirements</label>
                      <textarea required rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all resize-none text-sm" placeholder="Briefly describe what you need..." />
                    </div>

                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-1">
                        <Tag size={12} /> Have a Promo Code?
                      </label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={promoCode} 
                          onChange={e => setPromoCode(e.target.value.toUpperCase())}
                          disabled={promoStatus.type === 'success'}
                          className={`w-full px-4 py-3 border-none rounded-xl transition-all text-sm uppercase ${promoStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-slate-50 focus:ring-2 focus:ring-brand-500'}`} 
                          placeholder="e.g. FIRSTTIME" 
                        />
                        {promoStatus.type !== 'success' && (
                          <button 
                            type="button" 
                            onClick={handleApplyPromo}
                            disabled={!promoCode || promoStatus.type === 'loading'}
                            className="px-6 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center min-w-25"
                          >
                            {promoStatus.type === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                          </button>
                        )}
                      </div>
                      
                      {promoStatus.type === 'success' && <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 size={12}/> {promoStatus.message}</p>}
                      {promoStatus.type === 'error' && <p className="text-xs font-bold text-red-500 mt-2">{promoStatus.message}</p>}
                    </div>

                    <button disabled={loading} className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-base hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
                      {loading ? <Loader2 className="animate-spin" /> : (isMaintenance ? 'Get My Invoice' : 'Request Project Setup')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}