import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Receipt, LogOut, Code2, Bell } from 'lucide-react';
import { AdminContext } from '../context/AdminContext'; // <-- Import kiya

export default function AdminLayout() {
  const navigate = useNavigate();
  const { unreadLeadsCount } = useContext(AdminContext); // <-- Context se count liya

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    navigate('/'); 
  };

  const menuItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'CRM & Leads', icon: <Users size={20} />, path: '/admin/crm', count: unreadLeadsCount },
    { name: 'Blog Manager', icon: <FileText size={20} />, path: '/admin/blogs' },
    { name: 'Content (CMS)', icon: <FileText size={20} />, path: '/admin/cms' },
    { name: 'Billing', icon: <Receipt size={20} />, path: '/admin/billing' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col md:flex">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-600/20">
              <Code2 size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
              XR <span className="text-brand-600">Admin</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.name}
              </div>
              {item.name === 'CRM & Leads' && item.count > 0 && (
                <div className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                  {item.count}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={20} /> Secure Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Welcome back, Admin 👋</h2>
          <div className="flex items-center gap-4">
            
            <NavLink to="/admin/crm" className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
              <Bell size={20} />
              {unreadLeadsCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </NavLink>
            
            <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-brand-200 flex items-center justify-center font-bold text-brand-700">XR</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}