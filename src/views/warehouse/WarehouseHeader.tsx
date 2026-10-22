import React from 'react';
import { useWarehouse } from '../../context/WarehouseContext';
import { PlusCircle } from 'lucide-react';

interface WarehouseHeaderProps {
  onOpenAddResourceModal: () => void;
}

export const WarehouseHeader: React.FC<WarehouseHeaderProps> = ({ onOpenAddResourceModal }) => {
  const { activeSection, profile } = useWarehouse();

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview':
        return 'Warehouse Operations Dashboard';
      case 'profile':
        return 'Depot & Facility Profile';
      case 'inventory':
        return 'Resource Inventory & Stock Levels';
      case 'allocation-requests':
        return 'Emergency Allocation Requisitions';
      case 'history':
        return 'Allocation History';
      default:
        return 'Warehouse Dashboard';
    }
  };

  return (
    <header className="bg-[#FFFFFF] border-b border-[#CFE2F2] px-5 py-3.5 sticky top-0 z-10 flex items-center justify-between gap-4 shadow-2xs">
      {/* Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#516C8A]">
          <span>RAHAT Logistics</span>
          <span>/</span>
          <span className="font-semibold text-[#2853f3]">{profile.code}</span>
        </div>
        <h1 className="text-base sm:text-lg font-bold text-[#152B44] tracking-tight leading-snug">
          {getSectionTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Add Resource Action */}
        <button
          onClick={onOpenAddResourceModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2853f3] hover:bg-[#1e42d9] rounded-md shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Resource</span>
        </button>

        {/* Partner Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#CFE2F2]">
          <div className="w-7 h-7 rounded-full bg-[#2853f3] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            {profile.ownerName.charAt(0)}
          </div>
          <div className="text-left leading-tight hidden md:block">
            <div className="text-xs font-bold text-[#152B44] truncate max-w-[140px]">
              {profile.ownerName}
            </div>
            <div className="text-[10px] text-[#516C8A] truncate max-w-[140px]">
              {profile.ownerTitle}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
