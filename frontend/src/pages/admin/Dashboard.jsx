import React from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Ticket, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

// --- MOCK DATA (Jab API banegi tab ye backend se aayega) ---
const kpiData = [
  { title: 'Total Revenue', value: '₹12.4L', change: '+18.2%', isPositive: true, icon: IndianRupee },
  { title: 'MRR', value: '₹89.9K', change: '+12.5%', isPositive: true, icon: TrendingUp },
  { title: 'Active Projects', value: '12', change: '+4 new', isPositive: true, icon: Briefcase },
  { title: 'Active Clients', value: '28', change: '-2 churned', isPositive: false, icon: Users },
  { title: 'Open Tickets', value: '3', change: '2 SLA due', isPositive: false, icon: Ticket },
];

const revenueData = [
  { name: 'Sep', revenue: 150000, subscriptions: 40000 },
  { name: 'Oct', revenue: 220000, subscriptions: 45000 },
  { name: 'Nov', revenue: 180000, subscriptions: 48000 },
  { name: 'Dec', revenue: 290000, subscriptions: 55000 },
  { name: 'Jan', revenue: 240000, subscriptions: 60000 },
  { name: 'Feb', revenue: 310000, subscriptions: 65000 },
  { name: 'Mar', revenue: 380000, subscriptions: 72000 },
];

const recentActivity = [
  { id: 1, text: 'New ticket — Priya Gupta raised Bug #041', time: '1 hour ago', type: 'ticket' },
  { id: 2, text: 'AutoPay failed — Client: TechEdge India', time: '2 hours ago', type: 'error' },
  { id: 3, text: 'New subscription — SM Healthcare Pro Plan', time: '3 hours ago', type: 'success' },
  { id: 4, text: 'New contact query — Rohit Kumar', time: '5 hours ago', type: 'info' },
];
// -------------------------------------------------------------

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* 🚀 HEADER & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
            View Reports
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20">
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      {/* 📊 KPI CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
              <div className="p-2 bg-slate-50 rounded-lg text-brand-600">
                <kpi.icon size={18} />
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">{kpi.value}</h3>
            <div className={`flex items-center gap-1 text-xs font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 📈 CHARTS & ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart (Takes 2/3 space on large screens) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Revenue Overview</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Project payments vs Subscriptions</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 font-medium outline-none focus:border-brand-500 cursor-pointer">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="revenue" name="Project Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line type="monotone" dataKey="subscriptions" name="Subscriptions (MRR)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <Activity size={18} />
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="relative pl-6 before:absolute before:left-2.75 before:top-2 before:-bottom-6 before:w-0.5 before:bg-slate-100 last:before:hidden">
                {/* Status Dot */}
                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white z-10 ${
                  activity.type === 'ticket' ? 'bg-amber-500' :
                  activity.type === 'error' ? 'bg-rose-500' :
                  activity.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                }`}></div>
                
                <p className="text-sm text-slate-700 font-medium leading-snug">{activity.text}</p>
                <span className="text-xs text-slate-400 font-medium mt-1 inline-block">{activity.time}</span>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full py-2.5 text-sm font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors">
            View All Activity
          </button>
        </div>

      </div>
    </div>
  );
}