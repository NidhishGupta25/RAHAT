import React from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, Home, LogIn } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, refreshFeeds, isRefreshing, dataSources, setCurrentPage } = useApp();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Disaster Operations Overview';
      case 'monitoring':
        return 'Hazard Telemetry & Feeds';
      case 'map':
        return 'Live GIS Map & Spatial Layers';
      case 'allocation':
        return 'Relief Allocation & Needs';
      case 'warehouses':
        return 'Warehouses & Stockpiles';
      case 'partner-requests':
        return 'Warehouse Partner Requests & Verification';
      case 'data-models':
        return 'Data Models & Feeds Health';
      default:
        return 'RAHAT';
    }
  };

  const title = getPageTitle();

  return (
    <header className="bg-[#FFFFFF] border-b border-[#CFE2F2] px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-2xs">
      {/* Title & Overview Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentPage('landing')}
          className="p-1.5 rounded-lg text-[#516C8A] hover:text-[#2853f3] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
          title="Return to Home Landing Page"
        >
          <Home className="w-4 h-4 text-[#2853f3]" />
        </button>
        <div className="h-4 w-px bg-[#CFE2F2]" />
        <h1 className="text-base font-bold text-[#152B44] tracking-tight">{title}</h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={refreshFeeds}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#2853f3] bg-[#EEF2FF] hover:bg-[#DCE5FF] border border-[#C7D4FE] rounded-md transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#2853f3]' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
        </button>

        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-[#CFE2F2]">
            <div
              className={`w-6.5 h-6.5 rounded-full text-white flex items-center justify-center text-xs font-bold ${
                currentUser.roleType === 'admin' ? 'bg-[#2853f3]' : 'bg-[#516C8A]'
              }`}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-xs font-semibold text-[#152B44] truncate max-w-[130px]">
                {currentUser.name}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCurrentPage('login')}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-[#2853f3] hover:bg-[#1e42d9] rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
