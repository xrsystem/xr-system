import React, { useState } from 'react';
import { Briefcase, LayoutTemplate, Tag, Image as ImageIcon, Layers, Ticket } from 'lucide-react';
import CareerManager from './CareerManager'; 
import PortfolioManager from './PortfolioManager'; 
import ServiceManager from './ServiceManager';
import PricingManager from './PricingManager';
import CouponManager from './CouponManager';
import MediaManager from './MediaManager';

export default function ContentManager() {
  const [activeTab, setActiveTab] = useState('careers');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Website Content (CMS)</h2>
        <p className="text-slate-500 text-sm mt-1">Apni poori website ka content (Text, Images, Plans, Jobs) yahan se control karein.</p>
      </div>

      <div className="flex flex-wrap bg-slate-200/50 p-1 rounded-2xl w-full gap-1">
        <button onClick={() => setActiveTab('careers')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all grow sm:grow-0 justify-center ${activeTab === 'careers' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><Briefcase size={16} /> Careers & Jobs</button>
        <button onClick={() => setActiveTab('portfolio')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all grow sm:grow-0 justify-center ${activeTab === 'portfolio' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><LayoutTemplate size={16} /> Portfolio Manager</button>
        <button onClick={() => setActiveTab('services')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all grow sm:grow-0 justify-center ${activeTab === 'services' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><Layers size={16} /> Services</button>
        <button onClick={() => setActiveTab('pricing')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all grow sm:grow-0 justify-center ${activeTab === 'pricing' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><Tag size={16} /> Pricing Plans</button>
        <button onClick={() => setActiveTab('coupons')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all grow sm:grow-0 justify-center ${activeTab === 'coupons' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><Ticket size={16} /> Promo Codes</button>
        <button onClick={() => setActiveTab('media')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all grow sm:grow-0 justify-center ${activeTab === 'media' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><ImageIcon size={16} /> Media & Photos</button>
      </div>

      <div className="mt-6 bg-slate-50/50 rounded-2xl">
        {activeTab === 'careers' && <CareerManager />}
        {activeTab === 'portfolio' && <PortfolioManager />}
        {activeTab === 'services' && <ServiceManager />}
        {activeTab === 'pricing' && <PricingManager />}
        {activeTab === 'coupons' && <CouponManager />}
        {activeTab === 'media' && <MediaManager />}
      </div>
    </div>
  );
}