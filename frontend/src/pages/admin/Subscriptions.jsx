import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  Download, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle,
  AlertCircle,
  Filter,
  Plus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- MOCK DATA ---
const mrrData = [
  { month: 'Oct', mrr: 45000 },
  { month: 'Nov', mrr: 48000 },
  { month: 'Dec', mrr: 55000 },
  { month: 'Jan', mrr: 60000 },
  { month: 'Feb', mrr: 65000 },
  { month: 'Mar', mrr: 89900 },
];

const mockTransactions = [
  { id: 'INV-2026-001', client: 'TechEdge India', type: 'Project Milestone', amount: '₹50,000', status: 'Paid', date: '20 Mar 2026', plan: '-' },
  { id: 'INV-2026-002', client: 'SM Healthcare', type: 'Subscription', amount: '₹4,999', status: 'Paid', date: '19 Mar 2026', plan: 'Pro Plan' },
  { id: 'INV-2026-003', client: 'RK Group', type: 'Project Handover', amount: '₹25,000', status: 'Pending', date: '18 Mar 2026', plan: '-' },
  { id: 'INV-2026-004', client: 'FinServe Financial', type: 'Subscription', amount: '₹9,999', status: 'Failed', date: '15 Mar 2026', plan: 'Premium Plan' },
  { id: 'INV-2026-005', client: 'GreenEarth Co.', type: 'Subscription', amount: '₹1,999', status: 'Paid', date: '10 Mar 2026', plan: 'Basic Plan' },
];

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesTab = 
      activeTab === 'All' || 
      (activeTab === 'Subscriptions' && txn.type === 'Subscription') ||
      (activeTab === 'Projects' && txn.type.includes('Project')) ||
      (activeTab === 'Pending' && txn.status === 'Pending');
      
    const matchesSearch = txn.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          txn.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Paid': return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <CheckCircle2 size={14} className="text-emerald-500" /> };
      case 'Pending': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: <Clock size={14} className="text-amber-500" /> };
      case 'Failed': return { bg: 'bg-rose-50', text: 'text-rose-700', icon: <XCircle size={14} className="text-rose-500" /> };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', icon: null };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 🚀 HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Revenue & Finance</h1>
          <p className="text-sm text-slate-500 font-medium">Track subscriptions, project payments, and outstanding dues.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={18} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20">
            <Plus size={18} /> Manual Invoice
          </button>
        </div>
      </div>

      {/* 📊 FINANCIAL KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly Recurring (MRR)</p>
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-1">₹89.9K</h3>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> +12.5% vs last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Annual Run Rate (ARR)</p>
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-1">₹10.7L</h3>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><TrendingUp size={12}/> Projected</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden ring-1 ring-amber-500/10">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full opacity-50"></div>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Outstanding Dues</p>
          <h3 className="text-2xl font-display font-bold text-amber-900 mb-1">₹1.25L</h3>
          <p className="text-xs font-bold text-amber-600 flex items-center gap-1"><AlertCircle size={12}/> Across 4 clients</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lifetime Collected</p>
          <h3 className="text-2xl font-display font-bold text-brand-600 mb-1">₹24.5L</h3>
          <p className="text-xs font-bold text-slate-400">Total revenue generated</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📈 MRR GROWTH CHART */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">MRR Growth</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Last 6 months subscription revenue</p>
          </div>
          <div className="flex-1 min-h-50 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'MRR']}
                />
                <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📋 TRANSACTIONS TABLE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Table Header / Filters */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto custom-scrollbar">
              {['All', 'Subscriptions', 'Projects', 'Pending'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab 
                      ? 'bg-white text-brand-600 shadow-sm border border-slate-200' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search invoice or client..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Invoice Details</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Amount</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn) => {
                    const statusStyle = getStatusStyles(txn.status);
                    return (
                      <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-3">
                          <p className="font-bold text-slate-900">{txn.client}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-brand-600 font-semibold">{txn.id}</span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-500 font-medium">{txn.date}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <p className="font-bold text-slate-900">{txn.amount}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{txn.type} {txn.plan !== '-' && `(${txn.plan})`}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.icon} {txn.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 rounded-lg transition-all shadow-sm">
                            <FileText size={14} /> PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Filter size={24} className="text-slate-300 mb-2" />
                        <p className="text-sm font-medium">No transactions found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}