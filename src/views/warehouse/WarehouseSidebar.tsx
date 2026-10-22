import React from 'react';
import { useWarehouse, WarehouseNavSection } from '../../context/WarehouseContext';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Boxes,
  ClipboardList,
  History,
  LogOut,
} from 'lucide-react';
import { RahatLogoText } from '../../components/common/RahatLogoText';

interface NavItemConfig {
  id: WarehouseNavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'pendingRequestsCount';
  badgeColor?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Warehouse Profile', icon: Building2 },
  { id: 'inventory', label: 'Inventory Management', icon: Boxes },
  {
    id: 'allocation-requests',
    label: 'Allocation Requests',
    icon: ClipboardList,
    badgeKey: 'pendingRequestsCount',
    badgeColor: 'bg-[#D95D58] text-white',
  },
  { id: 'history', label: 'Allocation History', icon: History },
];

export const WarehouseSidebar: React.FC = () => {
  const { activeSection, setActiveSection, summaryMetrics } = useWarehouse();
  const { setCurrentPage, logout } = useApp();

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#CFE2F2] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20">
      {/* Top Branding without Partner badge and without depot snapshot pill */}
      <div>
        {/* Brand Header (Redirects to landing page on click) */}
        <div
          onClick={() => setCurrentPage('landing')}
          className="p-3.5 border-b border-[#CFE2F2] bg-[#FAFBFD] cursor-pointer hover:bg-[#F0F6FD] transition-colors group"
          title="Return to Main Landing Page"
        >
          <div className="flex items-center gap-2.5">
            <img
              src="/Disaster1.jpg"
              alt="RAHAT Logo"
              className="w-9 h-9 object-contain rounded-full ring-2 ring-[#CFE2F2] group-hover:ring-[#2853f3] bg-white shadow-xs p-0.5 transition-all"
            />
            <div className="flex flex-col">
              <RahatLogoText className="text-xl" color="#141478" />
              <span className="text-[10px] font-semibold text-[#516C8A] mt-0.5">
                Warehouse Operations
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2.5 space-y-1 mt-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#516C8A]">
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const badgeCount = item.badgeKey ? summaryMetrics[item.badgeKey] : 0;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#2853f3] font-semibold shadow-xs border-l-3 border-[#2853f3]'
                    : 'text-[#152B44] hover:bg-[#F0F6FD] hover:text-[#2853f3]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#2853f3]' : 'text-[#516C8A]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {badgeCount > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shadow-2xs ${
                      item.badgeColor || 'bg-[#2853f3] text-white'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Clean Logout (Removed NDMA block and National Ops button as requested) */}
      <div className="p-2.5 border-t border-[#CFE2F2] bg-[#FAFBFD]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-[#D95D58] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer border border-[#FAC8C3]/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
