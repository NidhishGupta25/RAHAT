import React, { useState } from 'react';
import { useWarehouse } from '../../../context/WarehouseContext';
import { InventoryTransactionType } from '../../../types';
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  SlidersHorizontal,
  PackageCheck,
  RotateCcw,
  User,
  Calendar,
} from 'lucide-react';

export const WarehouseHistoryTab: React.FC = () => {
  const { history } = useWarehouse();
  const [typeFilter, setTypeFilter] = useState<InventoryTransactionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = history.filter((txn) => {
    const matchesType = typeFilter === 'ALL' || txn.type === typeFilter;
    const matchesSearch =
      txn.resourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.operator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTransactionBadge = (type: InventoryTransactionType) => {
    switch (type) {
      case 'STOCK_RECEIVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E5F7ED] text-[#24824F] border border-[#A8E2BF] inline-flex items-center gap-1">
            <ArrowDownLeft className="w-3 h-3 text-[#359868]" />
            Stock Received
          </span>
        );
      case 'STOCK_RESERVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF4E8] text-[#DE8838] border border-[#FCE2C4] inline-flex items-center gap-1">
            <PackageCheck className="w-3 h-3 text-[#DE8838]" />
            Stock Reserved
          </span>
        );
      case 'STOCK_DISPATCHED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] text-[#2853f3] border border-[#CFE2F2] inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#2853f3]" />
            Stock Dispatched
          </span>
        );
      case 'STOCK_RETURNED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0EEFD] text-[#6A5ACD] border border-[#DDD8FA] inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-[#6A5ACD]" />
            Stock Returned
          </span>
        );
      case 'STOCK_ADJUSTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAFBFD] text-[#516C8A] border border-[#CFE2F2] inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-[#516C8A]" />
            Stock Adjusted
          </span>
        );
    }
  };

  return (
    <div className="p-5 space-y-5 max-w-[1700px] mx-auto">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#CFE2F2] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#2853f3]" />
            <h2 className="text-base font-bold text-[#152B44]">Allocation History & Movement Trail</h2>
          </div>
          <p className="text-xs text-[#516C8A] mt-0.5">
            Audit log of all emergency relief allocations, stock reservations, releases, and balance adjustments.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#516C8A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, SKU, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-[#CFE2F2] bg-[#FAFBFD] text-[#152B44] focus:outline-none focus:border-[#2853f3]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            'ALL',
            'STOCK_RECEIVED',
            'STOCK_RESERVED',
            'STOCK_DISPATCHED',
            'STOCK_RETURNED',
            'STOCK_ADJUSTED',
          ] as const
        ).map((t) => {
          const isSelected = typeFilter === t;
          const count =
            t === 'ALL' ? history.length : history.filter((h) => h.type === t).length;
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#2853f3] text-white border-[#2853f3] shadow-xs'
                  : 'bg-white text-[#516C8A] border-[#CFE2F2] hover:bg-[#F0F6FD]'
              }`}
            >
              <span>{t === 'ALL' ? 'All Transactions' : t.replace('STOCK_', '').replace('_', ' ')}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#E8F2FA] text-[#2853f3]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#CFE2F2] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] text-[11px] font-bold text-[#516C8A] uppercase tracking-wider border-b border-[#CFE2F2]">
                <th className="p-3 pl-4">Transaction ID & Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Resource & Category</th>
                <th className="p-3 text-right">Quantity Change</th>
                <th className="p-3">Reference / Order ID</th>
                <th className="p-3 text-right">Updated Stock</th>
                <th className="p-3">Authorized By</th>
                <th className="p-3 pr-4">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5FA] text-xs text-[#152B44]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#516C8A]">
                    No transactions found for the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F9FCFF] transition-colors">
                    {/* ID & Date */}
                    <td className="p-3 pl-4">
                      <div className="font-mono font-bold text-[#2853f3]">{item.id}</div>
                      <div className="text-[10px] text-[#516C8A] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{item.transactionDate.split(' ')[0]}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-3">{getTransactionBadge(item.type)}</td>

                    {/* Resource & Category */}
                    <td className="p-3">
                      <div className="font-bold text-[#152B44]">{item.resourceName}</div>
                      <div className="text-[10px] text-[#516C8A]">{item.category}</div>
                    </td>

                    {/* Quantity Change */}
                    <td className="p-3 text-right font-mono font-bold text-sm">
                      <span
                        className={
                          item.quantityChange > 0
                            ? 'text-[#24824F]'
                            : item.quantityChange < 0
                            ? 'text-[#D95D58]'
                            : 'text-[#516C8A]'
                        }
                      >
                        {item.quantityChange > 0 ? `+${item.quantityChange.toLocaleString()}` : item.quantityChange.toLocaleString()}
                      </span>
                    </td>

                    {/* Reference ID */}
                    <td className="p-3 font-mono font-semibold text-[#152B44] text-[11px]">
                      {item.referenceId}
                    </td>

                    {/* Updated Stock */}
                    <td className="p-3 text-right font-mono font-bold text-[#152B44]">
                      {item.updatedStock.toLocaleString()}
                    </td>

                    {/* Authorized By */}
                    <td className="p-3 text-[11px] text-[#516C8A]">
                      <div className="flex items-center gap-1 text-[#152B44] font-medium">
                        <User className="w-3 h-3 text-[#2853f3]" />
                        <span>{item.operator}</span>
                      </div>
                    </td>

                    {/* Operational Notes */}
                    <td className="p-3 pr-4 text-[11px] text-[#516C8A] max-w-xs truncate" title={item.notes}>
                      {item.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
