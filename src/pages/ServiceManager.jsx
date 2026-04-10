import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, X, Layers } from 'lucide-react';
import axios from 'axios';

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [newService, setNewService] = useState({ 
    title: '', description: '', iconName: 'Globe', features: '', benefits: '' 
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      if (response.data?.data?.services) setServices(response.data.data.services);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleEditClick = (service) => {
    setNewService({
      title: service.title,
      description: service.description,
      iconName: service.iconName || 'Globe',
      features: service.features ? service.features.join(', ') : '',
      benefits: service.benefits ? service.benefits.join(', ') : ''
    });
    setEditingId(service._id);
    setImageFile(null); 
    setShowForm(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) return alert("Please select an image for the new service!");
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', newService.title);
    formData.append('description', newService.description);
    formData.append('iconName', newService.iconName);
    formData.append('features', newService.features); 
    formData.append('benefits', newService.benefits);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingId) {
        await axios.put(`/api/services/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      } else {
        await axios.post('/api/services', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
      
      setShowForm(false);
      setEditingId(null);
      setNewService({ title: '', description: '', iconName: 'Globe', features: '', benefits: '' });
      setImageFile(null);
      fetchServices(); 
    } catch (error) {
      alert("Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    setServices(services.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
    try { await axios.patch(`/api/services/${id}/status`); } 
    catch (error) { setServices(services.map(s => s._id === id ? { ...s, isActive: currentStatus } : s)); }
  };

  const deleteService = async (id) => {
    if(!window.confirm("Delete this service completely?")) return;
    try {
      await axios.delete(`/api/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (error) { alert("Failed to delete service"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Services Manager</h2>
          <p className="text-slate-500 text-sm mt-1">Manage core services offered on your website.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setNewService({ title: '', description: '', iconName: 'Globe', features: '', benefits: '' }); }} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors">
          <Plus size={18} /> Add New Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20}/></button>
          <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Service' : 'Create New Service'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Service Title (e.g. Digital Marketing)" required value={newService.title} onChange={(e) => setNewService({...newService, title: e.target.value})} className="border p-2 rounded-lg w-full" />
            <select value={newService.iconName} onChange={(e) => setNewService({...newService, iconName: e.target.value})} className="border p-2 rounded-lg w-full">
              <option value="Globe">Globe</option>
              <option value="Palette">Palette (UI/UX)</option>
              <option value="ShoppingCart">Shopping Cart (E-com)</option>
              <option value="Search">Search (Marketing)</option>
              <option value="BarChart">Bar Chart (SEO)</option>
              <option value="Code">Code (Dev)</option>
            </select>
          </div>
          
          <textarea placeholder="Service Description..." required rows="2" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="border p-2 rounded-lg w-full"></textarea>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Key Features (Comma separated)</label>
              <input type="text" placeholder="e.g. Custom Layout, Responsive, SEO" value={newService.features} onChange={(e) => setNewService({...newService, features: e.target.value})} className="border p-2 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Core Benefits (Comma separated)</label>
              <input type="text" placeholder="e.g. Higher ROI, Global Reach" value={newService.benefits} onChange={(e) => setNewService({...newService, benefits: e.target.value})} className="border p-2 rounded-lg w-full" />
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50">
             <ImageIcon className="text-slate-400 mb-2" size={32} />
             <input type="file" accept="image/*" required={!editingId} onChange={(e) => setImageFile(e.target.files[0])} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer" />
             {editingId && <p className="text-xs text-slate-400 mt-2">Leave empty to keep the current image.</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-brand-600 text-white rounded-lg disabled:opacity-50">
              {submitting ? 'Saving...' : (editingId ? 'Update Service' : 'Publish Service')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? ( <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-600" /></div> ) 
        : services.length === 0 ? ( <div className="p-8 text-center text-slate-500">No services added yet.</div> ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
             {services.map(service => (
               <div key={service._id} className="border border-slate-200 rounded-xl overflow-hidden group">
                 <div className="h-40 bg-slate-100 relative">
                   <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover object-top" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                     <button onClick={() => toggleStatus(service._id, service.isActive)} className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${service.isActive ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                       {service.isActive ? 'Live' : 'Hidden'}
                     </button>
                     <button onClick={() => handleEditClick(service)} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors title='Edit'">
                       <Edit2 size={16} />
                     </button>
                     <button onClick={() => deleteService(service._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors title='Delete'">
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
                 <div className="p-4">
                   <h4 className="font-bold text-slate-900 line-clamp-1">{service.title}</h4>
                   <p className="text-xs text-slate-500 line-clamp-1 mt-1">{service.description}</p>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}