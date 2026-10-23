import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Activity,
  Map,
  PackageCheck,
  Building2,
  ShieldCheck,
  User,
  LogOut,
  Home,
  LogIn,
  ClipboardCheck,
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
  { id: 'partner-requests', label: 'Partner Requests', icon: ClipboardCheck },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, logout, setCurrentPage } = useApp();
  const [pendingCount, setPendingCount] = React.useState(0);

  const isAdmin = currentUser?.roleType === 'admin';

  React.useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem('rahat_registered_partners');
        if (stored) {
          const partners = JSON.parse(stored);
          if (Array.isArray(partners)) {
            const pending = partners.filter((p: any) => p.status === 'pending').length;
            setPendingCount(pending);
            return;
          }
        }
      } catch {
        // fallback
      }
      setPendingCount(2); // default demo pending
    };

    updateCount();
    window.addEventListener('rahat_partners_updated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('rahat_partners_updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <aside className="w-56 bg-[#FFFFFF] border-r border-[#CFE2F2] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      {/* Top Branding with Disaster1.jpg Logo & Redesigned RAHAT Typography */}
      <div>
        <div
          onClick={() => {
            setCurrentPage('landing');
          }}
          className="p-3.5 border-b border-[#CFE2F2] flex items-center gap-2.5 bg-[#FAFBFD] cursor-pointer hover:bg-[#F0F6FD] transition-colors group"
          title="Return to Main Landing Page"
        >
          <img
            src="/Disaster1.jpg"
            alt="RAHAT Logo"
            className="w-9 h-9 object-contain rounded-full ring-2 ring-[#CFE2F2] group-hover:ring-[#2853f3] bg-white shadow-xs p-0.5 transition-all"
          />
          <div className="flex items-center gap-2">
            <RahatLogoText className="text-xl" color="#141478" />
            {currentUser && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                  isAdmin
                    ? 'bg-[#E5F1FC] text-[#2853f3] border-[#C3DDF7]'
                    : 'bg-[#EDF4FA] text-[#516C8A] border-[#D4E3F0]'
                }`}
              >
                {isAdmin ? 'ADMIN' : 'USER'}
              </span>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2.5 space-y-3">
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
                        ? 'bg-[#EEF2FF] text-[#2853f3] font-semibold border-l-2 border-[#2853f3]'
                        : 'text-[#152B44] hover:bg-[#F0F6FD] hover:text-[#2853f3]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2853f3]' : 'text-[#516C8A]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operations: Admin-only pages (Relief alloc, warehouse & inventory, partner request). Hidden for public users without signin. */}
          {isAdmin && (
            <div>
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#516C8A]">
                Operations
              </div>
              <div className="space-y-0.5 mt-0.5">
                {ADMIN_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isPartnerReq = item.id === 'partner-requests';
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#EEF2FF] text-[#2853f3] font-semibold border-l-2 border-[#2853f3]'
                          : 'text-[#152B44] hover:bg-[#F0F6FD] hover:text-[#2853f3]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2853f3]' : 'text-[#516C8A]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isPartnerReq && pendingCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
                    <ShieldCheck className="w-3 h-3 text-[#2853f3]" />
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
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-white bg-[#2853f3] hover:bg-[#1e42d9] rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
