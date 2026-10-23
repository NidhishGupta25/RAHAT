import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPageView } from './views/LandingPageView';
import { LoginPage } from './components/auth/LoginPage';
import { WarehouseDashboardView } from './views/warehouse/WarehouseDashboardView';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { OverviewView } from './views/OverviewView';
import { MonitoringView } from './views/MonitoringView';
import { LiveMapView } from './views/LiveMapView';
import { ReliefAllocationView } from './views/ReliefAllocationView';
import { WarehousesView } from './views/WarehousesView';
import { DataModelsView } from './views/DataModelsView';
import { PartnerRequestsView } from './views/PartnerRequestsView';

const MainAppContent: React.FC = () => {
  const { currentPage, activeTab, currentUser, setActiveTab } = useApp();

  const isAdmin = currentUser?.roleType === 'admin';
  const isAdminTab = activeTab === 'allocation' || activeTab === 'warehouses' || activeTab === 'partner-requests';

  React.useEffect(() => {
    if (isAdminTab && !isAdmin) {
      setActiveTab('overview');
    }
  }, [isAdminTab, isAdmin, setActiveTab]);

  // Landing page as first impression
  if (currentPage === 'landing') {
    return <LandingPageView />;
  }

  // If user navigates to login
  if (currentPage === 'login') {
    return <LoginPage />;
  }

  // If user is accessing Warehouse Partner Dashboard
  if (currentPage === 'warehouse-dashboard') {
    return <WarehouseDashboardView />;
  }

  // Disaster Operations Dashboard (Direct default landing page)
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F5FA] text-[#152B44]">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <TopHeader />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'monitoring' && <MonitoringView />}
          {activeTab === 'map' && <LiveMapView />}
          {isAdmin && activeTab === 'allocation' && <ReliefAllocationView />}
          {isAdmin && activeTab === 'warehouses' && <WarehousesView />}
          {isAdmin && activeTab === 'partner-requests' && <PartnerRequestsView />}
          {activeTab === 'data-models' && <DataModelsView />}
          {isAdminTab && !isAdmin && <OverviewView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
