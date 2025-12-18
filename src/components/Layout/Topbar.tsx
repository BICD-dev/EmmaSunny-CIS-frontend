import React from 'react';
import { Bell } from 'lucide-react';
import logo from '../../assets/logo.png';
interface TopbarProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  notificationCount?: number;
}

const Topbar: React.FC<TopbarProps> = ({
  title,
  subtitle,
  userName = 'Admin User',
  userRole = 'Administrator',
  notificationCount = 0,
}) => {
  // Get user initials
  const getUserInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white border-b border-slate-200 z-40 transition-all duration-300">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left Section - Title */}
        <div className='flex justify-center gap-5 w-fit'>
            <img src={logo} alt="Logo" width={62} height={24} />
            <span className='justify-center h-full align-center w-full'>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                )}

            </span>

        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <button className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white transition-all duration-300 group">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Profile Section */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 hover:bg-emerald-600 transition-all duration-300 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
              {getUserInitials(userName)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 group-hover:text-white transition-colors">
                {userName}
              </p>
              <p className="text-xs text-slate-500 group-hover:text-white transition-colors">
                {userRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;