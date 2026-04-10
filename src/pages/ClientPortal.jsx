import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Mail, Loader2, Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import SEO from '../components/SEO';

export default function ClientPortal() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/auth/portal-login', { email });
      if (response.data?.success) {
        setSuccess("Link sent! Check your inbox to access your dashboard.");
        setEmail('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email not found. Please ensure you have an active project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <SEO title="Client Portal" description="Access your XR System client dashboard" />
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex justify-center items-center gap-3 group no-underline mb-6"
        >
          <motion.div 
            className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-600/30"
            whileHover={{ 
              scale: 1.1, 
              rotate: 12
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Code2 size={26} strokeWidth={2.5} />
          </motion.div>
          
          <span className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            XR <span className="text-brand-600 group-hover:text-brand-400 transition-colors">System</span>
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Client Portal</h2>
        <p className="mt-3 text-sm text-slate-500 font-medium max-w-sm mx-auto px-4">
          Enter your registered email address to receive a secure link to your project dashboard.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-4xl sm:px-10 border border-slate-100 relative">
          
          <AnimatePresence mode="wait">
            {error && (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-6 p-4 rounded-xl text-sm font-medium bg-red-50 text-red-600 border border-red-100">
                 {error}
               </motion.div>
            )}
            {success && (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-6 p-4 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-start gap-2">
                 <Send size={18} className="mt-0.5 shrink-0" /> {success}
               </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 text-slate-900 font-medium placeholder-slate-400 transition-all" 
                  placeholder="Enter your registered email " 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-600/30 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70 transition-all active:scale-[0.98]">
              {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Sending...</span> : 'Send Dashboard Link'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Need Help?</span>
            <a 
              href="https://wa.me/919110047180" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-3 flex items-center justify-center gap-2 text-emerald-500 hover:text-emerald-600 transition-colors text-sm font-medium"
            >
              <MessageCircle size={18} />
              Chat with Project Manager
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}