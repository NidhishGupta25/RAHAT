import React from 'react';
import { WarehouseProvider, useWarehouse } from '../../context/WarehouseContext';
import { WarehouseSidebar } from './WarehouseSidebar';
import { WarehouseHeader } from './WarehouseHeader';
import { WarehouseOverviewTab } from './tabs/WarehouseOverviewTab';
import { WarehouseProfileTab } from './tabs/WarehouseProfileTab';
import { WarehouseInventoryTab } from './tabs/WarehouseInventoryTab';
import { WarehouseAllocationsTab } from './tabs/WarehouseAllocationsTab';
import { WarehouseHistoryTab } from './tabs/WarehouseHistoryTab';

const WarehouseDashboardContent: React.FC = () => {
  const { activeSection, setActiveSection } = useWarehouse();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F5FA] text-[#152B44]">
      {/* Sidebar Navigation */}
      <WarehouseSidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <WarehouseHeader onOpenAddResourceModal={() => setActiveSection('inventory')} />

        <main className="flex-1 overflow-y-auto">
          {activeSection === 'overview' && <WarehouseOverviewTab />}
          {activeSection === 'profile' && <WarehouseProfileTab />}
          {activeSection === 'inventory' && <WarehouseInventoryTab />}
          {activeSection === 'allocation-requests' && <WarehouseAllocationsTab />}
          {activeSection === 'history' && <WarehouseHistoryTab />}
        </main>
      </div>
    </div>
  );
};

export const WarehouseDashboardView: React.FC = () => {
  return (
    <WarehouseProvider>
      <WarehouseDashboardContent />
    </WarehouseProvider>
  );
};
