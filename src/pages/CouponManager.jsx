import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, X, Tag } from 'lucide-react';
import axios from 'axios';

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newCoupon, setNewCoupon] = useState({ 
    code: '', discountType: 'PERCENTAGE', discountValue: '', expiryDate: '' 
  });

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
  });

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('/api/coupons', getAuthConfig());
      if (response.data?.data?.coupons) setCoupons(response.data.data.coupons);
    } catch (error) { console.error("Failed to fetch coupons", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = { 
      ...newCoupon, 
      code: newCoupon.code.toUpperCase().replace(/\s+/g, ''),
      discountValue: Number(newCoupon.discountValue)
    };
    if (!payload.expiryDate) delete payload.expiryDate;

    try {
      await axios.post('/api/coupons', payload, getAuthConfig());
      setShowForm(false);
      setNewCoupon({ code: '', discountType: 'PERCENTAGE', discountValue: '', expiryDate: '' });
      fetchCoupons(); 
    } catch (error) { 
      alert(error.response?.data?.message || "Failed to create coupon (Maybe code already exists)"); 
    } finally { setSubmitting(false); }
  };

  const toggleStatus = async (id, currentStatus) => {
    setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
    try { 
      await axios.patch(`/api/coupons/${id}/status`, {}, getAuthConfig()); 
    } 
    catch (error) { setCoupons(coupons.map(c => c._id === id ? { ...c, isActive: currentStatus } : c)); }
  };

  const deleteCoupon = async (id) => {
    if(!window.confirm("Delete this coupon permanently?")) return;
    try { 
      await axios.delete(`/api/coupons/${id}`, getAuthConfig()); 
      setCoupons(coupons.filter(c => c._id !== id)); 
    } 
    catch (error) { alert("Failed to delete coupon"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Promo Codes & Offers</h2>
          <p className="text-slate-500 text-sm mt-1">Generate discount codes for your clients (e.g., DIWALI50, FIRSTTIME).</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors">
          <Plus size={18} /> Add New Code
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20}/></button>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Promo Code</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Coupon Code (e.g. SAVE20)</label>
              <input type="text" required value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="border p-2 rounded-lg w-full font-mono uppercase" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Discount Type</label>
              <select value={newCoupon.discountType} onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value})} className="border p-2 rounded-lg w-full">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Discount Value</label>
              <input type="number" required placeholder={newCoupon.discountType === 'PERCENTAGE' ? "e.g. 15 (for 15%)" : "e.g. 5000 (for ₹5000)"} value={newCoupon.discountValue} onChange={(e) => setNewCoupon({...newCoupon, discountValue: e.target.value})} className="border p-2 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date (Optional)</label>
              <input type="date" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})} className="border p-2 rounded-lg w-full" />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-brand-600 text-white rounded-lg disabled:opacity-50">
              {submitting ? 'Creating...' : 'Generate Code'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? ( <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-600" /></div> ) 
        : coupons.length === 0 ? ( <div className="p-8 text-center text-slate-500">No promo codes active right now.</div> ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm min-w-175">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Promo Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map(coupon => {
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                  return (
                  <tr key={coupon._id} className={!coupon.isActive || isExpired ? 'bg-slate-50/50 opacity-70' : ''}>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg font-mono font-bold tracking-widest flex items-center gap-2 w-fit">
                        <Tag size={14} className="text-brand-500" /> {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue.toLocaleString()} OFF`}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.expiryDate ? (
                        <span className={isExpired ? 'text-red-500 font-bold' : 'text-slate-600'}>
                          {new Date(coupon.expiryDate).toLocaleDateString()} {isExpired && '(Expired)'}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No Expiry</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button onClick={() => toggleStatus(coupon._id, coupon.isActive)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${coupon.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${coupon.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteCoupon(coupon._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}