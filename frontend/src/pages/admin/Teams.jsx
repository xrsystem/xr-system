import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Briefcase, 
  Mail, 
  ShieldCheck,
  UserPlus
} from 'lucide-react';

// --- MOCK DATA ---
const mockTeams = [
  {
    id: 'TM-01',
    name: 'Frontend Squad',
    department: 'Engineering',
    activeProjects: 3,
    leader: { name: 'JS Mahato', initials: 'JS', color: 'bg-brand-600 text-white' },
    members: [
      { name: 'Rahul V.', initials: 'RV', color: 'bg-blue-100 text-blue-700' },
      { name: 'Amit P.', initials: 'AP', color: 'bg-emerald-100 text-emerald-700' },
      { name: 'Neha S.', initials: 'NS', color: 'bg-amber-100 text-amber-700' },
    ],
    totalMembers: 4
  },
  {
    id: 'TM-02',
    name: 'Design Masters',
    department: 'Design',
    activeProjects: 2,
    leader: { name: 'Priya Gupta', initials: 'PG', color: 'bg-purple-600 text-white' },
    members: [
      { name: 'Karan M.', initials: 'KM', color: 'bg-rose-100 text-rose-700' },
      { name: 'Sneha D.', initials: 'SD', color: 'bg-cyan-100 text-cyan-700' },
    ],
    totalMembers: 3
  },
  {
    id: 'TM-03',
    name: 'Backend Core',
    department: 'Engineering',
    activeProjects: 4,
    leader: { name: 'SK Nayak', initials: 'SK', color: 'bg-brand-600 text-white' },
    members: [
      { name: 'Vikram S.', initials: 'VS', color: 'bg-indigo-100 text-indigo-700' },
      { name: 'Rohan T.', initials: 'RT', color: 'bg-fuchsia-100 text-fuchsia-700' },
      { name: 'Pooja K.', initials: 'PK', color: 'bg-orange-100 text-orange-700' },
      { name: 'Arjun L.', initials: 'AL', color: 'bg-lime-100 text-lime-700' },
    ],
    totalMembers: 6
  },
  {
    id: 'TM-04',
    name: 'Marketing & SEO',
    department: 'Marketing',
    activeProjects: 1,
    leader: { name: 'Anita D.', initials: 'AD', color: 'bg-pink-600 text-white' },
    members: [
      { name: 'Ravi J.', initials: 'RJ', color: 'bg-teal-100 text-teal-700' },
    ],
    totalMembers: 2
  }
];

export default function Teams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  // Filter Logic
  const filteredTeams = mockTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          team.leader.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || team.department === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* 🚀 HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Teams Management</h1>
          <p className="text-sm text-slate-500 font-medium">Organize your workforce and assign team leaders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20">
          <Plus size={18} /> Create Team
        </button>
      </div>

      {/* 🔍 FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-100 w-full md:w-auto overflow-x-auto custom-scrollbar">
          {['All', 'Engineering', 'Design', 'Marketing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                filter === tab 
                  ? 'bg-white text-brand-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search teams or leaders..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>

      {/* 📇 TEAMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div key={team.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group relative flex flex-col h-full">
              
              {/* Options Menu */}
              <button className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={18} />
              </button>

              {/* Team Header */}
              <div className="mb-5 pr-6">
                <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-widest mb-2">
                  {team.department}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{team.name}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1.5">
                  <Briefcase size={14} className="text-brand-500" /> {team.activeProjects} Active Projects
                </p>
              </div>

              {/* Team Leader */}
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Team Leader</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${team.leader.color}`}>
                    {team.leader.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{team.leader.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                      <ShieldCheck size={10} className="text-emerald-500"/> Project Admin
                    </p>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="mt-auto pt-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Members ({team.totalMembers})</p>
                </div>
                
                <div className="flex items-center justify-between">
                  {/* Overlapping Avatars */}
                  <div className="flex -space-x-2 overflow-hidden">
                    {team.members.slice(0, 3).map((member, idx) => (
                      <div 
                        key={idx} 
                        className={`inline-block w-8 h-8 rounded-full ring-2 ring-white items-center justify-center text-[10px] font-bold ${member.color}`}
                        title={member.name}
                      >
                        {member.initials}
                      </div>
                    ))}
                    {team.totalMembers > 4 && (
                      <div className="inline-block w-8 h-8 rounded-full ring-2 ring-white bg-slate-100 items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                        +{team.totalMembers - 4}
                      </div>
                    )}
                  </div>
                  
                  {/* Add Member Button */}
                  <button className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-400 hover:bg-brand-50 transition-colors" title="Add Member">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No teams found</h3>
            <p className="text-sm text-slate-500 mt-1">Adjust your filters or create a new team.</p>
          </div>
        )}
      </div>

    </div>
  );
}