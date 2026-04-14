import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Receipt, LogOut, Code2, Bell, Menu, X } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { unreadLeadsCount } = useContext(AdminContext);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 
        w-72 bg-white border-r border-slate-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-600/20">
              <Code2 size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">
              XR <span className="text-brand-600">Admin</span>
            </span>
          </div>
          
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
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

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut size={20} /> Secure Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-600 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-slate-800 truncate">Welcome back 👋</h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <NavLink to="/admin/crm" className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
              <Bell size={20} />
              {unreadLeadsCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </NavLink>
            <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-brand-200 flex items-center justify-center font-bold text-brand-700">XR</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}