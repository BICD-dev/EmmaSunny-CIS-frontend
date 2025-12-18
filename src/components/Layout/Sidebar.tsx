import React from 'react';
import { Activity, Users, CheckCircle, Shield } from 'lucide-react';

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
      id: 'verify',
      label: 'Verify Customers',
      icon: <CheckCircle className="w-5 h-5" />,
      href: '/verify',
    },
    {
      id: 'officers',
      label: 'Manage Officers',
      icon: <Shield className="w-5 h-5" />,
      href: '/officers',
    },
  ];

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
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 group ${
              activePage === item.id
                ? 'bg-white/15 text-white border-l-4 border-amber-500'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Footer Section (Optional) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-600">
        <div className="text-emerald-300 text-xs text-center">
          <p className="font-medium">Version 1.0.0</p>
          <p className="mt-1 opacity-75">© 2024 CIS Portal</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;