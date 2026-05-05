import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Users, UserPlus, LogOut, ShieldCheck, Briefcase } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Signup Requests', icon: UserPlus },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex bg-surface-main text-slate-200 font-sans selection:bg-neon-green/30">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-surface-card border-b border-slate-800 flex items-center justify-between px-4 z-40 md:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-neon-green" />
          <span className="font-bold text-lg text-white tracking-tight">DRC<span className="text-neon-green">Admin</span></span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface-card border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <ShieldCheck className="text-neon-green mr-2" />
            <span className="font-bold text-xl text-white tracking-tight">DRC<span className="text-neon-green">Admin</span></span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id as ViewState);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${currentView === item.id 
                    ? 'bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(74,222,128,0.1)] border border-neon-green/20' 
                    : 'text-slate-400 hover:bg-surface-hover hover:text-white'
                  }
                `}
              >
                <item.icon size={18} className={`mr-3 ${currentView === item.id ? 'text-neon-green' : 'text-slate-500 group-hover:text-white'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={onLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 overflow-y-auto">
        <div className="w-full p-4 md:p-6 xl:p-8 max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
