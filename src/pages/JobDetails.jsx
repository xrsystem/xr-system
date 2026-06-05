import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Clock, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import axios from 'axios';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', portfolioUrl: '', resumeUrl: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await axios.post('/api/careers', { 
        ...formData, 
        role: job.title 
      });
      
      if (res.status === 200 || res.status === 201) {
        setSubmitStatus({ type: 'success', message: 'Application sent! We will review your portfolio.' });
        setFormData({ name: '', email: '', whatsapp: '', portfolioUrl: '', resumeUrl: '', message: '' });
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
        <button onClick={() => navigate('/careers')} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700">
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
                <span className="flex items-center gap-2"><MapPin size={18} className="text-brand-500" /> {job.location}</span>
                <span className="flex items-center gap-2"><Clock size={18} className="text-brand-500" /> {job.type}</span>
                <span className="flex items-center gap-2"><GraduationCap size={18} className="text-brand-500" /> {job.experience}</span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                {job.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/40 sticky top-32">
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
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Full Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all bg-slate-50/50" placeholder="Enter your full name" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all bg-slate-50/50" placeholder="Enter your email address" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">WhatsApp</label>
                      <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all bg-slate-50/50" placeholder="Number" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Portfolio Link</label>
                      <input type="url" name="portfolioUrl" required value={formData.portfolioUrl} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all bg-slate-50/50" placeholder="URL" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Resume Link (Drive/PDF)</label>
                    <input type="url" name="resumeUrl" required value={formData.resumeUrl} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all bg-slate-50/50" placeholder="Paste link here..." />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Why should we hire you?</label>
                    <textarea name="message" rows={3} required value={formData.message} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all bg-slate-50/50 resize-none" placeholder="Keep it real..."></textarea>
                  </div>
                  
                  <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 disabled:opacity-70 mt-4">
                    {submitting ? 'Sending...' : 'Submit Application'}
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