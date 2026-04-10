import React, { useState, useEffect } from 'react';
import { Users, Briefcase, IndianRupee, TrendingUp, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeProjects: 0,
    totalRevenue: 0,
    recentLeads: [],
    revenueData: [],
    statusData: []
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` }, withCredentials: true };
        
        const response = await axios.get('/api/leads', config);
        if (response.data?.data?.leads) {
          const leads = response.data.data.leads;
          
          const totalLeads = leads.length;
          const activeProjects = leads.filter(l => ['Discussion', 'Proposal Sent', 'In Progress'].includes(l.status)).length;
          
          const totalRevenue = leads
            .filter(l => l.status !== 'Lost')
            .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

          const monthlyRevenue = {};
          const statusCount = {};

          leads.forEach(lead => {
            const stat = lead.status || 'New Lead';
            statusCount[stat] = (statusCount[stat] || 0) + 1;

            if (lead.status !== 'Lost' && lead.price) {
              const date = new Date(lead.createdAt);
              const month = date.toLocaleString('default', { month: 'short' });
              monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(lead.price);
            }
          });

          const revenueData = Object.keys(monthlyRevenue).map(month => ({
            month, 
            revenue: monthlyRevenue[month]
          }));

          const statusData = Object.keys(statusCount).map(name => ({
            name, 
            value: statusCount[name]
          }));

          setStats({
            totalLeads,
            activeProjects,
            totalRevenue,
            recentLeads: leads.slice(0, 5),
            revenueData,
            statusData
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>;
  }

  const formatCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Here is what's happening with your business today.</p>
      </div>

      { }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-bold tracking-widest uppercase">Total Revenue</h3>
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><IndianRupee size={20} /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-display font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</h2>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
              <TrendingUp size={14} /> <span>All-time earnings</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-bold tracking-widest uppercase">Active Projects</h3>
              <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center"><Briefcase size={20} /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-display font-bold text-slate-900">{stats.activeProjects}</h2>
            </div>
            <div className="flex items-center gap-1 text-brand-600 text-xs font-bold mt-2">
              <ArrowUpRight size={14} /> <span>Currently in pipeline</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-bold tracking-widest uppercase">Total Leads</h3>
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Users size={20} /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-display font-bold text-slate-900">{stats.totalLeads}</h2>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mt-2">
              <ArrowUpRight size={14} className="text-emerald-500" /> <span>Since launch</span>
            </div>
          </div>
        </div>
      </div>

      {   }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Revenue Growth (Monthly)</h3>
          <div className="h-72 w-full">
            {stats.revenueData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">No revenue data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        { }
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Lead Pipeline</h3>
          <div className="h-72 w-full">
            {stats.statusData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">No leads data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Lead Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {stats.recentLeads.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No recent activity found.</div>
          ) : (
            stats.recentLeads.map((lead, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${lead.status === 'New Lead' ? 'bg-blue-100 text-blue-600' : lead.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-100 text-brand-600'}`}>
                    {lead.status === 'Completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.service} • {new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₹{lead.price?.toLocaleString() || 0}</p>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{lead.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}