import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import SEO from '../components/SEO';
import axios from 'axios';

export default function Contact() {
  const [formState, setFormState] = useState({ 
    name: '', 
    email: '', 
    whatsapp: '', 
    service: 'General Inquiry', 
    message: '' 
  });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formState.email)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }
    setErrors({});
    setStatus('loading');
    
    try {
      const res = await axios.post('/api/leads', { 
        ...formState, 
        source: 'contact' 
      });
      
      if (res.status === 200 || res.status === 201) {
        setStatus('success');
        setFormState({ name: '', email: '', whatsapp: '', service: 'General Inquiry', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Contact form error:', err.response?.data || err.message);
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6">
      <SEO 
        title="Contact Us" 
        description="Get in touch with XR System for a free quote on your next software project." 
      />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          
          <div>
            <h1 className="text-5xl lg:text-7xl mb-8">Let's <span className="text-brand-600">Connect</span></h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Have a project in mind, need a logo, or just want to say hi? We'd love to hear from you.
            </p>

            <div className="space-y-8">
              {[
                { icon: <Mail size={24} />, title: 'Email Us', value: 'connect@xrsystem.in' },
                { icon: <Phone size={24} />, title: 'Call Us', value: '+91 9110047180' },
                { icon: <MapPin size={24} />, title: 'Visit Us', value: 'Lower Burdwan Compound, Lalpur, Ranchi, 834001, Jharkhand.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-xl font-semibold text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 rounded-4xl overflow-hidden h-64 bg-slate-100 border border-slate-200">
              <iframe
                src="https://maps.app.goo.gl/RWoqLtS6cjxLgPPh9"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="bg-slate-50 p-10 lg:p-16 rounded-[3rem] border border-slate-100">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl mb-4">Message Sent!</h3>
                <p className="text-slate-600 mb-8">Thank you for reaching out. Our team will contact you shortly.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-700 transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formState.name}
                      onChange={e => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={e => {
                        setFormState({ ...formState, email: e.target.value });
                        if (errors.email) setErrors({});
                      }}
                      className={cn(
                        "w-full bg-white border rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                        errors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-brand-500"
                      )}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">WhatsApp Number</label>
                    <input
                      required
                      type="text"
                      value={formState.whatsapp}
                      onChange={e => setFormState({ ...formState, whatsapp: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      placeholder="WhatsApp number"
                    />
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">How can we help?</label>
                    <div className="relative">
                      <select
                        required
                        value={formState.service}
                        onChange={e => setFormState({ ...formState, service: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="UI/UX & Logo Design">Logo & Design Work</option>
                        <option value="Website Development">Website Development</option>
                        <option value="Custom Software">Custom Software</option>
                        <option value="SEO & Marketing">SEO & Marketing</option>
                      </select>
                      <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                    placeholder="Tell us a little about your project or inquiry..."
                  ></textarea>
                </div>

                <button
                  disabled={status === 'loading'}
                  className="w-full bg-brand-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}