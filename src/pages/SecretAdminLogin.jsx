import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code2, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import SEO from '../components/SEO';

export default function SecretAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        navigate('/admin/dashboard'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <SEO title="Admin Portal" description="Secure admin login for XR System" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-4 group cursor-pointer no-underline">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-600/30 transition-all duration-300 group-hover:scale-110">
              <Code2 size={30} strokeWidth={2.5} />
            </div>
            <span className="text-4xl font-display font-bold text-slate-950 tracking-tight">
              XR <span className="text-brand-600">System</span>
            </span>
          </Link>
        </div>
        
        <h2 className="mt-2 text-center text-4xl font-extrabold text-slate-950 tracking-tight">
          Admin Portal
        </h2>
        
        <div className="mt-3 flex justify-center">
          <span className="text-xs font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full">
            Restricted Access
          </span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-slate-50 py-10 px-6 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {error && (
             <div className="mb-6 p-4 rounded-xl text-sm font-bold bg-red-50 text-red-600 border border-red-100 flex items-center gap-2">
               <Lock size={16} /> {error}
             </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-600">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all text-slate-950 font-medium placeholder-slate-400"
                  placeholder="admin@xrsystem.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-600">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all text-slate-950 font-medium placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-600/30 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 transition-all active:scale-[0.98]"
            >
              {loading ? (
                 <span className="flex items-center gap-2">
                   <Loader2 className="animate-spin" size={20} />
                   Authenticating...
                 </span>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}