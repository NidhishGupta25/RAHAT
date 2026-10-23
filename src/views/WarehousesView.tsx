import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem } from '../types';
import {
  Building2,
  X,
  Search,
  ArrowRight,
} from 'lucide-react';

export const WarehousesView: React.FC = () => {
  const { warehouses, addActivity, currentUser, setActiveTab } = useApp();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(warehouses[0].id);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [requisitionItem, setRequisitionItem] = useState<InventoryItem | null>(null);
  const [requisitionAmount, setRequisitionAmount] = useState<number>(1000);
  const [searchFilter, setSearchFilter] = useState('');

  const activeWarehouse = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

  const handleRequisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requisitionItem) return;
    addActivity({
      actor: currentUser?.name || 'Warehouse Operator',
      role: currentUser?.roleLabel || 'Operator',
      category: 'WAREHOUSE',
      action: `Restock: ${requisitionItem.resourceName}`,
      details: `${requisitionAmount} ${requisitionItem.unit} requested for ${activeWarehouse.name}.`,
    });
    setShowRequisitionModal(false);
  };

  const filteredInventory = activeWarehouse.inventory.filter((inv) =>
    inv.resourceName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-5 space-y-5 max-w-[1600px] mx-auto bg-[#F0F5FA]">
      {/* Quick link banner to Partner Requests */}
      <div className="bg-[#EEF2FF] border border-[#C7D4FE] p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#2853f3] shrink-0" />
          <span className="text-[#152B44] font-medium">
            Warehouse Partner Network: Manage and audit facility registrations, documents, and certification requests.
          </span>
        </div>
        <button
          onClick={() => setActiveTab('partner-requests')}
          className="text-xs font-bold text-[#2853f3] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>View Partner Requests</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Depot Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {warehouses.map((wh) => {
          const isSelected = wh.id === selectedWarehouseId;
          const lowStockCount = wh.inventory.filter((i) => i.isLowStock).length;
          return (
            <div
              key={wh.id}
              onClick={() => setSelectedWarehouseId(wh.id)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-white border-[#2853f3] ring-1 ring-[#2853f3]'
                  : 'bg-white border-[#CFE2F2] hover:border-[#2853f3]'
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E8F2FA]">
                <span className="font-mono text-[10px] text-[#516C8A] bg-[#E8F2FA] px-1.5 py-0.5 rounded">
                  {wh.code}
                </span>
                {lowStockCount > 0 ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4]">
                    {lowStockCount} Low
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EBF7F1] text-[#359868]">
                    Adequate
                  </span>
                )}
              </div>

              <h3 className="font-bold text-xs text-[#152B44] mt-2 truncate">{wh.name}</h3>
              <p className="text-[11px] text-[#516C8A] mt-0.5">
                {wh.city}, {wh.state}
              </p>

              <div className="mt-2.5 pt-1.5 border-t border-[#E8F2FA] flex items-center justify-between text-xs">
                <span className="text-[#516C8A]">Stock:</span>
                <span className="font-semibold text-[#2853f3]">
                  {wh.currentStockTons} / {wh.totalCapacityTons} T
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Warehouse Overview */}
      <div className="bg-white p-4 rounded-lg border border-[#CFE2F2] shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#CFE2F2]">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2853f3]" />
              <h2 className="text-sm font-bold text-[#152B44]">{activeWarehouse.name}</h2>
              <span className="text-[11px] bg-[#EEF2FF] text-[#2853f3] px-1.5 py-0.5 rounded font-mono">
                {activeWarehouse.code}
              </span>
            </div>
            <div className="text-[11px] text-[#516C8A] mt-0.5">
              Contact: {activeWarehouse.officerInCharge} ({activeWarehouse.contactNumber})
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-[#2853f3]">
              {Math.round((activeWarehouse.currentStockTons / activeWarehouse.totalCapacityTons) * 100)}% Capacity
            </span>
            <div className="w-20 bg-[#E8F2FA] h-2.5 rounded-full overflow-hidden border border-[#CFE2F2]">
              <div
                className="bg-[#2853f3] h-full"
                style={{
                  width: `${(activeWarehouse.currentStockTons / activeWarehouse.totalCapacityTons) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#516C8A] absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search depot inventory..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-7 pr-3 py-1 bg-[#FFFFFF] border border-[#CFE2F2] rounded-md focus:outline-none focus:border-[#2853f3] text-[#152B44]"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="mt-3 overflow-x-auto rounded border border-[#CFE2F2]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#E8F2FA] text-[#152B44] font-semibold border-b border-[#CFE2F2]">
              <tr>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Total</th>
                <th className="py-2.5 px-3 text-right">Available</th>
                <th className="py-2.5 px-3 text-right">Threshold</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F2FA] text-[#152B44]">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFBFD] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#152B44]">
                    {item.resourceName}
                  </td>
                  <td className="py-2.5 px-3 text-[#516C8A]">{item.category}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    {item.total.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2853f3]">
                    {item.available.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#516C8A]">
                    {item.minThreshold.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.isLowStock ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FEF4E8] text-[#D9822B] border border-[#FCE2C4]">
                        Low
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#EBF7F1] text-[#359868]">
                        OK
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {currentUser?.roleType === 'admin' ? (
                      <button
                        onClick={() => {
                          setRequisitionItem(item);
                          setShowRequisitionModal(true);
                        }}
                        className="px-2 py-0.5 text-[11px] bg-[#EEF2FF] hover:bg-[#DCE5FF] text-[#2853f3] rounded font-medium cursor-pointer"
                      >
                        Restock
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#516C8A] bg-[#E8F2FA] px-1 py-0.5 rounded">
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

      {/* Restock Modal */}
      {showRequisitionModal && requisitionItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#CFE2F2] shadow-xl max-w-sm w-full p-4 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#CFE2F2]">
              <h3 className="font-bold text-xs text-[#152B44]">Restock Request</h3>
              <button
                onClick={() => setShowRequisitionModal(false)}
                className="text-[#516C8A] hover:text-[#152B44] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleRequisitionSubmit} className="mt-3 space-y-3">
              <div className="p-2 bg-[#E8F2FA] rounded border border-[#CFE2F2]">
                <div className="font-semibold text-xs text-[#152B44]">
                  {requisitionItem.resourceName}
                </div>
                <div className="text-[11px] text-[#516C8A]">
                  Current Buffer: {requisitionItem.available.toLocaleString()} {requisitionItem.unit}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#152B44] mb-1">
                  Quantity ({requisitionItem.unit}):
                </label>
                <input
                  type="number"
                  min={100}
                  value={requisitionAmount}
                  onChange={(e) => setRequisitionAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#CFE2F2] rounded text-xs text-[#152B44] font-mono focus:outline-none focus:border-[#2853f3]"
                />
              </div>

              <div className="pt-2 border-t border-[#CFE2F2] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequisitionModal(false)}
                  className="px-3 py-1 bg-[#E8F2FA] text-[#152B44] rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#2853f3] hover:bg-[#1e42d9] text-white rounded font-medium cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
