import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useOfficer } from '../../hooks/useOfficer';

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
  const {data:officer, isError, isLoading, isSuccess} = useOfficer();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} />

      {/* Topbar */}
      <Topbar
        title={pageTitle}
        subtitle={pageSubtitle}
        userName={officer?.first_name + ' ' + officer?.last_name || 'Officer'}
        userRole={officer?.role || 'Role'}
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