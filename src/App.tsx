import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPageView } from './views/LandingPageView';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { OverviewView } from './views/OverviewView';
import { MonitoringView } from './views/MonitoringView';
import { LiveMapView } from './views/LiveMapView';
import { ReliefAllocationView } from './views/ReliefAllocationView';
import { WarehousesView } from './views/WarehousesView';
import { LogisticsView } from './views/LogisticsView';
import { DataModelsView } from './views/DataModelsView';

const MainAppContent: React.FC = () => {
  const { currentPage, activeTab } = useApp();

  // Step 1: Public landing page
  if (currentPage === 'landing') {
    return <LandingPageView />;
  }

  // Step 2: Sign in (optional initially)
  if (currentPage === 'login') {
    return <LoginPage />;
  }

  // Step 3: Disaster operations dashboard
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
          {activeTab === 'allocation' && <ReliefAllocationView />}
          {activeTab === 'warehouses' && <WarehousesView />}
          {activeTab === 'logistics' && <LogisticsView />}
          {activeTab === 'data-models' && <DataModelsView />}
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
