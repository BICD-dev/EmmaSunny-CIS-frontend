import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
  activePage?: string;
  pageTitle: string;
  pageSubtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage = 'dashboard',
  pageTitle,
  pageSubtitle,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} />

      {/* Topbar */}
      <Topbar
        title={pageTitle}
        subtitle={pageSubtitle}
        userName="Admin User"
        userRole="Administrator"
        notificationCount={3}
      />

      {/* Main Content Area */}
      <main className="ml-34 mt-10 p-2 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;