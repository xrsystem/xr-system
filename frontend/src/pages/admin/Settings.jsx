import React, { useState } from 'react';
import { 
  Save, Building2, Palette, CreditCard, Bell, 
  Mail, Image as ImageIcon, Check, Eye, EyeOff
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showSecret, setShowSecret] = useState(false);

  // Settings Navigation
  const settingTabs = [
    { id: 'general', label: 'Company Info', icon: Building2 },
    { id: 'theme', label: 'Theme & Branding', icon: Palette },
    { id: 'payment', label: 'Payment Gateways', icon: CreditCard },
    { id: 'notifications', label: 'Webhooks & Alerts', icon: Bell },
    { id: 'email', label: 'Email & SMTP', icon: Mail },
  ];

  return (
    <div className="space-y-6">
      
      {/* 🚀 HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Global Settings</h1>
          <p className="text-sm text-slate-500 font-medium">Manage platform configurations, integrations, and branding.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20">
          <Save size={18} /> Save Settings
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* 📑 SETTINGS SIDEBAR */}
        <div className="w-full md:w-64 shrink-0 bg-white border border-slate-200 rounded-2xl shadow-sm p-3 flex md:flex-col overflow-x-auto md:overflow-visible gap-1 custom-scrollbar">
          {settingTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap w-full text-left ${
                activeTab === tab.id 
                  ? 'bg-brand-50 text-brand-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ⚙️ SETTINGS CONTENT AREA */}
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 min-h-125">
          
          {/* --- 1. GENERAL SETTINGS --- */}
          {activeTab === 'general' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Company Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                  <input type="text" defaultValue="XR System" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Platform Domain</label>
                  <input type="text" defaultValue="xrsystem.in" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Support Email (Public)</label>
                  <input type="email" defaultValue="xrsystem.official@gmail.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Official Email</label>
                  <input type="email" defaultValue="connect@xrsystem.in" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Registered Address</label>
                <textarea rows="3" defaultValue="Lower Burdwan Compound, Ranchi, Jharkhand, India" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-500 outline-none resize-none" />
              </div>
            </div>
          )}

          {/* --- 2. THEME & BRANDING --- */}
          {activeTab === 'theme' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Theme & Branding</h2>
              
              <div className="flex items-center gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Logo</label>
                  <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center relative group">
                    <span className="font-bold text-2xl text-slate-400">XR</span>
                    <button className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity rounded-xl">
                      <ImageIcon size={16} className="mb-1" /> Change
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" defaultValue="#4f46e5" className="w-10 h-10 rounded cursor-pointer" />
                    <input type="text" defaultValue="#4f46e5" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium uppercase outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Platform Font</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none cursor-pointer">
                    <option>Inter & Outfit (Default)</option>
                    <option>Roboto</option>
                    <option>Poppins</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* --- 3. PAYMENT GATEWAYS --- */}
          {activeTab === 'payment' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Payment Integration</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Currency Default</label>
                <select className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none cursor-pointer mb-6">
                  <option>INR (₹) - Indian Rupee</option>
                  <option>USD ($) - US Dollar</option>
                </select>
              </div>

              <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><CreditCard size={18} className="text-brand-600"/> Razorpay Setup</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={12}/> Connected</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Key ID</label>
                  <input type="text" defaultValue="rzp_live_xxxxxxxxxxxxx" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Key Secret</label>
                  <div className="relative">
                    <input type={showSecret ? "text" : "password"} defaultValue="xxxxxxxxxxxxxxxxxxxx" className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none" />
                    <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Official UPI ID (Manual Payments)</label>
                <input type="text" defaultValue="xrsystem@ybl" className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" />
              </div>
            </div>
          )}

          {/* --- 4. NOTIFICATIONS & WEBHOOKS --- */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Notifications & Webhooks</h2>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Discord Webhook URL</label>
                <p className="text-xs text-slate-500 mb-2">Used for sending immediate alerts (New Tickets, Subscriptions) to your team's Discord server.</p>
                <input type="text" placeholder="https://discord.com/api/webhooks/..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-500 outline-none" />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">System Alert Triggers</h3>
                
                {[
                  { title: 'New Client Signups', desc: 'Alert when a new client registers.' },
                  { title: 'Invoice Payments', desc: 'Alert when an invoice is successfully paid via Razorpay.' },
                  { title: 'Support Tickets', desc: 'Alert when a client raises a new support ticket.' }
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{alert.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{alert.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5. EMAIL & SMTP --- */}
          {activeTab === 'email' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Email SMTP Config (Nodemailer)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">SMTP Host</label>
                  <input type="text" defaultValue="smtp.gmail.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">SMTP Port</label>
                  <input type="number" defaultValue="465" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Auth User (Email)</label>
                  <input type="email" defaultValue="connect@xrsystem.in" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">App Password</label>
                  <input type="password" defaultValue="**********" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-2">Welcome Email Template</label>
                <textarea rows="4" defaultValue="Welcome to XR System! We are thrilled to have you onboard." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none resize-none" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}