import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
// We will use standard fetch for now to ensure it connects to the new backend perfectly
// import { register } from '../../services/authService'; 

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      } else {
        setError(data.message || 'Registration failed');
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
          <h2 className="text-center text-3xl font-display font-bold text-slate-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-500">Sign in instead</Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text" required placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 text-sm font-medium outline-none"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                type="password" required placeholder="Password" minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 text-sm font-medium outline-none"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-white bg-slate-900 hover:bg-slate-800 font-bold transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <><UserPlus className="h-5 w-5 mr-2 text-slate-400" /> Create Account</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}