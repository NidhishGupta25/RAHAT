import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  Map,
  PackageCheck,
  Building2,
  Route,
  Database,
  ShieldCheck,
  User,
  LogOut,
  Home,
  LogIn,
} from 'lucide-react';
import { RahatLogoText } from '../common/RahatLogoText';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PUBLIC_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'monitoring', label: 'Hazard Feeds', icon: Activity },
  { id: 'map', label: 'Live GIS Map', icon: Map },
];

const ADMIN_ITEMS: NavItem[] = [
  { id: 'allocation', label: 'Relief Allocation', icon: PackageCheck },
  { id: 'warehouses', label: 'Warehouses & Inventory', icon: Building2 },
  { id: 'logistics', label: 'Routes & Logistics', icon: Route },
  { id: 'data-models', label: 'Data & Models', icon: Database },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, logout, setCurrentPage } = useApp();

  const isAdmin = currentUser?.roleType === 'admin';

  return (
    <aside className="w-56 bg-[#FFFFFF] border-r border-[#CFE2F2] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      {/* Top Branding with Disaster1.jpg Logo & Redesigned RAHAT Typography */}
      <div>
        <div
          onClick={() => setCurrentPage('landing')}
          className="p-3.5 border-b border-[#CFE2F2] flex items-center gap-2.5 bg-[#FAFBFD] cursor-pointer hover:bg-[#F0F6FD] transition-colors group"
          title="Return to Public Landing Page"
        >
          <img
            src="/Disaster1.jpg"
            alt="RAHAT Logo"
            className="w-8.5 h-8.5 object-contain rounded-full ring-2 ring-[#CFE2F2] group-hover:ring-[#88BCE5] bg-white shadow-xs p-0.5 transition-all"
          />
          <div className="flex items-center gap-2">
            <RahatLogoText className="h-4.5 w-auto" color="#0A2342" />
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                currentUser
                  ? isAdmin
                    ? 'bg-[#E5F1FC] text-[#2C6EA6] border-[#C3DDF7]'
                    : 'bg-[#EDF4FA] text-[#516C8A] border-[#D4E3F0]'
                  : 'bg-[#EBF3FB] text-[#4688C8] border-[#CFE2F2]'
              }`}
            >
              {currentUser ? (isAdmin ? 'ADMIN' : 'USER') : 'GUEST'}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2.5 space-y-3">
          {/* Landing Portal Link */}
          <div>
            <button
              onClick={() => setCurrentPage('landing')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#516C8A] hover:bg-[#F0F6FD] hover:text-[#2C6EA6] transition-colors cursor-pointer text-left"
            >
              <Home className="w-3.5 h-3.5 text-[#4688C8]" />
              <span>Public Landing Page</span>
            </button>
          </div>

          <div>
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#516C8A]">
              Monitoring
            </div>
            <div className="space-y-0.5 mt-0.5">
              {PUBLIC_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#E8F3FC] text-[#2C6EA6] font-semibold border-l-2 border-[#4688C8]'
                        : 'text-[#152B44] hover:bg-[#F0F6FD] hover:text-[#2C6EA6]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4688C8]' : 'text-[#516C8A]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#516C8A]">
              Operations
            </div>
            <div className="space-y-0.5 mt-0.5">
              {ADMIN_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#E8F3FC] text-[#2C6EA6] font-semibold border-l-2 border-[#4688C8]'
                        : 'text-[#152B44] hover:bg-[#F0F6FD] hover:text-[#2C6EA6]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4688C8]' : 'text-[#516C8A]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* User Session & Auth Panel */}
      <div className="p-2.5 border-t border-[#CFE2F2] bg-[#FAFBFD]">
        {currentUser ? (
          <div>
            <div className="mb-2 p-2 rounded-md bg-white border border-[#CFE2F2]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#516C8A] flex items-center gap-1 font-medium">
                  {isAdmin ? (
                    <ShieldCheck className="w-3 h-3 text-[#4688C8]" />
                  ) : (
                    <User className="w-3 h-3 text-[#516C8A]" />
                  )}
                  {currentUser.roleType === 'admin' ? 'Administrator' : 'User'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#359868]"></span>
              </div>
              <div className="font-semibold text-xs text-[#152B44] truncate mt-0.5">{currentUser.name}</div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#D95D58] hover:bg-[#FDF2F2] rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-2 p-2 rounded-md bg-white border border-[#CFE2F2]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#516C8A] font-medium">Guest Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#DE8838]"></span>
              </div>
              <div className="text-[11px] text-[#516C8A] truncate mt-0.5">Public Observability</div>
            </div>

            <button
              onClick={() => setCurrentPage('login')}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#4688C8] hover:bg-[#3374B2] rounded transition-colors cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
