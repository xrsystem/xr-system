import React, { useState, useEffect } from 'react';
import { LayoutTemplate, Plus, Trash2, Edit2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import axios from 'axios';

export default function PortfolioManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [newProject, setNewProject] = useState({ 
    title: '', category: 'Web Development', description: '', techStack: '', link: '' 
  });
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  const getAuthConfig = () => ({ headers: { Authorization: `Bearer ${token}` } });
  const getFormAuthConfig = () => ({ headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/portfolio');
      if (response.data?.data?.projects) setProjects(response.data.data.projects);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleEditClick = (project) => {
    setNewProject({
      title: project.title, category: project.category, description: project.description,
      techStack: project.techStack, link: project.liveLink || project.link || ''
    });
    setEditingId(project._id);
    setImageFile(null); 
    setShowForm(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) return alert("Please select an image for the new project!");
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('category', newProject.category);
    formData.append('description', newProject.description);
    formData.append('techStack', newProject.techStack); 
    formData.append('liveLink', newProject.link);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingId) {
        await axios.put(`/api/portfolio/${editingId}`, formData, getFormAuthConfig());
      } else {
        await axios.post('/api/portfolio', formData, getFormAuthConfig());
      }
      setShowForm(false); setEditingId(null);
      setNewProject({ title: '', category: 'Web Development', description: '', techStack: '', link: '' });
      setImageFile(null); fetchProjects(); 
    } catch (error) {
      alert("Failed to save project"); console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    setProjects(projects.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
    try { await axios.patch(`/api/portfolio/${id}/status`, {}, getAuthConfig()); } 
    catch (error) { 
      setProjects(projects.map(p => p._id === id ? { ...p, isActive: currentStatus } : p)); 
      alert("Failed to update visibility.");
    }
  };

  const deleteProject = async (id) => {
    if(!window.confirm("Delete this project completely?")) return;
    try {
      await axios.delete(`/api/portfolio/${id}`, getAuthConfig());
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) { alert("Failed to delete project"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portfolio Manager</h2>
          <p className="text-slate-500 text-sm mt-1">Upload, Edit and manage your client projects.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setNewProject({ title: '', category: 'Web Development', description: '', techStack: '', link: '' }); }} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl hover:bg-brand-700 transition-colors font-bold">
          <Plus size={18} /> Add New Project
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20}/></button>
          <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Project' : 'Create New Project'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Project Title" required value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="border p-2 rounded-lg w-full" />
            <select value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} className="border p-2 rounded-lg w-full">
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="SEO">SEO</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="E-commerce">E-commerce</option>
            </select>
            <input type="text" placeholder="Tech Stack (comma separated: React, Node)" required value={newProject.techStack} onChange={(e) => setNewProject({...newProject, techStack: e.target.value})} className="border p-2 rounded-lg w-full" />
            <input type="url" placeholder="Live Link (https://...)" value={newProject.link} onChange={(e) => setNewProject({...newProject, link: e.target.value})} className="border p-2 rounded-lg w-full" />
          </div>
          
          <textarea placeholder="Project Description..." required rows="2" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} className="border p-2 rounded-lg w-full"></textarea>
          
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50">
             <ImageIcon className="text-slate-400 mb-2" size={32} />
             <input type="file" accept="image/*" required={!editingId} onChange={(e) => setImageFile(e.target.files[0])} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer" />
             {editingId && <p className="text-xs text-slate-400 mt-2">Leave empty to keep the current image.</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-brand-700">
              {submitting ? 'Saving...' : (editingId ? 'Update Project' : 'Publish Project')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-50 w-full">
        {loading ? ( <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-600" /></div> ) 
        : projects.length === 0 ? ( <div className="p-8 text-center text-slate-500">No projects added yet.</div> ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
             {projects.map(project => (
               <div key={project._id} className="border border-slate-200 rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                 <div className="h-48 bg-slate-100 relative">
                   <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover object-top" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     
                     <button onClick={() => toggleStatus(project._id, project.isActive)} className={`px-4 py-2 rounded-full text-xs font-bold text-white shadow-sm ${project.isActive ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-500 hover:bg-slate-600'}`}>
                       {project.isActive ? 'Visible Live' : 'Hidden'}
                     </button>
                     
                     <button onClick={() => handleEditClick(project)} className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm" title="Edit">
                       <Edit2 size={16} />
                     </button>

                     <button onClick={() => deleteProject(project._id)} className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm" title="Delete">
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
                 <div className="p-4">
                   <h4 className="font-bold text-slate-900 line-clamp-1">{project.title}</h4>
                   <p className="text-xs text-brand-600 font-bold uppercase tracking-wide mt-1">{project.category}</p>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}