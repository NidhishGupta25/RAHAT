import React from 'react';
import { useWarehouse } from '../../../context/WarehouseContext';
import {
  Boxes,
  Building,
  Clock,
  CheckCircle2,
  History,
  ArrowRight,
} from 'lucide-react';

export const WarehouseOverviewTab: React.FC = () => {
  const {
    summaryMetrics,
    categoryBreakdown,
    allocationRequests,
    history,
    setActiveSection,
    acceptAllocationRequest,
  } = useWarehouse();

  const pendingRequests = allocationRequests.filter((r) => r.status === 'PENDING');

  return (
    <div className="p-5 space-y-6 max-w-[1600px] mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Storage Capacity */}
        <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#516C8A]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Storage Capacity</span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#2853f3] flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#152B44] tracking-tight">
              {summaryMetrics.totalCapacityTons.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Available Resources */}
        <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#516C8A]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Available Resources</span>
            <div className="w-8 h-8 rounded-lg bg-[#E5F7ED] text-[#359868] flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#359868] tracking-tight">
              {summaryMetrics.availableUnits.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Distribution by Category */}
      <div className="bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#359868]"></div>
            <h3 className="text-sm font-bold text-[#152B44]">Inventory Distribution by Category</h3>
          </div>
          <button
            onClick={() => setActiveSection('inventory')}
            className="text-xs font-semibold text-[#2853f3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Full Catalog</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Category Bars */}
        <div className="space-y-3">
          {categoryBreakdown.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#152B44] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.category}
                </span>
                <span className="font-mono text-xs font-bold text-[#152B44]">
                  {item.totalUnits.toLocaleString()}
                </span>
              </div>

              <div className="h-2 w-full bg-[#F0F5FA] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(5, item.percentage)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Grid: Pending Allocation Requests & Active Dispatches / Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pending Requisitions Quick Review */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D95D58]" />
              <h3 className="text-sm font-bold text-[#152B44]">Pending Allocation Requests</h3>
            </div>
            <button
              onClick={() => setActiveSection('allocation-requests')}
              className="text-xs font-semibold text-[#2853f3] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#516C8A] bg-[#FAFBFD] rounded-lg border border-dashed border-[#CFE2F2]">
              All emergency requisitions have been processed and fulfilled.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 2).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] hover:bg-[#F0F6FD] transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#152B44]">{req.disasterEvent}</div>
                      <div className="text-[11px] text-[#516C8A] mt-0.5">{req.affectedLocation}</div>
                    </div>
                    <span className="text-[10px] text-[#516C8A] font-medium">{req.requestDate.split(' ')[0]}</span>
                  </div>

                  {/* Resource summary */}
                  <div className="bg-white p-2 rounded border border-[#CFE2F2] text-xs space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#516C8A]">Requested Consignment:</div>
                    {req.requiredResources.map((res, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-[#152B44]">
                        <span className="truncate max-w-[200px]">{res.name}</span>
                        <span className="font-semibold">{res.quantity.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setActiveSection('allocation-requests')}
                      className="px-2.5 py-1 text-xs font-medium text-[#516C8A] hover:bg-white rounded border border-[#CFE2F2] cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => acceptAllocationRequest(req.id)}
                      className="px-3 py-1 text-xs font-bold text-white bg-[#359868] hover:bg-[#2A7B54] rounded shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Reserve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Allocation History */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#CFE2F2] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#2853f3]" />
              <h3 className="text-sm font-bold text-[#152B44]">Recent Allocation History</h3>
            </div>
            <button
              onClick={() => setActiveSection('history')}
              className="text-xs font-semibold text-[#2853f3] hover:underline cursor-pointer"
            >
              View Full History &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] space-y-2 hover:bg-[#F0F6FD] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#152B44]">{item.resourceName}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      item.quantityChange > 0
                        ? 'bg-[#E5F7ED] text-[#24824F] border border-[#A8E2BF]'
                        : 'bg-[#FEF4E8] text-[#DE8838] border border-[#FCE2C4]'
                    }`}
                  >
                    {item.type.replace('STOCK_', '').replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#516C8A]">{item.category}</span>
                  <span
                    className={`font-mono font-bold ${
                      item.quantityChange > 0 ? 'text-[#24824F]' : 'text-[#D95D58]'
                    }`}
                  >
                    {item.quantityChange > 0
                      ? `+${item.quantityChange.toLocaleString()}`
                      : item.quantityChange.toLocaleString()}
                  </span>
                </div>

                <div className="text-[11px] text-[#516C8A] line-clamp-1">
                  {item.notes}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#88A2BF] pt-1 border-t border-[#F0F5FA]">
                  <span>Authorized by: {item.operator}</span>
                  <span>{item.transactionDate.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to history */}
          <div className="mt-4 pt-3 border-t border-[#F0F5FA] flex items-center justify-end text-xs">
            <button
              onClick={() => setActiveSection('history')}
              className="font-semibold text-[#2853f3] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Manage Allocation History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
