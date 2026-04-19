import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import axios from 'axios';

export default function PricingManager() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [newPlan, setNewPlan] = useState({ 
    name: '', price: '', originalPrice: '', discountBadge: '', category: 'Web Development', description: '', features: '', isPopular: false, iconName: '' 
  });

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
  });

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/pricing', getAuthConfig());
      if (response.data?.data?.plans) setPlans(response.data.data.plans);
    } catch (error) { console.error("Failed", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleEditClick = (plan) => {
    setNewPlan({
      name: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice || '',
      discountBadge: plan.discountBadge || '',
      category: plan.category,
      description: plan.description || '',
      features: plan.features ? plan.features.join(', ') : '',
      isPopular: plan.isPopular,
      iconName: plan.iconName || ''
    });
    setEditingId(plan._id);
    setShowForm(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = { 
      ...newPlan, 
      price: Number(newPlan.price),
      originalPrice: newPlan.originalPrice ? Number(newPlan.originalPrice) : null
    };

    try {
      if (editingId) await axios.put(`/api/pricing/${editingId}`, payload, getAuthConfig());
      else await axios.post('/api/pricing', payload, getAuthConfig());
      
      setShowForm(false);
      setEditingId(null);
      setNewPlan({ name: '', price: '', originalPrice: '', discountBadge: '', category: 'Web Development', description: '', features: '', isPopular: false, iconName: '' });
      fetchPlans(); 
    } catch (error) { alert("Failed to save plan"); } 
    finally { setSubmitting(false); }
  };

  const toggleStatus = async (id, currentStatus) => {
    setPlans(plans.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
    try { 
      await axios.patch(`/api/pricing/${id}/status`, {}, getAuthConfig()); 
    } 
    catch (error) { setPlans(plans.map(p => p._id === id ? { ...p, isActive: currentStatus } : p)); }
  };

  const deletePlan = async (id) => {
    if(!window.confirm("Delete this plan?")) return;
    try { 
      await axios.delete(`/api/pricing/${id}`, getAuthConfig()); 
      setPlans(plans.filter(p => p._id !== id)); 
    } 
    catch (error) { alert("Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pricing & Packages</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all your service packages, add-ons, and discounts.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setNewPlan({ name: '', price: '', originalPrice: '', discountBadge: '', category: 'Web Development', description: '', features: '', isPopular: false, iconName: '' }); }} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors">
          <Plus size={18} /> Add New Plan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20}/></button>
          <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Plan' : 'Create New Plan'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Plan Name (e.g. Basic)" required value={newPlan.name} onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} className="border p-2 rounded-lg w-full" />
            <select value={newPlan.category} onChange={(e) => setNewPlan({...newPlan, category: e.target.value})} className="border p-2 rounded-lg w-full">
              <option value="Web Development">Web Development</option>
              <option value="SEO">SEO</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Combo Plans">Combo Plans</option>
              <option value="Add-on">Add-on Service</option>
            </select>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Final Selling Price (₹) *</label>
              <input type="number" required value={newPlan.price} onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} className="border p-2 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Original Price (Strike-through)</label>
              <input type="number" placeholder="Optional" value={newPlan.originalPrice} onChange={(e) => setNewPlan({...newPlan, originalPrice: e.target.value})} className="border p-2 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Discount Badge Text</label>
              <input type="text" placeholder="e.g. SAVE 20%" value={newPlan.discountBadge} onChange={(e) => setNewPlan({...newPlan, discountBadge: e.target.value.toUpperCase()})} className="border p-2 rounded-lg w-full" />
            </div>
          </div>
          
          <textarea placeholder="Short Description..." rows="2" value={newPlan.description} onChange={(e) => setNewPlan({...newPlan, description: e.target.value})} className="border p-2 rounded-lg w-full"></textarea>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Features (Comma separated)</label>
            <input type="text" placeholder="e.g. 4–5 Pages, Mobile Responsive, Basic UI" value={newPlan.features} onChange={(e) => setNewPlan({...newPlan, features: e.target.value})} className="border p-2 rounded-lg w-full" />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newPlan.isPopular} onChange={(e) => setNewPlan({...newPlan, isPopular: e.target.checked})} className="w-5 h-5 text-brand-600 rounded" />
              <span className="text-sm font-bold text-slate-700">Mark as "Most Popular" (Center Highlight)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-brand-600 text-white rounded-lg disabled:opacity-50">
              {submitting ? 'Saving...' : (editingId ? 'Update Plan' : 'Publish Plan')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? ( <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-600" /></div> ) 
        : plans.length === 0 ? ( <div className="p-8 text-center text-slate-500">No plans added yet.</div> ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm min-w-175">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Plan Name & Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plans.map(plan => (
                  <tr key={plan._id} className={plan.isPopular ? 'bg-brand-50/30' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{plan.name}</p>
                        {plan.isPopular && <span className="bg-brand-100 text-brand-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Popular</span>}
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase mt-1">{plan.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
                      {plan.originalPrice && <span className="text-slate-400 line-through ml-2 text-xs">₹{plan.originalPrice.toLocaleString()}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button onClick={() => toggleStatus(plan._id, plan.isActive)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${plan.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${plan.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEditClick(plan)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg mr-2"><Edit2 size={16} /></button>
                      <button onClick={() => deletePlan(plan._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}