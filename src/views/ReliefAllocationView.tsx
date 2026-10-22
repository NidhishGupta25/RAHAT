import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReliefAllocation } from '../types';
import {
  PackageCheck,
  Check,
  X,
} from 'lucide-react';

export const ReliefAllocationView: React.FC = () => {
  const {
    allocations,
    confirmAllocation,
    dispatchAllocation,
    currentUser,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [modalItem, setModalItem] = useState<ReliefAllocation | null>(null);
  const [allocatedQtyInput, setAllocatedQtyInput] = useState<number>(0);

  const filteredAllocations = allocations.filter((a) => {
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  const totalDemand = allocations.reduce((acc, a) => acc + a.estimatedDemand, 0);
  const totalShortage = allocations.reduce((acc, a) => acc + a.shortageQuantity, 0);
  const totalConfirmed = allocations.reduce((acc, a) => acc + a.confirmedAllocation, 0);
  const totalDispatched = allocations.filter((a) => a.status === 'DISPATCHED').length;

  const handleOpenActionModal = (item: ReliefAllocation) => {
    setModalItem(item);
    setAllocatedQtyInput(item.proposedAllocation || item.estimatedDemand);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalItem) return;
    confirmAllocation(modalItem.id, allocatedQtyInput);
    setModalItem(null);
  };

  const handleDispatch = (id: string) => {
    dispatchAllocation(id);
    if (modalItem?.id === id) {
      setModalItem(null);
    }
  };

  return (
    <div className="p-5 space-y-5 max-w-[1600px] mx-auto bg-[#F0F5FA]">
      {/* 1. Allocation Summary Metrics */}
      <div className="bg-white p-4 rounded-lg border border-[#CFE2F2] shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#CFE2F2]">
          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A]">Demand</div>
            <div className="text-lg font-bold text-[#152B44] mt-0.5">{totalDemand.toLocaleString()}</div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A]">Shortage</div>
            <div className="text-lg font-bold text-[#D95D58] mt-0.5">{totalShortage.toLocaleString()}</div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A]">Confirmed</div>
            <div className="text-lg font-bold text-[#359868] mt-0.5">{totalConfirmed.toLocaleString()}</div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-3">
            <div className="text-[11px] text-[#516C8A]">Dispatched</div>
            <div className="text-lg font-bold text-[#2853f3] mt-0.5">{totalDispatched} Convoys</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-lg border border-[#CFE2F2] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#152B44]">Status:</span>
          {['ALL', 'PROPOSED', 'CONFIRMED', 'PENDING_DISPATCH', 'DISPATCHED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                filterStatus === st
                  ? 'bg-[#2853f3] text-white shadow-xs'
                  : 'bg-[#E8F2FA] text-[#152B44] hover:bg-[#CFE2F2]'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Allocation Table */}
      <div className="bg-white rounded-lg border border-[#CFE2F2] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E8F2FA] text-[#152B44] font-semibold border-b border-[#CFE2F2]">
              <tr>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3 text-right">Demand</th>
                <th className="py-2.5 px-3 text-right">Available</th>
                <th className="py-2.5 px-3 text-right">Shortage</th>
                <th className="py-2.5 px-3 text-right">Allocated</th>
                <th className="py-2.5 px-3">Origin Depot</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F2FA] text-[#152B44]">
              {filteredAllocations.map((alc) => (
                <tr key={alc.id} className="hover:bg-[#FAFBFD] transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[#152B44]">{alc.destination}</div>
                    <div className="text-[10px] text-[#516C8A]">{alc.disasterTitle}</div>
                  </td>

                  <td className="py-2.5 px-3 font-medium">
                    <div>{alc.resourceType}</div>
                    <div className="text-[10px] text-[#516C8A]">{alc.unit}</div>
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    {alc.estimatedDemand.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono text-[#516C8A]">
                    {alc.availableStock.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono font-bold">
                    {alc.shortageQuantity > 0 ? (
                      <span className="text-[#D95D58]">{alc.shortageQuantity.toLocaleString()}</span>
                    ) : (
                      <span className="text-[#359868]">0</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2853f3]">
                    {alc.confirmedAllocation > 0
                      ? alc.confirmedAllocation.toLocaleString()
                      : alc.proposedAllocation.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-3 text-[11px] text-[#516C8A] max-w-[150px] truncate">
                    {alc.warehouseOriginName}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        alc.status === 'DISPATCHED'
                          ? 'bg-[#EEF2FF] text-[#2853f3] border border-[#CFE2F2]'
                          : alc.status === 'CONFIRMED'
                          ? 'bg-[#EBF7F1] text-[#359868] border border-[#CEEEDF]'
                          : alc.status === 'PENDING_DISPATCH'
                          ? 'bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4]'
                          : 'bg-[#E8F2FA] text-[#516C8A] border border-[#CFE2F2]'
                      }`}
                    >
                      {alc.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    {currentUser?.roleType === 'admin' ? (
                      <>
                        {alc.status === 'PROPOSED' && (
                          <button
                            onClick={() => handleOpenActionModal(alc)}
                            className="px-2 py-1 bg-[#2853f3] hover:bg-[#1e42d9] text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {alc.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleDispatch(alc.id)}
                            className="px-2 py-1 bg-[#EEF2FF] hover:bg-[#DCE5FF] text-[#2853f3] border border-[#2853f3] rounded text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Dispatch
                          </button>
                        )}
                        {alc.status === 'PENDING_DISPATCH' && (
                          <button
                            onClick={() => handleDispatch(alc.id)}
                            className="px-2 py-1 bg-[#D9822B] hover:bg-[#B45309] text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Authorize
                          </button>
                        )}
                        {alc.status === 'DISPATCHED' && (
                          <span className="text-[11px] text-[#359868] flex items-center justify-center gap-1">
                            <Check className="w-3 h-3" /> En Route
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] text-[#516C8A] bg-[#E8F2FA] px-1.5 py-0.5 rounded inline-block">
                        Admin Only
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#CFE2F2] shadow-xl max-w-md w-full p-4 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#CFE2F2]">
              <div className="flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[#2853f3]" />
                <h3 className="font-bold text-xs text-[#152B44]">Confirm Allocation</h3>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="mt-3 space-y-3">
              <div className="bg-[#E8F2FA] p-2.5 rounded border border-[#CFE2F2]">
                <div className="font-semibold text-xs text-[#152B44]">{modalItem.destination}</div>
                <div className="text-[#516C8A] text-[11px]">{modalItem.resourceType} • Origin: {modalItem.warehouseOriginName}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-[#FFFFFF] border border-[#CFE2F2] rounded">
                  <span className="text-[10px] text-[#516C8A]">Demand</span>
                  <div className="font-bold text-xs text-[#152B44]">
                    {modalItem.estimatedDemand.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-[#FFFFFF] border border-[#CFE2F2] rounded">
                  <span className="text-[10px] text-[#516C8A]">Available</span>
                  <div className="font-bold text-xs text-[#152B44]">
                    {modalItem.availableStock.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-[#FFFFFF] border border-[#CFE2F2] rounded">
                  <span className="text-[10px] text-[#516C8A]">Shortage</span>
                  <div className="font-bold text-xs text-[#D95D58]">
                    {modalItem.shortageQuantity.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#152B44] mb-1">
                  Quantity ({modalItem.unit}):
                </label>
                <input
                  type="number"
                  min={1}
                  max={modalItem.availableStock}
                  value={allocatedQtyInput}
                  onChange={(e) => setAllocatedQtyInput(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#CFE2F2] rounded text-xs text-[#152B44] font-mono focus:outline-none focus:border-[#2853f3]"
                />
              </div>

              <div className="pt-2 border-t border-[#CFE2F2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="px-3 py-1 bg-[#E8F2FA] text-[#152B44] rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#2853f3] hover:bg-[#1e42d9] text-white rounded font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
