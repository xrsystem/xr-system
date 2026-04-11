import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import axios from 'axios';

export default function CareerManager() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  
  const [newJob, setNewJob] = useState({ 
    title: '', department: '', location: '', type: 'FULL-TIME', experience: '', description: '' 
  });

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/careers/jobs');
      if (response.data?.data?.jobs) setJobs(response.data.data.jobs);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleEditClick = (job) => {
    setNewJob({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      description: job.description
    });
    setEditingId(job._id);
    setShowForm(true);
  };

  const handleCreateOrUpdateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/api/careers/jobs/${editingId}`, newJob);
      } else {
        await axios.post('/api/careers/jobs', newJob);
      }
      setShowForm(false);
      setEditingId(null);
      setNewJob({ title: '', department: '', location: '', type: 'FULL-TIME', experience: '', description: '' });
      fetchJobs(); 
    } catch (error) {
      alert("Failed to save job");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    setJobs(jobs.map(job => job._id === id ? { ...job, isActive: !currentStatus } : job));
    try {
      await axios.patch(`/api/careers/jobs/${id}/status`);
    } catch (error) {
      setJobs(jobs.map(job => job._id === id ? { ...job, isActive: currentStatus } : job));
    }
  };

  const deleteJob = async (id) => {
    if(!window.confirm("Delete this job permanently?")) return;
    try {
      await axios.delete(`/api/careers/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (error) {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Career Page Manager</h2>
          <p className="text-slate-500 text-sm mt-1">Manage jobs like "Frontend Developer" on your site.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setNewJob({ title: '', department: '', location: '', type: 'FULL-TIME', experience: '', description: '' }); }} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors">
          <Plus size={18} /> Post New Job
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateOrUpdateJob} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20}/></button>
          <h3 className="text-lg font-bold text-slate-800 mb-4">{editingId ? 'Edit Job Posting' : 'Create New Job'}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Job Title (e.g. Frontend Developer (React))" required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} className="border p-2 rounded-lg w-full" />
            <input type="text" placeholder="Department (e.g. ENGINEERING)" required value={newJob.department} onChange={(e) => setNewJob({...newJob, department: e.target.value.toUpperCase()})} className="border p-2 rounded-lg w-full" />
            <input type="text" placeholder="Location (e.g. RANCHI / REMOTE)" required value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value.toUpperCase()})} className="border p-2 rounded-lg w-full" />
            <input type="text" placeholder="Experience (e.g. 1-3 YRS or Fresher)" required value={newJob.experience} onChange={(e) => setNewJob({...newJob, experience: e.target.value})} className="border p-2 rounded-lg w-full" />
            
            <select value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})} className="border p-2 rounded-lg w-full">
              <option value="FULL-TIME">FULL-TIME</option>
              <option value="PART-TIME">PART-TIME</option>
              <option value="CONTRACT">CONTRACT</option>
              <option value="INTERNSHIP">INTERNSHIP</option>
            </select>
          </div>
          {/* ✅ FIX: Yahan rows="3" ko badal kar rows="8" kar diya taaki lamba text likhne mein aasaani ho */}
          <textarea placeholder="Job Description (Looking for a hungry React developer...)" required rows="8" value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} className="border p-2 rounded-lg w-full"></textarea>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-brand-600 text-white rounded-lg disabled:opacity-50">
              {submitting ? 'Saving...' : (editingId ? 'Update Job' : 'Publish Job')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No jobs posted yet.</div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4">Job Info</th>
                <th className="px-6 py-4">Tags (Exp / Type / Loc)</th>
                <th className="px-6 py-4 text-center">Live Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-brand-600 font-medium">{job.department}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs mr-2">{job.experience}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs mr-2">{job.type}</span>
                    <span className="text-xs">{job.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button onClick={() => toggleStatus(job._id, job.isActive)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${job.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEditClick(job)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg mr-2" title="Edit Job">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteJob(job._id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete Job">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}