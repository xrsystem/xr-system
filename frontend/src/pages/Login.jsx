import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // We will wire this up next!

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); 

  // Check if they were just redirected here from registration
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Pass the token and user data to your AuthContext
        login(data.user, data.accessToken);
        
        // Smart RBAC Routing
        if (data.user.role === 'SUPER_ADMIN') navigate('/admin');
        else if (data.user.role === 'PROJECT_ADMIN') navigate('/project-admin');
        else if (data.user.role === 'TEAM') navigate('/team');
        else if (data.user.isClient) navigate('/client');
        else navigate('/user-home'); // Standard users awaiting client approval
        
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-4xl shadow-xl border border-slate-100">
        <div>
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">XR</div>
          <h2 className="text-center text-3xl font-display font-bold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-500">Create one now</Link>
          </p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
            <p className="text-sm font-bold text-emerald-800">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email" required placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 text-sm font-medium outline-none"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password" required placeholder="Password"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 text-sm font-medium outline-none"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white bg-brand-600 hover:bg-brand-700 font-bold transition-all disabled:opacity-50 shadow-lg shadow-brand-600/20"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <><LogIn className="h-5 w-5 mr-2 text-brand-200" /> Sign In</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}