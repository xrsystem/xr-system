import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Loader2, Inbox, Briefcase, RefreshCcw, Tag, CheckCircle2 } from 'lucide-react';
import axios from 'axios'; 

export default function CrmLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox'); 
  const [searchTerm, setSearchTerm] = useState('');

  const getAuthConfig = () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true 
    };
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('/api/leads', getAuthConfig());
        if (response.data && response.data.data && response.data.data.leads) {
          const formattedLeads = response.data.data.leads.map(lead => ({
            ...lead,
            service: lead.service || 'General Inquiry',
            status: lead.status || 'New Lead',
            portalAccess: lead.portalAccess || false,
            isUnread: lead.isRead !== true 
          }));
          setLeads(formattedLeads);
        }
      } catch (error) {
        console.error("API Error - Leads fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.service && lead.service.toLowerCase().includes(searchTerm.toLowerCase()));
      
    if (!matchesSearch) return false;

    const isSubscription = lead.service.toLowerCase().includes('care') || lead.service.toLowerCase().includes('seo') || lead.service.toLowerCase().includes('marketing');
    const isNew = lead.status === 'New Lead' || lead.service === 'General Inquiry';

    if (activeTab === 'inbox') return isNew;
    if (activeTab === 'subs') return isSubscription && !isNew;
    if (activeTab === 'active') return !isSubscription && !isNew;
    return true;
  });

  const togglePortalAccess = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setLeads(leads.map(lead => lead._id === id ? { ...lead, portalAccess: newStatus } : lead));
    try {
      await axios.patch(`/api/leads/${id}/portal-access`, { portalAccess: newStatus }, getAuthConfig());
    } catch (error) {
      setLeads(leads.map(lead => lead._id === id ? { ...lead, portalAccess: currentStatus } : lead));
    }
  };

  const markAsRead = async (id) => {
    setLeads(leads.map(lead => lead._id === id ? { ...lead, isUnread: false } : lead));
    try { await axios.patch(`/api/leads/${id}/read`, {}, getAuthConfig()); } 
    catch (error) { console.error("Failed to mark as read"); }
  };

  const handleStatusChange = async (id, newStatus) => {
    setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus, isUnread: false } : lead));
    try {
      await axios.patch(`/api/leads/${id}/status`, { status: newStatus }, getAuthConfig());
      await axios.patch(`/api/leads/${id}/read`, {}, getAuthConfig());
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New Lead': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Discussion': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Proposal Sent': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'In Progress': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">CRM & Leads</h2>
          <p className="text-slate-500 text-sm mt-1">Manage inquiries, active projects, and subscriptions.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" 
          />
        </div>
      </div>

      <div className="flex flex-wrap bg-slate-200/50 p-1 rounded-2xl w-full sm:w-fit gap-1">
        <button onClick={() => setActiveTab('inbox')} className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none justify-center ${activeTab === 'inbox' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><Inbox size={16} /> Inbox</button>
        <button onClick={() => setActiveTab('active')} className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none justify-center ${activeTab === 'active' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><Briefcase size={16} /> Active</button>
        <button onClick={() => setActiveTab('subs')} className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none justify-center ${activeTab === 'subs' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><RefreshCcw size={16} /> Subs</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-250">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Client Details</th>
                <th className="px-6 py-4">Service Required</th>
                <th className="px-6 py-4">Project Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4 text-center">Portal Access</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center"><Loader2 className="h-8 w-8 animate-spin text-brand-600 mx-auto" /></td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">No records found matching "{searchTerm}" in this category.</td></tr>
              ) : (
                filteredLeads.map((lead) => {
                  const hasPromo = lead.message && lead.message.includes('[💸 PROMO APPLIED:');
                  return (
                    <tr key={lead._id} className={`transition-colors ${lead.isUnread ? 'bg-brand-50/40' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900">{lead.name}</p>
                          {lead.isUnread && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">New</span>}
                        </div>
                        <p className="text-slate-500 text-xs mt-0.5">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4"><p className="text-slate-700 font-medium">{lead.service}</p></td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">₹{lead.price ? lead.price.toLocaleString() : '0'}</div>
                        {hasPromo && <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase"><Tag size={10} /> Promo Applied</div>}
                      </td>
                      
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none text-center shadow-sm transition-all ${getStatusColor(lead.status)}`}
                        >
                          <option value="New Lead">New Lead</option>
                          <option value="Discussion">Discussion</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-slate-900 font-medium text-xs">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {new Date(lead.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button onClick={() => togglePortalAccess(lead._id, lead.portalAccess)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${lead.portalAccess ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${lead.portalAccess ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {lead.isUnread && (
                            <button onClick={() => markAsRead(lead._id)} title="Mark as Read" className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors inline-flex">
                              <CheckCircle2 className="h-5 w-5" />
                            </button>
                          )}
                          {lead.notionPageId && (
                             <a href={`https://www.notion.so/${lead.notionPageId.replace(/-/g, '')}`} target="_blank" rel="noopener noreferrer" title="View in Notion" className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors inline-flex"><ExternalLink className="h-5 w-5" /></a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}