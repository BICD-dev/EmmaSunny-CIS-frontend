import React from 'react';
import { Activity, Users, CheckCircle, Shield, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage = 'dashboard' }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Activity className="w-5 h-5" />,
      href: '/dashboard',
    },
    {
      id: 'customers',
      label: 'Manage Customers',
      icon: <Users className="w-5 h-5" />,
      href: '/customers',
    },
    {
      id: 'officers',
      label: 'Manage Officers',
      icon: <Shield className="w-5 h-5" />,
      href: '/officers',
    },
    {
      id: 'product',
      label: 'Manage Products',
      icon: <ShoppingBag className="w-5 h-5" />,
      href: '/products',
    },{
      id:'activity',
      label:'View Activity logs',
      icon: <Activity className="w-5 h-5" />,
      href:"/activity"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '#/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-emerald-700 to-emerald-800 shadow-2xl z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-emerald-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <span className="text-white font-bold text-xl font-mono">CI</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">
              CIS Portal
            </h2>
            <p className="text-emerald-200 text-xs font-medium tracking-wider">
              IDENTITY SYSTEM
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 group ${
              activePage === item.id
                ? 'bg-white/15 text-white border-l-4 border-amber-500'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            
          </Link>
          
        ))}
      </nav>

      {/* Footer Section (Optional) */}
      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-600 flex flex-col items-center gap-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm shadow-lg hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
          Logout
        </button>
        <div className="text-emerald-300 text-xs text-center mt-2">
          <p className="font-medium">Version 1.0.0</p>
          <p className="mt-1 opacity-75">© 2025 CIS Portal</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;