import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Clock, GraduationCap, CheckCircle2, AlertCircle, UploadCloud, FileText, Loader2, X } from 'lucide-react';
import SEO from '../components/SEO';
import axios from 'axios';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', linkedin: '', portfolioUrl: '', resumeUrl: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get('/api/careers/jobs');
        if (response.data?.data?.jobs) {
          const foundJob = response.data.data.jobs.find((j) => j._id === id);
          setJob(foundJob);
        }
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF document.");
      return;
    }
    
    setUploadingResume(true);
    const uploadData = new FormData();
    uploadData.append("resume", file);
    
    try {
      const res = await axios.post("/api/upload/resume", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData(prev => ({ ...prev, resumeUrl: res.data.url }));
      setResumeName(file.name);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  const removeResume = () => {
    setFormData(prev => ({ ...prev, resumeUrl: '' }));
    setResumeName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resumeUrl) {
      alert("Please upload your resume before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await axios.post('/api/careers', { 
        ...formData, 
        role: job.title 
      });
      
      if (res.status === 200 || res.status === 201) {
        setSubmitStatus({ type: 'success', message: 'Application sent! We will review your portfolio.' });
        setFormData({ name: '', email: '', whatsapp: '', linkedin: '', portfolioUrl: '', resumeUrl: '', message: '' });
        setResumeName("");
      }
    } catch (err) {
      console.error('Career Form Error:', err.response?.data || err.message);
      setSubmitStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Something went wrong. Please check your connection.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-slate-50 min-h-screen pt-40 pb-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Job Not Found</h2>
        <p className="text-slate-600 mb-8">This position may have been closed or removed.</p>
        <button onClick={() => navigate('/careers')} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
          Back to Careers
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <SEO title={`${job.title} | XR System Careers`} description={`Apply for the ${job.title} position at XR System in Ranchi.`} />
      
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => navigate('/careers')} 
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-brand-600 transition-colors mb-10"
        >
          <ArrowLeft size={20} /> Back to Open Roles
        </button>

        <div className="grid lg:grid-cols-5 gap-12">
          
          <div className="lg:col-span-3">
            <div className="mb-8 pb-8 border-b border-slate-200">
              <span className="inline-block px-4 py-1.5 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                {job.department}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
                {job.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-wider text-slate-600">
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"><MapPin size={18} className="text-brand-500" /> {job.location}</span>
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"><Clock size={18} className="text-brand-500" /> {job.type}</span>
                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"><GraduationCap size={18} className="text-brand-500" /> {job.experience}</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                {job.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/40 lg:sticky lg:top-32">
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Apply for this role</h2>
                <p className="text-slate-500 mt-2 text-sm">Submit your portfolio and details below.</p>
              </div>

              {submitStatus ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-2xl flex items-center gap-4 ${submitStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {submitStatus.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                  <p className="font-medium">{submitStatus.message}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest pl-1">Full Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all bg-slate-50/50 text-sm font-medium" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest pl-1">Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all bg-slate-50/50 text-sm font-medium" placeholder="Enter your email address" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest pl-1">WhatsApp / Phone *</label>
                      <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all bg-slate-50/50 text-sm font-medium" placeholder="Enter your WhatsApp number" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest pl-1">
                        LinkedIn Profile <span className="text-slate-400 font-normal lowercase">(Optional)</span>
                      </label>
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all bg-slate-50/50 text-sm font-medium" placeholder="Enter your LinkedIn profile URL" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest pl-1">
                      GitHub / Portfolio <span className="text-slate-400 font-normal lowercase">(Optional)</span>
                    </label>
                    <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all bg-slate-50/50 text-sm font-medium" placeholder="Enter your GitHub or Portfolio URL" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest pl-1">Resume / CV (PDF) *</label>
                    <div 
                      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                      className={`relative w-full rounded-xl border-2 border-dashed transition-all p-6 flex flex-col items-center justify-center gap-3 cursor-pointer ${
                        dragActive ? 'border-brand-500 bg-brand-50/50' : 
                        formData.resumeUrl ? 'border-emerald-500 bg-emerald-50/20' : 
                        'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                      }`}
                      onClick={() => !formData.resumeUrl && inputRef.current.click()}
                    >
                      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleChange} />
                      
                      {uploadingResume ? (
                        <div className="flex flex-col items-center text-brand-600">
                          <Loader2 size={28} className="animate-spin mb-2" />
                          <p className="text-sm font-bold">Uploading securely...</p>
                        </div>
                      ) : formData.resumeUrl ? (
                        <div className="flex flex-col items-center text-emerald-600 w-full">
                          <CheckCircle2 size={32} className="mb-2" />
                          <p className="text-sm font-bold text-center truncate max-w-50">{resumeName}</p>
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeResume(); }} className="mt-3 flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 font-bold transition-colors">
                            <X size={14} /> Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-slate-500">
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-3 text-slate-400 group-hover:text-brand-500 transition-colors">
                            <UploadCloud size={24} />
                          </div>
                          <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                          <p className="text-xs text-slate-400 mt-1">PDF max 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest pl-1">
                      Why are you a great fit? <span className="text-slate-400 font-normal lowercase">(Optional)</span>
                    </label>
                    <textarea name="message" rows={4} value={formData.message} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all bg-slate-50/50 text-sm font-medium resize-none leading-relaxed" placeholder="Tell us why you are a great fit for this role..."></textarea>
                  </div>

                  <button type="submit" disabled={submitting || uploadingResume} className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-base hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 disabled:opacity-70 mt-6 active:scale-[0.98] flex justify-center items-center gap-2">
                    {submitting ? <><Loader2 size={20} className="animate-spin" /> Submitting...</> : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}