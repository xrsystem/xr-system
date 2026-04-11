import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Clock, Users, Zap, GraduationCap, ArrowRight, X, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import axios from 'axios';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const linearItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const springItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function Careers() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', portfolioUrl: '', resumeUrl: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveJobs = async () => {
      try {
        const response = await axios.get('/api/careers/jobs');
        if (response.data?.data?.jobs) {
          setJobs(response.data.data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch active jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, []);

  const handleApply = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setSubmitStatus(null);
  };

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: selectedJob.title }),
      });
      if (res.ok) {
        setSubmitStatus({ type: 'success', message: 'Application sent! We will review your portfolio.' });
        setFormData({ name: '', email: '', whatsapp: '', portfolioUrl: '', resumeUrl: '', message: '' });
        setTimeout(() => setIsApplyModalOpen(false), 3000);
      } else {
        setSubmitStatus({ type: 'error', message: 'Something went wrong.' });
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: 'Network error.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 overflow-hidden">
      <SEO title="Careers | XR System" description="Join the XR System team in Ranchi." />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-brand-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", duration: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-700 text-sm font-bold mb-6 shadow-sm"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
            </span>
            We are hiring!
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-display font-bold text-slate-900 mb-6 tracking-tight"
          >
            Build the <span className="text-brand-600">Future</span> With Us
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 font-light leading-relaxed"
          >
            No formal degrees required. Just raw talent, an eye for detail, and a hunger to build world-class software.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 relative z-10"
        >
          {[
            { icon: Zap, title: "Fast Growth", desc: "Learn 10x faster working directly with the founders." },
            { icon: GraduationCap, title: "Modern Stack", desc: "React, Node, Tailwind, and cutting-edge tech." },
            { icon: Clock, title: "Remote Friendly", desc: "Focus on output and deep work, not desk hours." },
            { icon: Users, title: "Real Impact", desc: "Your code will directly help real businesses grow." }
          ].map((item, i) => (
            <motion.div key={i} variants={springItem}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-100 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-10 pb-6 border-b border-slate-200">
            <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Open Positions</h2>
            <p className="text-brand-600 font-bold hidden md:block">{jobs.length} Roles Available</p>
          </div>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
              <p className="text-slate-500 mt-4 font-medium">Loading open positions...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-4xl border border-slate-100 text-center shadow-sm">
              <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No positions available</h3>
              <p className="text-slate-500">We are not actively hiring right now, but feel free to check back later.</p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col gap-6">
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={linearItem}
                  whileHover={{ scale: 1.01, translateX: 5 }}
                  className="bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-500" />
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="md:w-3/4">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight">{job.title}</h3>
                        <span className="px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider rounded-full">{job.department}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg"><MapPin size={14} className="text-brand-500" /> {job.location}</span>
                        <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg"><Clock size={14} className="text-brand-500" /> {job.type}</span>
                        <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg"><GraduationCap size={14} className="text-brand-500" /> {job.experience}</span>
                      </div>
                      
                      <p className="text-slate-600 text-sm leading-relaxed max-w-3xl font-medium whitespace-pre-wrap">{job.description}</p>
                    </div>
                    
                    <div className="md:w-1/4 flex md:justify-end mt-4 md:mt-0">
                      <button onClick={() => handleApply(job)} className="flex items-center justify-center gap-2 bg-brand-50 text-brand-600 px-6 py-4 rounded-2xl font-bold hover:bg-brand-600 hover:text-white transition-all w-full md:w-auto">
                        Apply Now <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setIsApplyModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 lg:p-12">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Join the Team</h2>
                    <p className="text-brand-600 font-bold mt-1">{selectedJob.title}</p>
                  </div>
                  <button onClick={() => setIsApplyModalOpen(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>

                {submitStatus ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-2xl flex items-center gap-4 ${submitStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {submitStatus.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                    <p className="font-medium">{submitStatus.message}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all" placeholder="Enter your full name" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all" placeholder="Enter your email address" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">WhatsApp</label>
                        <input type="text" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all" placeholder="Enter your WhatsApp number" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Portfolio / GitHub</label>
                        <input type="url" name="portfolioUrl" required value={formData.portfolioUrl} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all" placeholder="Enter your portfolio or GitHub URL" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Resume Link (Drive/PDF)</label>
                      <input type="url" name="resumeUrl" required value={formData.resumeUrl} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all bg-slate-50" placeholder="Paste link here..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">Why should we hire you?</label>
                      <textarea name="message" rows={3} required value={formData.message} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 outline-none transition-all resize-none" placeholder="Keep it real..."></textarea>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl bg-brand-600 text-white font-bold text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 disabled:opacity-70">
                      {submitting ? 'Sending...' : 'Submit Application'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}