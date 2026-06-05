import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, Users, Zap, GraduationCap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  return (
    <div className="relative bg-slate-50 min-h-screen pt-32 pb-24 overflow-hidden z-0">
      <SEO title="Careers | XR System" description="Join the XR System team in Ranchi." />
      
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[24px_24px] opacity-40"></div>
        <div className="absolute top-0 -left-40 w-150 h-150 bg-brand-300/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 -right-40 w-150 h-150 bg-indigo-400/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">

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
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 border border-white shadow-sm">
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-10 pb-6 border-b border-slate-200/80">
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
                  whileHover={{ scale: 1.01 }}
                  className="bg-white p-6 md:p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 group relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-500" />
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors tracking-tight">{job.title}</h3>
                      <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[11px] font-bold uppercase tracking-widest rounded-full">{job.department}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                      <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg"><MapPin size={14} className="text-brand-500" /> {job.location}</span>
                      <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg"><Clock size={14} className="text-brand-500" /> {job.type}</span>
                      <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg"><GraduationCap size={14} className="text-brand-500" /> {job.experience}</span>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed max-w-2xl font-medium line-clamp-2">{job.description}</p>
                  </div>
                  
                  <div className="shrink-0 mt-2 md:mt-0 relative z-10">
                    <Link to={`/careers/${job._id}`} className="flex items-center justify-center gap-2 bg-brand-50 text-brand-600 px-7 py-4 rounded-xl font-bold hover:bg-brand-600 hover:text-white transition-all w-full md:w-auto shadow-sm">
                      View Role <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}